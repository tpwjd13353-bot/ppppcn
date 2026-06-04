import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 이용약관",
  description: "(주)퍼플페퍼가 운영하는 PURPLEPEPPER(ppppcn.com) 서비스 이용약관입니다.",
  alternates: { canonical: "https://ppppcn.com/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
        서비스 이용약관
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        최종 시행일: 2026년 6월 4일
      </p>

      <Section title="제1조 (목적)">
        <p>
          본 약관은 <b>(주)퍼플페퍼</b>(이하 “회사”)가 운영하는 PURPLEPEPPER(ppppcn.com,
          이하 “서비스”)의 이용과 관련하여 회사와 이용자의 권리·의무·책임 사항 등 기본적인
          사항을 정함을 목적으로 합니다.
        </p>
      </Section>

      <Section title="제2조 (용어의 정의)">
        <ol>
          <li>
            <b>“서비스”</b>란 회사가 제공하는 중국 마케팅 컨설팅·상권 분석·플랫폼 운영 대행
            등 일체의 온·오프라인 서비스를 의미합니다.
          </li>
          <li>
            <b>“이용자”</b>란 본 약관에 따라 서비스를 이용하는 개인 또는 법인 사업자를
            말합니다.
          </li>
          <li>
            <b>“회원”</b>이란 회사에 개인정보를 제공하고 회원 등록을 한 이용자로서, 회사가
            제공하는 서비스를 지속적으로 이용할 수 있는 자를 말합니다.
          </li>
        </ol>
      </Section>

      <Section title="제3조 (약관의 게시와 개정)">
        <ol>
          <li>
            회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 화면(푸터)에
            게시합니다.
          </li>
          <li>
            회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정 시
            적용일자 및 개정사유를 명시하여 시행일 7일 이전부터 공지합니다. 이용자에게
            불리하거나 중대한 사항의 변경은 30일 전부터 공지합니다.
          </li>
          <li>
            이용자가 개정 약관의 적용에 동의하지 아니하는 경우, 회사는 개정 약관의 내용을
            적용할 수 없으며, 이용자는 이용 계약을 해지할 수 있습니다.
          </li>
        </ol>
      </Section>

      <Section title="제4조 (서비스의 제공)">
        <ol>
          <li>회사가 제공하는 서비스는 다음과 같습니다.</li>
          <li className="list-none pl-4">
            ① 매장 상권·메뉴 분석 도구 및 결과 보고서 제공
            <br />
            ② 따종디엔핑·샤오홍슈·고덕지도·도우인·웨이보 등 중국 플랫폼 운영 대행
            <br />
            ③ 콘텐츠 기획·시딩(KOC/KOL) 운영
            <br />
            ④ 위 각 호에 부수되는 상담·컨설팅·자료 제공
          </li>
          <li>
            회사는 운영상·기술상 필요한 경우 서비스 일부 또는 전부를 변경할 수 있으며,
            변경 사항은 사전 공지합니다. 다만, 긴급한 사유가 있는 경우 사후 공지할 수
            있습니다.
          </li>
        </ol>
      </Section>

      <Section title="제5조 (회원가입 및 회원정보의 관리)">
        <ol>
          <li>
            이용자는 회사가 정한 절차에 따라 가입 신청을 하고 회원의 동의 절차를 거쳐
            회원으로 가입됩니다.
          </li>
          <li>
            회원은 가입 시 등록한 정보에 변경이 있는 경우, 본인 정보를 수정할 의무를
            가집니다.
          </li>
          <li>
            회원의 아이디·비밀번호의 관리 책임은 회원에게 있으며, 이를 제3자가 사용하도록
            허락해서는 안 됩니다.
          </li>
        </ol>
      </Section>

      <Section title="제6조 (서비스 이용 및 제한)">
        <ol>
          <li>
            이용자는 본 약관 및 관계 법령, 회사가 정한 운영 정책을 준수하여야 합니다.
          </li>
          <li>
            회사는 이용자가 다음 각 호의 행위를 한 경우, 서비스 이용을 제한하거나 회원
            자격을 정지·상실시킬 수 있습니다.
            <ul className="ml-5 mt-2 list-disc">
              <li>타인의 정보를 도용하거나 허위 정보를 등록한 경우</li>
              <li>서비스 운영을 방해하는 행위</li>
              <li>관계 법령 또는 공공질서·미풍양속에 반하는 행위</li>
            </ul>
          </li>
        </ol>
      </Section>

      <Section title="제7조 (요금 및 결제)">
        <ol>
          <li>
            매장 상권 분석 도구의 기본 이용은 무료입니다. 단, 상세 PDF 보고서는 회원 계정당
            제공 횟수가 제한될 수 있습니다.
          </li>
          <li>
            대행 서비스 비용은 별도 견적·계약을 통해 정하며, 본 약관과 개별 계약의 내용이
            상충할 경우 개별 계약이 우선합니다.
          </li>
        </ol>
      </Section>

      <Section title="제8조 (지식재산권)">
        <ol>
          <li>
            서비스 내 게시된 모든 콘텐츠(분석 도구·보고서 양식·문서·이미지 등)에 대한
            저작권 등 일체의 지식재산권은 회사에 귀속됩니다.
          </li>
          <li>
            이용자는 회사의 사전 서면 동의 없이 본 서비스에서 얻은 정보를 영리 목적으로
            복제·재배포·가공·변형해서는 안 됩니다.
          </li>
        </ol>
      </Section>

      <Section title="제9조 (개인정보 보호)">
        <p>
          회사는 이용자의 개인정보를 관계 법령 및 회사의{" "}
          <a href="/privacy" className="text-primary underline">개인정보처리방침</a>에 따라
          안전하게 처리·보관합니다.
        </p>
      </Section>

      <Section title="제10조 (책임의 제한)">
        <ol>
          <li>
            본 서비스의 분석·예측 결과는 통계 데이터에 기반한 추정치이며, 실제 매출·고객
            반응을 보장하지 않습니다.
          </li>
          <li>
            회사는 천재지변·전쟁·국가 비상사태·인터넷 장애 등 회사의 통상적 통제를 벗어난
            사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
          </li>
        </ol>
      </Section>

      <Section title="제11조 (분쟁 해결과 재판관할)">
        <p>
          본 약관 또는 서비스와 관련한 분쟁은 대한민국 법령을 적용하며, 회사 본사 소재지
          관할 법원을 1심 전속관할 법원으로 합니다.
        </p>
      </Section>

      <Section title="부칙">
        <p>본 약관은 2026년 6월 4일부터 시행합니다.</p>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-heading text-lg font-bold tracking-tight md:text-xl">
        {title}
      </h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ul]:space-y-1 [&_b]:text-foreground">
        {children}
      </div>
    </section>
  );
}
