import { Request, Response } from "express";
import { WishlistService } from "./wishlist.service";
import { AuthRequest } from "../../middelwares/auth.middleware";

export class WishlistController {
  // Get user's wishlist
  static async getWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const wishlistService = new WishlistService();
      const wishlist = await wishlistService.getWishlist(userId);
      res.status(200).json({ 
        message: "Wishlist retrieved successfully",
        ...wishlist 
      });
    } catch (error: any) {
      console.error("Error in getWishlist:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Add product to wishlist
  static async addToWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const wishlistService = new WishlistService();
      const wishlist = await wishlistService.addToWishlist(userId, req.body);
      res.status(200).json({ 
        message: "Product added to wishlist successfully",
        ...wishlist 
      });
    } catch (error: any) {
      console.error("Error in addToWishlist:", error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        res.status(400).json({ message: "Validation error", error: error.message });
        return;
      }
      
      // Handle duplicate key errors
      if (error.code === 11000) {
        res.status(400).json({ message: "Product already in wishlist" });
        return;
      }
      
      // Handle known business logic errors
      if (
        error.message.includes("not found") ||
        error.message.includes("not available") ||
        error.message.includes("already in wishlist") ||
        error.message.includes("Invalid product ID")
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      
      // Handle all other errors
      res.status(500).json({ message: "Failed to add product to wishlist", error: error.message });
    }
  }

  // Remove product from wishlist
  static async removeFromWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { productId } = req.params;
      const wishlistService = new WishlistService();
      const wishlist = await wishlistService.removeFromWishlist(userId, productId);
      res.status(200).json({ 
        message: "Product removed from wishlist successfully",
        ...wishlist 
      });
    } catch (error: any) {
      console.error("Error in removeFromWishlist:", error);
      if (error.message.includes("not found") || error.message.includes("Invalid product ID")) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Clear entire wishlist
  static async clearWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const wishlistService = new WishlistService();
      const wishlist = await wishlistService.clearWishlist(userId);
      res.status(200).json({ 
        message: "Wishlist cleared successfully",
        ...wishlist 
      });
    } catch (error: any) {
      console.error("Error in clearWishlist:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
