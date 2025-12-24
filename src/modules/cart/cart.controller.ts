import { Request, Response } from "express";
import { CartService } from "./cart.service";
import { AuthRequest } from "../../middelwares/auth.middleware";

export class CartController {
  // Get user's cart
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const cartService = new CartService();
      const cart = await cartService.getCart(userId);
      res.status(200).json({
        message: "Cart retrieved successfully",
        ...cart
      });
    } catch (error: any) {
      console.error("Error in getCart:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Add item to cart
  static async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const cartService = new CartService();
      const cart = await cartService.addToCart(userId, req.body);
      res.status(200).json({
        message: "Item added to cart successfully",
        ...cart
      });
    } catch (error: any) {
      console.error("Error in addToCart:", error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        res.status(400).json({ message: "Validation error", error: error.message });
        return;
      }
      
      // Handle cast errors (invalid ObjectId)
      if (error.name === 'CastError') {
        res.status(400).json({ message: "Invalid product ID format" });
        return;
      }
      
      // Handle known business logic errors
      if (
        error.message.includes("not found") ||
        error.message.includes("stock") ||
        error.message.includes("not available") ||
        error.message.includes("Invalid product ID")
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      
      // Handle all other errors
      res.status(500).json({ message: "Failed to add item to cart", error: error.message });
    }
  }

  // Update cart item quantity
  static async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { productId, size, color } = req.params;
      const cartService = new CartService();
      const cart = await cartService.updateCartItem(userId, productId, size, color, req.body);
      res.status(200).json({
        message: "Cart item updated successfully",
        ...cart
      });
    } catch (error: any) {
      console.error("Error in updateCartItem:", error);
      if (
        error.message.includes("not found") ||
        error.message.includes("stock") ||
        error.message.includes("Quantity") ||
        error.message.includes("Invalid product ID")
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Remove item from cart
  static async removeFromCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { productId, size, color } = req.params;
      const cartService = new CartService();
      const cart = await cartService.removeFromCart(userId, productId, size, color);
      res.status(200).json({
        message: "Item removed from cart successfully",
        ...cart
      });
    } catch (error: any) {
      console.error("Error in removeFromCart:", error);
      if (error.message.includes("not found") || error.message.includes("Invalid product ID")) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Clear entire cart
  static async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const cartService = new CartService();
      const cart = await cartService.clearCart(userId);
      res.status(200).json({
        message: "Cart cleared successfully",
        ...cart
      });
    } catch (error: any) {
      console.error("Error in clearCart:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
