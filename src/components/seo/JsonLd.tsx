// 검색엔진용 구조화 데이터 (JSON-LD) — Organization, WebSite, LocalBusiness
//
// 네이버는 Organization·WebSite·LocalBusiness schema.org 데이터를 활용해
// 검색 결과에 회사 정보 패널·사이트링크·연락처 등을 노출합니다.

const SITE_URL = "https://ppppcn.com";

export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: "퍼플페퍼",
    alternateName: ["PURPLEPEPPER", "퍼플페퍼 코퍼레이션"],
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "방한 중국 관광객을 매장으로 연결하는 중국 마케팅 전문 대행사. 따종디엔핑·샤오홍슈·고덕지도·도우인·웨이보. 메이투안 본사 정식 인증.",
    foundingDate: "2024",
    sameAs: [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+82-10-2991-5990",
        contactType: "customer support",
        areaServed: "KR",
        availableLanguage: ["Korean", "Chinese", "English"],
        email: "sejeong13@pppp.team",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressLocality: "서울",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: "퍼플페퍼 PURPLEPEPPER",
    description:
      "중국 관광객 마케팅 전문 대행사 — 따종디엔핑·샤오홍슈·고덕지도 공식 운영",
    inLanguage: "ko-KR",
    publisher: { "@id": `${SITE_URL}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/insights?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}#localbusiness`,
    name: "퍼플페퍼 PURPLEPEPPER",
    image: `${SITE_URL}/opengraph-image`,
    url: SITE_URL,
    telephone: "+82-10-2991-5990",
    email: "sejeong13@pppp.team",
    priceRange: "₩₩₩",
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressLocality: "서울특별시",
    },
    areaServed: { "@type": "Country", name: "대한민국" },
    serviceType: [
      "중국 마케팅 대행",
      "따종디엔핑 매장 운영",
      "샤오홍슈 KOC/KOL 시딩",
      "고덕지도 등록",
      "중국 관광객 인바운드 마케팅",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
    </>
  );
}
