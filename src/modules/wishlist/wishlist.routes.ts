import { Router } from "express";
import { WishlistController } from "./wishlist.controller";
import { authMiddleware } from "../../middelwares/auth.middleware";

const router = Router();

// All wishlist routes require authentication
router.use(authMiddleware);

// Get user's wishlist
router.get("/", WishlistController.getWishlist);

// Add product to wishlist
router.post("/", WishlistController.addToWishlist);

// Remove product from wishlist
router.delete("/:productId", WishlistController.removeFromWishlist);

// Clear entire wishlist
router.delete("/", WishlistController.clearWishlist);

export default router;
