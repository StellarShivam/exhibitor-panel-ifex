export const PRODUCT_SUBCATEGORY_MAP = {
  electronics: [
    'Laptops',
    'Smartphones',
    'Tablets',
    'Cameras',
    'Audio Equipment',
    'Accessories',
    'TV',
    'Refrigerator',
    'Washing Machine',
    'Air Conditioner',
    'Microwave',
    'Toaster',
    'Blender',
  ],
  Furniture: ['Chairs', 'Tables', 'Desks', 'Storage Units', 'Sofas', 'Cabinets'],
  Decor: ['Wall Art', 'Lighting', 'Rugs & Carpets', 'Vases', 'Mirrors', 'Plants & Planters'],
  'Utilities & Hygiene': [
    'Cleaning Supplies',
    'Sanitizers',
    'Paper Products',
    'First Aid',
    'Personal Care',
    'Safety Equipment',
  ],
} as const;

export type Category = keyof typeof PRODUCT_SUBCATEGORY_MAP;
export type Subcategory = (typeof PRODUCT_SUBCATEGORY_MAP)[Category][number];
