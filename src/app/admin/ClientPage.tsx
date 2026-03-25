'use client';

// ──────────────────────────────────────────────
// 관리자 대시보드 — 와이어프레임 v2.1 기준 재구현
// ──────────────────────────────────────────────
// 최상단: 오늘의 주문 + 날짜
// 상태별 카운트 보드: 신규 주문 / 제조 중 / 배송 중
// 주문 목록: 주문번호, 주문자, 아이 이름(견종), 선택 간식, 금액, 상태
// 하단: [라벨 일괄 출력] 버튼 → 클릭 시 프린트용 라벨 양식 팝업
//
// 디자인: By MOMO 브랜드 톤(베이지/월넛) + PVCS급 깨끗한 테이블
// 데이터: 더미 데이터 (Phase 2에서 Supabase 연동 예정)
// 수정 가이드: 주문 데이터는 MOCK_ORDERS 배열만 변경하면 전체 반영
// ──────────────────────────────────────────────

import { useState, useMemo, useRef } from 'react';

// ── 주문 상태 타입 ──
type OrderStatus = '신규 주문' | '제조 중' | '배송 중' | '배송 완료';

// ── 주문 데이터 인터페이스 ──
interface Order {
  id: string;               // 주문번호
  customerName: string;      // 주문자 이름
  petName: string;           // 아이 이름
  petBreed: string;          // 견종
  items: string;             // 선택 간식
  amount: number;            // 결제 금액
  status: OrderStatus;       // 주문 상태
  customLabel?: string;      // 커스텀 라벨 (선물 포장용)
  trackingNumber?: string;   // 송장번호 (배송 중일 때)
}

// ── 더미 주문 데이터 ──
// 실제 주문이 들어오면 이 배열을 Supabase에서 fetch하는 로직으로 교체
const MOCK_ORDERS: Order[] = [
  {
    id: '#2026032301',
    customerName: '서영',
    petName: '모모',
    petBreed: '말티즈',
    items: '오리 트릿 + 연어 트릿',
    amount: 40000,
    status: '신규 주문',
    customLabel: "모모's",
  },
  {
    id: '#2026032202',
    customerName: '지현',
    petName: '콩이',
    petBreed: '포메라니안',
    items: '맞춤 선물 세트',
    amount: 38000,
    status: '제조 중',
    customLabel: "콩이's",
  },
  {
    id: '#2026032101',
    customerName: '민수',
    petName: '초코',
    petBreed: '푸들',
    items: '사슴 건조간식 × 2',
    amount: 36000,
    status: '배송 중',
    trackingNumber: '123456789',
  },
  {
    id: '#2026032001',
    customerName: '수진',
    petName: '두부',
    petBreed: '비숑',
    items: '생일 선물 세트',
    amount: 42000,
    status: '배송 완료',
  },
];

// ── 상태별 배지 스타일 ──
// 상태 추가 시 여기에 색상 매핑 추가
const STATUS_STYLES: Record<OrderStatus, string> = {
  '신규 주문': 'bg-[var(--cream)] text-[var(--walnut)] border border-[var(--walnut)]',
  '제조 중':   'bg-[#FFF8E1] text-[#8D6E37] border border-[#D4A843]',
  '배송 중':   'bg-[#E8F0E4] text-[#4A6741] border border-[#7A9E6F]',
  '배송 완료': 'bg-[var(--oatmeal)] text-[var(--warm-gray)] border border-[var(--warm-taupe-light)]',
};

