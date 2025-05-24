// ----------------------------------------------------------------------

export type IProductFilterValue = string | string[] | number | number[];

export interface IProductFilters {
  colors: string[];
  category: string;
  subcategory: string;
  priceRange: number[];
}

// ----------------------------------------------------------------------

export type IProductReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  isPurchased: boolean;
  attachments?: string[];
  postedAt: string;
};

export type IProductItem = {
  id: string;
  sku: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  gender: string;
  sizes: string[];
  publish: string;
  coverUrl: string;
  images: string[];
  colors: string[];
  quantity: number;
  category: string;
  subcategory: string;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  reviews: IProductReview[];
  createdAt: string;
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  saleLabel: {
    enabled: boolean;
    content: string;
  };
  newLabel: {
    enabled: boolean;
    content: string;
  };
};

export type IProductTableFilterValue = string | string[];

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
};

export type IProductItemGet = {
  id?: number;
  exhibitorId: number;
  productName: string;
  subDescription: string;
  imgUrl: string;
  regularPrice: number;
  salePrice: number;
  tax: number;
  status: 'DRAFT' | 'PUBLISHED';
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
};

export type IProductItemNew = {
  id?: number;
  exhibitorId: number;
  productName: string;
  subDescription: string;
  images: string[];
  regularPrice: number;
  salePrice: number;
  tax: number;
  status: 'DRAFT' | 'PUBLISHED';
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
};

export type IProductCreateItem = {
  exhibitorId: number;
  productName: string;
  subDescription: string;
  imgUrl: string;
  regularPrice: number;
  salePrice: number;
  tax: number;
  isPublish: boolean;
};

export type IProductUpdateItem = {
  id: number;
  productName?: string;
  subDescription?: string;
  imgUrl?: string;
  regularPrice?: number;
  salePrice?: number;
  tax?: number;
  status: 'DRAFT' | 'PUBLISHED';
};

export type ISavePortfolioRequest = {
  portfolioName: string;
  exhibitorId: number;
  pdfUrl?: string;
};

export interface IPortfolioResponse {
  id: number;
  exhibitorId: number;
  portfolioName: string;
  pdfUrl: string | null;
  status: boolean;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}
