// ──────────────────────────────────────────────
// 더미 상품 데이터 (Phase 1 전용)
// ──────────────────────────────────────────────
// 이미지: 동물 사진 대신 원재료 스틸라이프(정물) 이미지 사용
// → 이솝/PVCS급 고감도 비주얼 톤 유지
// 가격·이름 수정 시 이 파일만 변경하면 전체 반영됨
// ──────────────────────────────────────────────
import type { Product } from '@/shared/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'duck-single',
    name: '오리 트릿 (단일 단백질)',
    description: '단일 단백질 오리고기로만 만든 저알러지 간식. 알러지가 있는 아이도 안심하고 먹을 수 있습니다.',
    price: 18000,
    proteinType: 'duck',
    ingredients: ['오리가슴살', '고구마', '블루베리'],
    // 원재료 스틸라이프: 오리 가슴살 슬라이스 + 고구마 칩 클로즈업
    imageUrl: 'https://images.unsplash.com/photo-1632158741406-8e5f06fbbfb9?w=600&h=500&fit=crop&crop=center',
    imageAlt: '오리 가슴살과 고구마 원재료 클로즈업',
  },
  {
    id: 'salmon-omega',
    name: '연어 트릿 (오메가3)',
    description: '오메가3가 풍부한 연어로 만든 피부·모질 개선 간식. 건조한 피부와 윤기 없는 털에 좋습니다.',
    price: 22000,
    proteinType: 'salmon',
    ingredients: ['연어', '귀리', '아마씨'],
    // 원재료 스틸라이프: 연어 필렛 매크로 촬영
    imageUrl: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=600&h=500&fit=crop&crop=center',
    imageAlt: '신선한 연어 필렛 클로즈업',
  },
  {
    id: 'birthday-set',
    name: '생일 선물 세트',
    description: '생일, 입양 기념일에 딱 맞는 프리미엄 선물 세트. 오리·연어·소고기 트릿 3종 + 선물 박스 포장.',
    price: 42000,
    proteinType: 'mixed',
    ingredients: ['오리가슴살', '연어', '소고기', '고구마', '블루베리'],
    // 원재료 스틸라이프: 크래프트 선물 박스 + 말린 과일/간식 구성
    imageUrl: 'https://images.unsplash.com/photo-1607919658560-4f42d9e5db4f?w=600&h=500&fit=crop&crop=center',
    imageAlt: '프리미엄 선물 세트 구성품',
  },
  {
    id: 'beef-senior',
    name: '소고기 트릿 (시니어)',
    description: '시니어 반려견을 위한 부드러운 소고기 간식. 관절 건강에 도움이 되는 글루코사민 함유.',
    price: 20000,
    proteinType: 'beef',
    ingredients: ['소고기', '단호박', '글루코사민'],
    // 원재료 스틸라이프: 소고기 칩 + 단호박 슬라이스
    imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&h=500&fit=crop&crop=center',
    imageAlt: '소고기와 단호박 원재료 클로즈업',
  },
];

export const MOCK_BREEDS = [
  '말티즈', '푸들', '포메라니안', '치와와', '시츄',
  '골든 리트리버', '래브라도 리트리버', '비숑 프리제',
  '코카 스파니엘', '웰시코기', '진돗개', '믹스견', '기타',
];

// 알러지 목록 — "없음" 옵션 필수 (선택 시 모든 재료 포함 간식 추천)
export const MOCK_ALLERGIES = [
  '없음',
  '소고기', '닭고기', '돼지고기', '연어', '오리',
  '밀', '옥수수', '대두', '유제품', '계란',
];

export const MOCK_HEALTH_CONCERNS = [
  '피부·모질', '관절·뼈', '소화·장건강', '심장',
  '비만·체중관리', '구강', '눈·시력', '해당 없음',
];

export const MOCK_TEXTURES = [
  '부드러운 (퓨레·무스)', '쫄깃한 (저키)', '바삭한 (쿠키)', '상관없음',
];
