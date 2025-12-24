import { Document, model } from "mongoose";
import { WishlistSchema } from "./wishlist.schema";

export interface IWishlistItem {
  productId: string;
  addedAt: Date;
}

export interface IWishlist extends Document {
  userId: string;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export const WishlistModel = model<IWishlist>("Wishlist", WishlistSchema);
