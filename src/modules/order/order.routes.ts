import { Router } from "express";
import { OrderController } from "./order.controller";
import { authMiddleware } from "../../middelwares/auth.middleware";

const router = Router();

// Public route for email confirmation (no auth required)
router.get("/confirm", OrderController.confirmOrder);

// All other order routes require authentication
router.use(authMiddleware);

// Create order from cart
router.post("/", OrderController.createOrder);

// Get order history (paginated)
router.get("/", OrderController.getOrderHistory);

// Get single order details
router.get("/:orderId", OrderController.getOrderById);

// Cancel order
router.patch("/:orderId/cancel", OrderController.cancelOrder);

export default router;
