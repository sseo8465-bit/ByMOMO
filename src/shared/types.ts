// 공통 타입 정의

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  proteinType: string;
  ingredients: string[];
  imageUrl: string;
  imageAlt: string;
}

export interface DogProfile {
  name: string;
  photo: string | null;
  breed: string;
  age: number;
  weight: number;
  dislikedIngredients: string[];
  healthConcerns: string[];
  texturePreference: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  shippingAddress: string;
  createdAt: string;
}
