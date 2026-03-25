export interface ProfileFormData {
  name: string;
  photo: string | null;
  breed: string;
  age: number | null;
  weight: number | null;
  dislikedIngredients: string[];
  healthConcerns: string[];
  texturePreference: string | null;
}
