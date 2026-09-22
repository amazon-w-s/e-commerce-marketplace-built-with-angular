import { Category } from '../models/category.model';

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'devices',
    description: 'Gadgets, audio and smart devices',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: 'checkroom',
    description: 'Clothing, footwear and accessories',
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    icon: 'chair',
    description: 'Furniture and decor for every room',
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    icon: 'sports_soccer',
    description: 'Gear for an active lifestyle',
  },
  {
    id: 'beauty',
    name: 'Beauty & Care',
    icon: 'spa',
    description: 'Skincare, makeup and wellness',
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    icon: 'menu_book',
    description: 'Books, music and collectibles',
  },
];
