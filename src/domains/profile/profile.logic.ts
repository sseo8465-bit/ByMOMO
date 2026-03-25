import type { Product } from '@/shared/types';
import type { ProfileFormData } from './profile.types';
import { MOCK_PRODUCTS } from '@/shared/mock/products';

export function getRecommendations(profile: ProfileFormData): Product[] {

  let filtered: Product[] = MOCK_PRODUCTS;

  // Filter out products containing disliked ingredients
  if (profile.dislikedIngredients.length > 0) {
    filtered = filtered.filter(
      (product: Product) =>
        !product.ingredients.some((ingredient) =>
          profile.dislikedIngredients.some(
            (disliked) =>
              ingredient.toLowerCase().includes(disliked.toLowerCase()) ||
              disliked.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
    );
  }

  // Sort by relevance to health concerns
  if (profile.healthConcerns.length > 0 && !profile.healthConcerns.includes('해당 없음')) {
    const healthKeywordMap: Record<string, string[]> = {
      '피부·모질': ['연어', '오메가'],
      '관절·뼈': ['글루코사민'],
      '소화·장건강': ['단호박', '고구마'],
      '심장': ['오메가'],
      '비만·체중관리': ['저알러지'],
      '구강': [],
      '눈·시력': [],
    };

    const healthKeywords = profile.healthConcerns.flatMap(
      (concern) => healthKeywordMap[concern] || []
    );

    filtered.sort((a, b) => {
      const aMatch = healthKeywords.filter((keyword) =>
        a.description.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      const bMatch = healthKeywords.filter((keyword) =>
        b.description.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      return bMatch - aMatch;
    });
  }

  return filtered;
}
