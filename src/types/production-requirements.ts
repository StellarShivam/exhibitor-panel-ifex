export type ICategoryItem = {
  id: number;
  categoryName: string;
};

export type IProductItem = {
  id: number;
  subCategory: string;
  gsn: string;
  color: string;
  description: string;
  productName: string;
  content: string;
  subCategoryName: string;
  productImages: string[];
  size: string;
  price: number;
  category: string;
  skuId: number;
  skuImage: string;
  status: string;
};

export type IProductCartItem = {
  id: number;
  subCategory: string;
  gsn: string;
  color: string;
  description: string;
  productName: string;
  content: string;
  subCategoryName: string;
  productImages: string[];
  size: string;
  itemPrice: number;
  category: string;
  skuId: number;
  skuImage: string;
  status: string;
  cartItemId: number;
};

export type ISubCategoryItem = {
  id: number;
  categoryId: number;
  subCategoryName: string;
};

export type AddToCartPayload = {
  eventId: number;
  skuId: number;
  price: number;
};

export type ICartResponse = {
  totalAmount: number;
  cartId: number;
  items: IProductCartItem[];
};

export type IExhbitorProductionRequirements = {
  quantity: number;
  gsn: string; // Global Serial Number
  totalPrice: number;
  cartId: number;
  description: string; // Description of the product
  content: string; // Content description in HTML format
  productName: string; // Name of the product
  productImages: string[]; // Array of URLs for product images
  totalOrders: number;
  skuId: number;
  paymentStatus: string; // Payment status (e.g., "PENDING")
  skuImage: string; // URL for the SKU image
  status: string; // Status of the product (e.g., "PENDING")
};

export type IExhibitorProductionRequirementsFilters = {
  paymentStatus: string[];
  status: string;
  name: string;
};
