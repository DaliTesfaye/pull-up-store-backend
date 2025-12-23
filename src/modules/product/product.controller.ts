import { Request, Response } from "express";
import { ProductService } from "./product.service";

export class ProductController {
  // Get all products with filters and pagination
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const productService = new ProductService();
      const result = await productService.getProducts(req.query);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error in getProducts:", error);
      if (error.message.includes("Invalid category")) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Get single product by ID
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productService = new ProductService();
      const product = await productService.getProductById(req.params.id);
      res.status(200).json(product);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error" });
    }
  }
}
