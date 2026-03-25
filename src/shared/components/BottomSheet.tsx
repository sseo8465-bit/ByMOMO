'use client';

// 바텀 시트 모달 — 하단 슬라이드업 오버레이
import { useEffect, useRef } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // 바깥 영역 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* ── 오버레이 ── */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* ── 시트 ── */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-[600px] bg-[var(--warm-white)] rounded-t-none px-[var(--space-page-x)] pb-10 pt-5 animate-slide-up"
      >
        {/* ── 드래그 핸들 ── */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-[var(--oatmeal)]" />
        </div>

        {/* ── 제목 ── */}
        {title && (
          <h3 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--charcoal)] mb-4 text-center">
            {title}
          </h3>
        )}

        {children}
      </div>
    </div>
  );
}
