import { WishlistModel } from "./wishlist.model";
import { ProductModel } from "../product/product.model";
import { AddToWishlistDTO, WishlistResponse, WishlistItemResponse } from "./wishlist.types";
import mongoose from "mongoose";

export class WishlistService {
  // Get user's wishlist with full product details
  async getWishlist(userId: string): Promise<WishlistResponse> {
    let wishlist = await WishlistModel.findOne({ userId });

    if (!wishlist) {
      // Create empty wishlist if doesn't exist
      wishlist = await WishlistModel.create({ userId, items: [] });
    }

    // Populate wishlist items with product details
    const wishlistItems: WishlistItemResponse[] = [];

    for (const item of wishlist.items) {
      const product = await ProductModel.findById(item.productId);

      // Skip if product deleted or inactive
      if (!product || !product.isActive) continue;

      wishlistItems.push({
        productId: product._id.toString(),
        productName: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        category: product.category,
        image: product.images[0] || "",
        inStock: product.inStock,
        addedAt: item.addedAt,
      });
    }

    // Sort by most recently added
    wishlistItems.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());

    return {
      items: wishlistItems,
      totalItems: wishlistItems.length,
    };
  }

  // Add product to wishlist
  async addToWishlist(userId: string, data: AddToWishlistDTO): Promise<WishlistResponse> {
    const { productId } = data;

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID format");
    }

    // Validate product exists and is active
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      throw new Error("Product is not available");
    }

    // Get or create wishlist
    let wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist) {
      wishlist = await WishlistModel.create({ userId, items: [] });
    }

    // Check if product already in wishlist
    const existingItem = wishlist.items.find(
      (item: any) => item.productId.toString() === productId
    );

    if (existingItem) {
      throw new Error("Product already in wishlist");
    }

    // Add to wishlist
    wishlist.items.push({
      productId,
      addedAt: new Date(),
    } as any);

    await wishlist.save();
    return this.getWishlist(userId);
  }

  // Remove product from wishlist
  async removeFromWishlist(userId: string, productId: string): Promise<WishlistResponse> {
    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID format");
    }

    const wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    // Filter out the item
    wishlist.items = wishlist.items.filter(
      (item: any) => item.productId.toString() !== productId
    );

    await wishlist.save();
    return this.getWishlist(userId);
  }

  // Clear entire wishlist
  async clearWishlist(userId: string): Promise<WishlistResponse> {
    let wishlist = await WishlistModel.findOne({ userId });

    if (!wishlist) {
      wishlist = await WishlistModel.create({ userId, items: [] });
    } else {
      wishlist.items = [];
      await wishlist.save();
    }

    return this.getWishlist(userId);
  }

  // Check if product is in wishlist (bonus utility)
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist) return false;

    return wishlist.items.some(
      (item: any) => item.productId.toString() === productId
    );
  }
}
