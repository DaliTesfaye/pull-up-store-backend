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

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: { [key: string]: number };
  totalStock: number;
  inStock: boolean;
  isActive: boolean;
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
