"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface Props {
  fileName?: string;
}

/**
 * 결과 페이지의 main(.result-scope) 영역을 html2canvas로 캡쳐 → jsPDF로 A4 PDF 생성.
 * 브라우저 인쇄(window.print) 대신 우리가 직접 만들어서:
 *  - 브라우저 헤더(날짜·URL)·흰 여백 없음
 *  - 페이지 분할을 우리가 제어 (섹션 단위로 끊김)
 *  - 한글·이미지는 캔버스 이미지로 박혀서 깨지지 않음
 */
export function PrintButton({ fileName }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (busy) return;
    setBusy(true);

    // body에 캡쳐 모드 클래스 — 캡쳐 동안 일부 UI 숨김
    document.body.classList.add("pdf-capturing");

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const target =
        (document.querySelector("main.result-scope") as HTMLElement | null) ??
        (document.querySelector("main") as HTMLElement | null);
      if (!target) {
        alert("결과 영역을 찾지 못했어요. 페이지를 새로고침 후 다시 시도해주세요.");
        return;
      }

      // 캡쳐 중에는 transform/sticky 등이 어색하므로 잠시 대기 (레이아웃 안정화)
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      // 디바이스 픽셀 비율을 곱해서 선명한 캡쳐 (2x 정도가 적당, 너무 크면 메모리 폭주)
      const scale = Math.min(window.devicePixelRatio || 1, 2);

      const canvas = await html2canvas(target, {
        scale,
        backgroundColor: "#0a0a0b",
        useCORS: true,
        allowTaint: false,
        logging: false,
        windowWidth: target.scrollWidth,
        windowHeight: target.scrollHeight,
        onclone: (clonedDoc) => {
          // 클론된 문서에서도 캡쳐 모드 적용 (워터마크·버튼 숨김)
          clonedDoc.body.classList.add("pdf-capturing");
        },
      });

      // A4 세로 (210 x 297mm). canvas를 width에 맞추고, height는 비율 유지하며 페이지 분할
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidthMm = pdf.internal.pageSize.getWidth(); // 210
      const pageHeightMm = pdf.internal.pageSize.getHeight(); // 297

      const imgWidthMm = pageWidthMm;
      const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      // 페이지 분할:
      //  - 캔버스 전체를 페이지 너비에 맞춘 imgHeightMm로 환산
      //  - imgHeightMm를 pageHeightMm 단위로 잘라 페이지마다 음수 y로 밀어서 노출
      //  - 마지막 페이지는 남은 콘텐츠 높이에 딱 맞게 페이지 크기를 줄여서 흰 여백 제거
      const totalPages = Math.max(1, Math.ceil(imgHeightMm / pageHeightMm));
      const bottomPaddingMm = 4;
      const minLastPageHeightMm = 50;

      for (let i = 0; i < totalPages; i++) {
        const isLast = i === totalPages - 1;
        const remainingMm = imgHeightMm - i * pageHeightMm;
        const shrinkLast = isLast && remainingMm < pageHeightMm;
        const thisPageHeightMm = shrinkLast
          ? Math.max(remainingMm + bottomPaddingMm, minLastPageHeightMm)
          : pageHeightMm;

        if (i === 0) {
          // jsPDF가 자동으로 만든 첫 페이지 — 한 페이지로 끝날 만큼 짧으면 크기 줄임
          if (shrinkLast) {
            pdf.deletePage(1);
            pdf.addPage([pageWidthMm, thisPageHeightMm], "portrait");
          }
        } else if (shrinkLast) {
          pdf.addPage([pageWidthMm, thisPageHeightMm], "portrait");
        } else {
          pdf.addPage();
        }

        // 배경 다크 + 이미지를 음수 y로 밀어 해당 페이지 영역 노출
        pdf.setFillColor(10, 10, 11);
        pdf.rect(0, 0, pageWidthMm, thisPageHeightMm, "F");
        const positionMm = -i * pageHeightMm;
        pdf.addImage(imgData, "JPEG", 0, positionMm, imgWidthMm, imgHeightMm);
      }

      const safeName = (fileName ?? "분석 결과")
        .replace(/[/\\?%*:|"<>]/g, "_")
        .slice(0, 60);
      pdf.save(`${safeName}_퍼플페퍼.pdf`);
    } catch (e) {
      console.error("[pdf] generation failed:", e);
      alert("PDF 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      document.body.classList.remove("pdf-capturing");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="rc-print-btn inline-flex items-center gap-1.5 rounded-md border border-[var(--rc-line)] bg-[var(--rc-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--rc-txt2)] transition hover:border-[var(--rc-red)] hover:text-[var(--rc-red)] disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="이 페이지를 PDF로 저장"
    >
      {busy ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          PDF 만드는 중…
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5" />
          PDF로 저장
        </>
      )}
    </button>
  );
}
