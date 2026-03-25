'use client';

export const dynamic = 'force-dynamic';

// 관리자 대시보드 — 통계 카드 + 최근 주문 테이블 (더미 데이터)
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

// 더미 통계 데이터
const MOCK_STATS = [
  { label: '총 주문', value: '127', unit: '건' },
  { label: '이번 달 매출', value: '3,840,000', unit: '원' },
  { label: '가입 회원', value: '89', unit: '명' },
];

// 더미 주문 데이터
const MOCK_ORDERS = [
  { id: 'MOMO-20260301', customer: '김서영', product: '오리 트릿', amount: 18000, status: '배송 완료' },
  { id: 'MOMO-20260302', customer: '이모모', product: '생일 선물 세트', amount: 42000, status: '제조 중' },
  { id: 'MOMO-20260303', customer: '박뭉치', product: '연어 트릿', amount: 22000, status: '주문 확인' },
  { id: 'MOMO-20260304', customer: '최보리', product: '소고기 시니어', amount: 20000, status: '출고 대기' },
];

export default function AdminPage() {
  return (
    <>
      <GNB />

      <div className="px-6 py-10">
        <h1 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--charcoal)] mb-10">
          Admin
        </h1>

        {/* ── 통계 카드 ── */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {MOCK_STATS.map((stat) => (
            <div key={stat.label} className="bg-[var(--cream)] rounded-xl p-5 text-center">
              <p className="text-[10px] text-[var(--warm-taupe)] font-[var(--font-ui)] uppercase tracking-[0.15em] mb-1">
                {stat.label}
              </p>
              <p className="text-[20px] font-[var(--font-ui)] font-semibold text-[var(--walnut)]">
                {stat.value}
              </p>
              <p className="text-[12px] text-[var(--warm-gray)]">{stat.unit}</p>
            </div>
          ))}
        </div>

        {/* ── 최근 주문 ── */}
        <section>
          <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
            Recent Orders
          </p>
          <div className="border border-[var(--oatmeal)] rounded-xl overflow-hidden">
            {MOCK_ORDERS.map((order, idx) => (
              <div
                key={order.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  idx < MOCK_ORDERS.length - 1 ? 'border-b border-[var(--oatmeal)]' : ''
                }`}
              >
                <div>
                  <p className="text-[14px] font-medium text-[var(--charcoal)]">
                    {order.customer}
                  </p>
                  <p className="text-[12px] text-[var(--warm-gray)]">
                    {order.product} · {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-[var(--font-ui)] font-medium text-[var(--walnut)]">
                    ₩{order.amount.toLocaleString()}
                  </p>
                  <p className="text-[12px] text-[var(--warm-taupe)]">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
