import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

// Get all products (Public - no auth required)
router.get("/", ProductController.getProducts);

// Get single product by ID (Public)
router.get("/:id", ProductController.getProductById);

export default router;
