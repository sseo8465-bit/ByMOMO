// 루트 레이아웃 — 브랜드 폰트 로드 + 카카오 SDK + SEO 메타 + 모바일 컨테이너
import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, DM_Sans, Noto_Serif_KR } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// 한글 명조체 — 큐레이션 페이지 타이틀 등 감성적 강조용
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ── 사이트 전역 URL ──
const SITE_URL = "https://by-momo.vercel.app";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  title: {
    default: "By MOMO — 내 아이를 위한 단 하나뿐인 선물",
    template: "%s | By MOMO",
  },
  description:
    "알러지, 나이, 체중까지 확인하고 안심할 수 있는 프리미엄 수제간식. 소량 수제, 주문 후 제조. 맞춤 추천부터 선물 포장까지.",
  keywords: [
    "강아지 수제간식",
    "반려견 맞춤 간식",
    "프리미엄 수제간식",
    "강아지 알러지 간식",
    "단일 단백질 간식",
    "시니어 강아지 간식",
    "강아지 생일 선물",
    "By MOMO",
    "바이모모",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "By MOMO",
    title: "내 아이를 위한 단 하나뿐인 선물, By MOMO",
    description:
      "알러지·나이·체중까지 확인한 프리미엄 수제간식. 소량 수제, 주문 후 제조.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "By MOMO — 프리미엄 수제 반려견 간식",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "내 아이를 위한 단 하나뿐인 선물, By MOMO",
    description:
      "알러지·나이·체중까지 확인한 프리미엄 수제간식. 소량 수제, 주문 후 제조.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// ── Organization JSON-LD (전 페이지 공통) ──
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "By MOMO",
  alternateName: "바이모모",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "알러지·나이·체중까지 확인한 프리미엄 수제 반려견 간식 브랜드",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "Korean",
  },
  sameAs: ["https://instagram.com/bymomo.official"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${cormorant.variable} ${dmSans.variable} ${notoSerifKR.variable}`}>
      <head>
        {/* 카카오 로그인 JavaScript SDK */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2ezmFnkl8h0hSBeDNKhRB6nOutkbmKmz/+KDrtoKJVBKy"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Organization JSON-LD — 검색엔진 브랜드 인식 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <div className="app-container">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
