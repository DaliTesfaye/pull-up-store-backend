import { Router } from "express";
import { CartController } from "./cart.controller";
import { authMiddleware } from "../../middelwares/auth.middleware";

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

// Get user's cart
router.get("/", CartController.getCart);

// Add item to cart
router.post("/", CartController.addToCart);

// Update cart item quantity (productId/size/color)
router.put("/:productId/:size/:color", CartController.updateCartItem);

// Remove item from cart (productId/size/color)
router.delete("/:productId/:size/:color", CartController.removeFromCart);

// Clear entire cart
router.delete("/", CartController.clearCart);

// Clear entire cart (must be last to avoid matching "/:variantId")
// router.delete("/", CartController.clearCart);

export default router;