// ── 날짜 포맷 ──
function getTodayFormatted(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[now.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

// ── 가격 포맷 ──
function formatPrice(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

export default function AdminPage() {
  // ── 상태 필터 (전체 / 신규 주문 / 제조 중 / 배송 중) ──
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');

  // ── 프린트 영역 ref ──
  const printRef = useRef<HTMLDivElement>(null);

  // ── 상태별 주문 수 계산 ──
  const statusCounts = useMemo(() => ({
    '신규 주문': MOCK_ORDERS.filter((o) => o.status === '신규 주문').length,
    '제조 중':   MOCK_ORDERS.filter((o) => o.status === '제조 중').length,
    '배송 중':   MOCK_ORDERS.filter((o) => o.status === '배송 중').length,
  }), []);

  // ── 필터링된 주문 목록 ──
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') return MOCK_ORDERS;
    return MOCK_ORDERS.filter((o) => o.status === activeFilter);
  }, [activeFilter]);

  // ── 라벨 일괄 출력 (프린트) ──
  const handlePrintLabels = () => {
    // 배송 대상 주문만 필터 (신규 주문 + 제조 중 + 배송 중)
    const printableOrders = MOCK_ORDERS.filter(
      (o) => o.status !== '배송 완료'
    );

    // 새 창에 프린트용 라벨 양식 생성
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const labelsHtml = printableOrders
      .map(
        (order) => `
      <div style="border: 1px solid #EDE6D8; padding: 24px; margin-bottom: 16px; page-break-inside: avoid; font-family: 'Pretendard', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <strong style="font-size: 16px; color: #6B5344;">By MOMO</strong>
          <span style="font-size: 11px; color: #8A7D6F;">${order.id}</span>
        </div>
        <div style="border-top: 1px solid #EDE6D8; padding-top: 12px;">
          <p style="font-size: 13px; margin: 4px 0;"><strong>받는 분:</strong> ${order.customerName}님</p>
          <p style="font-size: 13px; margin: 4px 0;"><strong>반려견:</strong> ${order.petName} (${order.petBreed})</p>
          <p style="font-size: 13px; margin: 4px 0;"><strong>상품:</strong> ${order.items}</p>
          ${order.customLabel ? `<p style="font-size: 13px; margin: 4px 0;"><strong>커스텀 라벨:</strong> ${order.customLabel}</p>` : ''}
          ${order.trackingNumber ? `<p style="font-size: 13px; margin: 4px 0;"><strong>송장번호:</strong> ${order.trackingNumber}</p>` : ''}
        </div>
      </div>
    `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>By MOMO — 배송 라벨</title>
        <style>
          body { margin: 24px; font-family: 'Pretendard', -apple-system, sans-serif; color: #2C2C2C; }
          @media print { body { margin: 0; } }
          h1 { font-size: 14px; color: #6B5344; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>배송 라벨 — ${getTodayFormatted()}</h1>
        ${labelsHtml}
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      {/* ── 관리자 전용 GNB (일반 GNB 대신 간소화) ── */}
      <div className="bg-[var(--cream)] border-b border-[var(--oatmeal)]">
        <div className="max-w-[800px] mx-auto px-6 py-3 flex items-center justify-between">
          <span className="font-[var(--font-ui)] text-[14px] font-semibold text-[var(--walnut)] tracking-[0.04em]">
            ADMIN
          </span>
          <a
            href="/my"
            className="font-[var(--font-ui)] text-[12px] text-[var(--warm-gray)] hover:text-[var(--walnut)] tracking-[0.03em] transition-colors"
          >
            서영
          </a>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-8">

        {/* ── 오늘의 주문 헤더 ── */}
        <div className="mb-8">
          <h1 className="font-[var(--font-serif)] text-[20px] md:text-[24px] font-semibold text-[var(--walnut)] tracking-[0.01em] mb-1">
            오늘의 주문
          </h1>
          <p className="font-[var(--font-ui)] text-[12px] text-[var(--warm-gray)] tracking-[0.03em]">
            {getTodayFormatted()}
          </p>
        </div>

        {/* ── 상태별 카운트 보드 ── */}
        {/* 클릭 시 해당 상태로 필터링 */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {(
            [
              { status: '신규 주문' as const, count: statusCounts['신규 주문'] },
              { status: '제조 중' as const, count: statusCounts['제조 중'] },
              { status: '배송 중' as const, count: statusCounts['배송 중'] },
            ] as const
          ).map(({ status, count }) => (
            <button
              key={status}
              onClick={() => setActiveFilter(activeFilter === status ? 'all' : status)}
              className={`border py-5 px-4 text-center transition-colors cursor-pointer ${
                activeFilter === status
                  ? 'border-[var(--walnut)] bg-[var(--cream)]'
                  : 'border-[var(--oatmeal)] bg-[var(--warm-white)] hover:border-[var(--warm-taupe-light)]'
              }`}
            >
              {/* 숫자 — Serif 강조 (와이어프레임 v2.2 사양) */}
              <p className="font-[var(--font-serif)] text-[32px] md:text-[36px] font-semibold text-[var(--charcoal)] leading-none mb-2">
                {count}
              </p>
              <p className="font-[var(--font-ui)] text-[10px] text-[var(--warm-gray)] tracking-[0.06em]">
                {status}
              </p>
            </button>
          ))}
        </div>

        {/* ── 주문 목록 섹션 ── */}
        <section ref={printRef}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[var(--font-ui)] text-[13px] font-semibold text-[var(--charcoal)] tracking-[0.02em]">
              주문 목록
            </h2>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="font-[var(--font-ui)] text-[10px] text-[var(--warm-taupe)] hover:text-[var(--walnut)] tracking-[0.06em] underline underline-offset-4 transition-colors"
              >
                전체 보기
              </button>
            )}
          </div>

          {/* ── 주문 카드 리스트 ── */}
          <div className="border-t border-[var(--oatmeal)]">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="py-5 px-1 border-b border-[var(--oatmeal)]"
              >
                {/* 상단: 주문번호 + 상태 배지 */}
                <div className="flex items-center justify-between mb-3">
                  <p className="font-[var(--font-ui)] text-[13px] font-semibold text-[var(--charcoal)] tracking-[0.01em]">
                    {order.id}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 text-[10px] font-[var(--font-ui)] font-medium tracking-[0.04em] ${STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* 하단: 주문 상세 — 주문자, 아이이름(견종), 간식, 금액, 라벨/송장 */}
                <div className="font-[var(--font-ui)] text-[12px] text-[var(--warm-gray)] leading-[1.8] tracking-[0.02em]">
                  <p>
                    {order.customerName}님 · {order.petName} ({order.petBreed})
                  </p>
                  <p>
                    {order.items} · {formatPrice(order.amount)}
                  </p>
                  {order.customLabel && (
                    <p>커스텀 라벨: {order.customLabel}</p>
                  )}
                  {order.trackingNumber && (
                    <p>송장번호: {order.trackingNumber}</p>
                  )}
                </div>
              </div>
            ))}

            {/* 필터 결과 없음 */}
            {filteredOrders.length === 0 && (
              <div className="py-10 text-center">
                <p className="font-[var(--font-ui)] text-[12px] text-[var(--warm-taupe)] tracking-[0.04em]">
                  해당 상태의 주문이 없습니다.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── 라벨 일괄 출력 버튼 ── */}
        {/* 클릭 시 배송 대상 주문(배송 완료 제외)의 라벨을 프린트용 새 창으로 출력 */}
        <div className="mt-8 mb-10">
          <button
            onClick={handlePrintLabels}
            className="w-full py-4 bg-[var(--walnut)] text-[var(--cream)] text-[13px] font-[var(--font-ui)] font-medium tracking-[0.06em] hover:bg-[var(--walnut-dark)] transition-colors"
          >
            라벨 일괄 출력
          </button>
        </div>

        {/* ── 매출 요약 (기존 통계를 하단으로 이동) ── */}
        <section className="border-t border-[var(--oatmeal)] pt-8">
          <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-4">
            Monthly Summary
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '총 주문', value: `${MOCK_ORDERS.length}건` },
              { label: '매출', value: formatPrice(MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0)) },
              { label: '평균 객단가', value: formatPrice(Math.round(MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0) / MOCK_ORDERS.length)) },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[var(--font-ui)] text-[14px] font-semibold text-[var(--walnut)] tracking-[0.02em]">
                  {stat.value}
                </p>
                <p className="font-[var(--font-ui)] text-[10px] text-[var(--warm-gray)] tracking-[0.04em] mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
