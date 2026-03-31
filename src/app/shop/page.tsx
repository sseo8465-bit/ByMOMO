export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Shop — 프리미엄 수제간식",
  description: "오리, 연어, 소고기. 단일 단백질 기반 프리미엄 수제간식. 알러지·나이·체중까지 확인한 안심 레시피.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "프리미엄 수제간식 컬렉션 — By MOMO",
    description: "모든 원재료를 투명하게 공개합니다. 알러지, 나이, 체중까지 확인한 안심 수제간식.",
  },
};

export default function ShopPage() {
  return <ClientPage />;
}
