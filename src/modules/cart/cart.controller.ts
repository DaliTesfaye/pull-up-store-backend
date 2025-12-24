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
      res.status(200).json(cart);
    } catch (error: any) {
      console.error("Error in getCart:", error);
      res.status(500).json({ message: "Server error" });
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
      res.status(200).json(cart);
    } catch (error: any) {
      console.error("Error in addToCart:", error);
      if (
        error.message.includes("not found") ||
        error.message.includes("stock") ||
        error.message.includes("not available")
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error" });
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
      res.status(200).json(cart);
    } catch (error: any) {
      console.error("Error in updateCartItem:", error);
      if (
        error.message.includes("not found") ||
        error.message.includes("stock") ||
        error.message.includes("Quantity")
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error" });
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
      res.status(200).json(cart);
    } catch (error: any) {
      console.error("Error in removeFromCart:", error);
      if (error.message.includes("not found")) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error" });
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
      res.status(200).json(cart);
    } catch (error: any) {
      console.error("Error in clearCart:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}
