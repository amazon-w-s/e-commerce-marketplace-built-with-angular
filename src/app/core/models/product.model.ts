export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  seller: string;
  isFeatured?: boolean;
  isNew?: boolean;
}
