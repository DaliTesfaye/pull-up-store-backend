export interface GetProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price" | "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
}

export interface VariantResponse {
  _id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  variants: VariantResponse[];
  isActive: boolean;
  isOutOfStock: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedProductsResponse {
  products: ProductResponse[];
  pagination: {
    page: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
