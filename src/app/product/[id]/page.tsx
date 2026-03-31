export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { MOCK_PRODUCTS } from "@/shared/mock/products";
import ClientPage from './ClientPage';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) return { title: "상품을 찾을 수 없습니다" };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${id}` },
    openGraph: {
      title: `${product.name} — By MOMO`,
      description: product.description,
      images: [{ url: product.imageUrl, width: 600, height: 500, alt: product.imageAlt }],
    },
  };
}

export default function Page() {
  return <ClientPage />;
}
