import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { InquiryForm } from "@/components/sections/InquiryForm";
import { MessageCircle, Mail, Phone, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "상담 신청 — 무료 컨설팅",
  description:
    "방한 중국 관광객 마케팅 상담을 신청하세요. 김세정 본부장 직접 응대. 카카오 오픈채팅·전화·이메일·문의 폼.",
  alternates: { canonical: "https://ppppcn.com/contact" },
  openGraph: {
    title: "상담 신청 — 퍼플페퍼",
    description:
      "방한 중국 관광객 마케팅 무료 상담. 따종디엔핑·샤오홍슈·고덕지도 전문.",
    url: "https://ppppcn.com/contact",
  },
};

const KAKAO_URL = "https://open.kakao.com/o/skmX5Pwi";

const CHANNELS = [
  {
    icon: Mail,
    label: "이메일",
    value: "sejeong13@pppp.team",
    href: "mailto:sejeong13@pppp.team",
  },
  {
    icon: Phone,
    label: "전화",
    value: "010-2991-5990",
    href: "tel:010-2991-5990",
  },
];

const TRUST = [
  "메이투안 본사 공식 인증 대행사",
  "일평균 매장 광고 12,400건 집행",
  "직접 운영 매장 연 매출 15억·58억 검증",
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            광고비가 새고 있는지부터
            <br />
            <span className="text-primary">무료로 점검</span>해드립니다.
          </>
        }
        subtitle="업종과 지역만 알려주시면 됩니다. 매장에 맞는 채널과 예상 효과를 정리해 드립니다."
      />

      <main className="flex-1">
        {/* 상담 신청 폼 */}
        <section className="border-b border-border/30 py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
              상담 신청하기
            </h2>
            <p className="mb-10 text-sm text-muted-foreground md:text-base">
              상호명과 연락처만 남겨주시면, 매장에 맞는 채널과 예상 효과를 정리해 연락드립니다.
            </p>
            <InquiryForm />
          </div>
        </section>

        {/* 다른 연락 수단 */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-10 font-heading text-2xl font-bold md:text-3xl">
              다른 방법으로 문의
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* 카카오 메인 CTA */}
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-primary/40 bg-primary/[0.05] p-8 transition hover:border-primary md:p-10"
              >
                <div>
                  <MessageCircle className="h-9 w-9 text-primary" />
                  <h2 className="mt-6 font-heading text-2xl font-bold md:text-3xl">
                    카카오톡 상담
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    가장 빠른 상담 방법입니다. 업종·지역만 남겨주시면 담당자가 안내드립니다.
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  지금 상담 신청
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>

              {/* 기타 연락 수단 */}
              <div className="flex flex-col gap-6">
                {CHANNELS.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <a
                      key={ch.label}
                      href={ch.href}
                      className="group flex items-center gap-5 rounded-2xl border border-border/40 p-6 transition hover:border-primary/60"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/40 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-body-en text-xs uppercase tracking-wider text-muted-foreground">
                          {ch.label}
                        </div>
                        <div className="mt-1 font-heading text-lg font-bold">
                          {ch.value}
                        </div>
                      </div>
                    </a>
                  );
                })}

                <div className="rounded-2xl border border-border/40 p-6">
                  <ul className="space-y-3">
                    {TRUST.map((t) => (
                      <li
                        key={t}
                        className="flex items-start gap-3 text-sm text-foreground/80"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p className="mt-12 text-center text-sm text-muted-foreground">
              퍼플페퍼 · 따종디엔핑 공식 대행사 · 메이투안 본사 정식 인증
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
