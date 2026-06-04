import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "(주)퍼플페퍼가 운영하는 PURPLEPEPPER(ppppcn.com)의 개인정보처리방침입니다.",
  alternates: { canonical: "https://ppppcn.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
        개인정보처리방침
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        최종 시행일: 2026년 6월 4일
      </p>

      <Section title="1. 총칙">
        <p>
          <b>(주)퍼플페퍼</b>(이하 “회사”)는 「개인정보 보호법」 등 관련 법령을 준수하고
          있으며, 정보주체의 개인정보를 안전하게 처리하기 위해 본 개인정보처리방침을
          수립·공개합니다.
        </p>
      </Section>

      <Section title="2. 수집하는 개인정보 항목 및 수집 방법">
        <p className="font-medium text-foreground">필수 수집 항목</p>
        <ul>
          <li>
            <b>회원가입·로그인 시:</b> 이메일, 비밀번호(암호화 저장), 휴대폰 번호, 상호명
          </li>
          <li>
            <b>카카오 로그인 시:</b> 카카오 계정에서 제공하는 이메일, 닉네임, 프로필
            이미지(선택)
          </li>
          <li>
            <b>매장 분석 기능 이용 시:</b> 입력한 네이버 플레이스 URL, 매장 정보(상호명,
            메뉴, 주소), 분석 결과 데이터
          </li>
          <li>
            <b>상담 신청 시:</b> 상호명, 연락처(전화), 업종, 지역, 상담 내용
          </li>
        </ul>
        <p className="mt-3 font-medium text-foreground">선택 수집 항목</p>
        <ul>
          <li>지역, 업종, 네이버 플레이스 URL, 예산 등 부가 정보</li>
        </ul>
        <p className="mt-3 font-medium text-foreground">자동 수집 항목</p>
        <ul>
          <li>접속 IP 주소(해시 저장), User-Agent(해시 저장), 쿠키, 서비스 이용 기록</li>
        </ul>
        <p className="mt-3 font-medium text-foreground">수집 방법</p>
        <ul>
          <li>회원가입·서비스 이용·상담 신청 폼을 통한 직접 입력</li>
          <li>카카오 등 외부 인증 서비스 연동</li>
          <li>쿠키·로그 기록 자동 수집</li>
        </ul>
      </Section>

      <Section title="3. 개인정보 수집·이용 목적">
        <ol>
          <li>회원 식별·관리·서비스 제공</li>
          <li>매장 분석 결과 생성, PDF 보고서 발급 및 발송</li>
          <li>상담 신청 응대 및 후속 컨설팅 진행</li>
          <li>서비스 개선·신규 기능 개발을 위한 통계 분석</li>
          <li>부정 이용 방지, 비인가 접근 차단</li>
          <li>관련 법령상 의무 이행</li>
        </ol>
      </Section>

      <Section title="4. 개인정보 보유 및 이용기간">
        <ul>
          <li>
            <b>회원 정보:</b> 회원 탈퇴 시까지. 단, 관계 법령에 따른 보존 의무가 있는 경우
            해당 기간 동안 보관
          </li>
          <li>
            <b>분석 결과 데이터:</b> 회원 탈퇴 시까지(원본 데이터 보관). 통계용 익명 처리
            데이터는 분리 보관
          </li>
          <li>
            <b>상담 신청 내역:</b> 신청일로부터 3년
          </li>
          <li>
            <b>접속 로그·쿠키:</b> 1년 이내 자동 파기
          </li>
        </ul>
        <p className="mt-3 font-medium text-foreground">
          관계 법령에 따른 보관 기간
        </p>
        <ul>
          <li>전자상거래법: 계약·청약철회 5년, 대금 결제·재화 공급 5년, 소비자 불만·분쟁 처리 3년</li>
          <li>통신비밀보호법: 로그인 기록 3개월</li>
        </ul>
      </Section>

      <Section title="5. 개인정보의 제3자 제공">
        <p>
          회사는 정보주체의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만, 다음의
          경우는 예외로 합니다.
        </p>
        <ul>
          <li>정보주체로부터 별도의 동의를 받은 경우</li>
          <li>법령에 특별한 규정이 있거나 수사기관의 적법한 요청이 있는 경우</li>
        </ul>
      </Section>

      <Section title="6. 개인정보 처리의 위탁">
        <p>
          회사는 서비스 향상 및 안정적 운영을 위해 다음과 같이 개인정보 처리 업무를
          외부에 위탁할 수 있습니다.
        </p>
        <ul>
          <li>
            <b>Railway·Cloudflare 등 호스팅/CDN:</b> 서비스 운영 인프라
          </li>
          <li>
            <b>OpenAI:</b> 매장 맞춤형 콘텐츠 가이드 자동 생성 (매장 메뉴·지역 데이터,
            개인 식별 정보는 포함되지 않음)
          </li>
          <li>
            <b>Resend:</b> 시스템 이메일 발송
          </li>
        </ul>
      </Section>

      <Section title="7. 정보주체의 권리·의무 및 행사 방법">
        <p>정보주체는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
        <ul>
          <li>개인정보 열람 요구</li>
          <li>오류 등이 있을 경우 정정·삭제 요구</li>
          <li>처리 정지 요구</li>
          <li>회원 탈퇴를 통한 개인정보 삭제</li>
        </ul>
        <p className="mt-2">
          위 권리는 회사 개인정보 보호책임자에게 서면·이메일·전화로 청구할 수 있으며, 회사는
          이에 대해 지체 없이 조치하겠습니다.
        </p>
      </Section>

      <Section title="8. 개인정보의 파기">
        <p>
          회사는 개인정보 보유기간의 경과·처리 목적 달성 등 개인정보가 불필요하게 된
          때에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일은 복구·재생할 수 없는
          방법으로 영구 삭제하며, 종이 출력물은 분쇄·소각합니다.
        </p>
      </Section>

      <Section title="9. 개인정보의 안전성 확보 조치">
        <ul>
          <li>비밀번호 단방향 암호화(bcrypt)</li>
          <li>HTTPS 전 구간 적용</li>
          <li>접속 권한 최소화 및 접근 통제</li>
          <li>해킹·악성코드 방지를 위한 보안 프로그램 운영</li>
          <li>접속 IP·User-Agent 해시 저장으로 식별 정보 최소화</li>
        </ul>
      </Section>

      <Section title="10. 쿠키 사용에 관한 사항">
        <p>
          회사는 이용자 식별 및 로그인 세션 유지를 위해 쿠키를 사용합니다. 이용자는
          브라우저 설정을 통해 쿠키 저장을 거부할 수 있으며, 이 경우 일부 서비스 이용에
          제한이 있을 수 있습니다.
        </p>
      </Section>

      <Section title="11. 개인정보 보호책임자">
        <div className="rounded-lg border border-border/40 bg-background/40 p-4">
          <p><b>성명:</b> 김세정</p>
          <p className="mt-1"><b>이메일:</b> sejeong13@pppp.team</p>
          <p className="mt-1"><b>전화:</b> 010-2991-5990</p>
        </div>
        <p className="mt-3">
          정보주체는 회사의 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의·불만
          처리·피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
        </p>
      </Section>

      <Section title="12. 권익침해 구제 방법">
        <p>
          개인정보 침해로 인한 신고·상담이 필요한 경우 아래 기관에 문의하실 수 있습니다.
        </p>
        <ul>
          <li>개인정보분쟁조정위원회 (privacy.go.kr / 1833-6972)</li>
          <li>개인정보침해신고센터 (privacy.kisa.or.kr / 118)</li>
          <li>경찰청 사이버수사국 (ecrm.police.go.kr / 182)</li>
          <li>대검찰청 사이버수사과 (spo.go.kr / 1301)</li>
        </ul>
      </Section>

      <Section title="13. 개정 이력">
        <ul>
          <li>2026년 6월 4일: 최초 시행</li>
        </ul>
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
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_b]:text-foreground">
        {children}
      </div>
    </section>
  );
}
