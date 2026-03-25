'use client';

// 구독 대기 신청 페이지 — 얼리버드 등록 폼
import { useState } from 'react';
import GNB from '@/shared/components/GNB';
import Button from '@/shared/components/Button';
import Footer from '@/shared/components/Footer';

export default function SubscriptionPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && phone) {
      setSubmitted(true);
      setEmail('');
      setPhone('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const isFormValid = email && phone;

  return (
    <>
      <GNB />

      <div className="px-6 py-10">
        {/* ── 헤더 ── */}
        <div className="text-center mb-10">
          <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
            Subscription
          </p>
          <h1 className="font-[var(--font-serif)] text-[28px] font-medium text-[var(--walnut)] mb-3">
            정기 구독
          </h1>
          <p className="text-[15px] text-[var(--warm-gray)] leading-[1.7]">
            매달 아이에게 맞는 간식을 보내드립니다.
          </p>
        </div>

        {/* ── 혜택 카드 ── */}
        <div className="flex flex-col gap-4 mb-10">
          {[
            { title: '매달 맞춤 구성', desc: '프로필 기반 자동 추천' },
            { title: '선물 포장 기본', desc: '매달 새로운 박스 디자인' },
            { title: '구독자 전용 할인', desc: '단품 대비 15% 할인' },
          ].map((item) => (
            <div key={item.title} className="p-5 bg-white rounded-lg border border-[var(--oatmeal)]">
              <p className="text-[15px] font-semibold text-[var(--charcoal)] mb-0.5">{item.title}</p>
              <p className="text-[14px] text-[var(--warm-gray)]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── 얼리버드 배지 ── */}
        <div className="text-center mb-10">
          <span className="inline-block bg-[var(--walnut)] text-[var(--cream)] px-3 py-1 rounded-full text-[12px] font-semibold font-[var(--font-ui)]">
            얼리버드 10% OFF
          </span>
          <p className="text-[14px] text-[var(--warm-gray)] mt-2">
            알림 등록 시 오픈 10% 할인 적용
          </p>
        </div>

        {/* ── 폼 ── */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-[300px] mx-auto mb-10">
            <div className="flex flex-col gap-3 mb-4">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border border-[var(--oatmeal)] focus:border-[var(--walnut)] outline-none py-3 px-4 text-[15px] font-[var(--font-ui)] transition-colors"
              />
              <input
                type="tel"
                placeholder="휴대폰 번호"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="rounded-lg border border-[var(--oatmeal)] focus:border-[var(--walnut)] outline-none py-3 px-4 text-[15px] font-[var(--font-ui)] transition-colors"
              />
            </div>
            <Button type="submit" variant="primary" disabled={!isFormValid}>
              알림 신청
            </Button>
          </form>
        ) : (
          <div className="max-w-[300px] mx-auto mb-10 p-4 bg-[var(--cream)] rounded-xl text-center">
            <p className="text-[15px] text-[var(--walnut)] font-medium">
              등록이 완료되었습니다.
            </p>
          </div>
        )}

        <p className="text-center text-[10px] text-[var(--warm-taupe)]">
          입력하신 정보는 알림 발송에만 사용됩니다.
        </p>
      </div>

      <Footer />
    </>
  );
}
