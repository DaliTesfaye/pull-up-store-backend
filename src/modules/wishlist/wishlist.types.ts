export interface AddToWishlistDTO {
  productId: string;
}

export interface WishlistItemResponse {
  productId: string;
  productName: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  image: string;
  inStock: boolean;
  addedAt: Date;
}

export interface WishlistResponse {
  message?: string;
  items: WishlistItemResponse[];
  totalItems: number;
}
