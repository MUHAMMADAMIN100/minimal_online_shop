export type Category = 'PANTS' | 'SHOES' | 'SHIRTS' | 'OUTERWEAR';

export const CATEGORY_LABELS: Record<Category, string> = {
  PANTS: 'Брюки',
  SHOES: 'Обувь',
  SHIRTS: 'Рубашки',
  OUTERWEAR: 'Верхняя одежда',
};

export const CATEGORIES: Category[] = ['PANTS', 'SHOES', 'SHIRTS', 'OUTERWEAR'];

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  sizes: string[];
  stock: number;
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string | null;
  product?: Product;
};

export type Order = {
  id: string;
  total: number;
  name: string;
  phone: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
};

export type CartItem = {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
};
