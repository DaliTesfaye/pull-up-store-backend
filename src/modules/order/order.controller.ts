import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { AuthRequest } from "../../middelwares/auth.middleware";

export class OrderController {
  // Create order from cart
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const orderService = new OrderService();
      const order = await orderService.createOrder(userId);
      res.status(201).json({
        message: "Order placed successfully",
        ...order,
      });
    } catch (error: any) {
      console.error("Error in createOrder:", error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        res.status(400).json({ message: "Invalid order data", error: error.message });
        return;
      }
      
      // Handle mongoose errors
      if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        res.status(500).json({ message: "Database error occurred", error: error.message });
        return;
      }
      
      // Handle known business logic errors
      if (
        error.message.includes("empty") ||
        error.message.includes("not found") ||
        error.message.includes("not available") ||
        error.message.includes("Insufficient stock")
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      
      // Handle all other errors
      res.status(500).json({ message: "Failed to create order", error: error.message });
    }
  }

  // Get order history
  static async getOrderHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const orderService = new OrderService();
      const orderHistory = await orderService.getOrderHistory(userId, page, limit);
      res.status(200).json({
        message: "Order history retrieved successfully",
        ...orderHistory,
      });
    } catch (error: any) {
      console.error("Error in getOrderHistory:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Get single order by ID
  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { orderId } = req.params;
      const orderService = new OrderService();
      const order = await orderService.getOrderById(userId, orderId);
      res.status(200).json({
        message: "Order retrieved successfully",
        ...order,
      });
    } catch (error: any) {
      console.error("Error in getOrderById:", error);
      if (
        error.message.includes("not found") ||
        error.message.includes("Unauthorized") ||
        error.message.includes("Invalid order ID")
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Cancel order
  static async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { orderId } = req.params;
      const orderService = new OrderService();
      const order = await orderService.cancelOrder(userId, orderId);
      res.status(200).json({
        message: "Order cancelled successfully",
        ...order,
      });
    } catch (error: any) {
      console.error("Error in cancelOrder:", error);
      if (
        error.message.includes("not found") ||
        error.message.includes("Unauthorized") ||
        error.message.includes("Cannot cancel") ||
        error.message.includes("Invalid order ID")
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Confirm order via email link
  static async confirmOrder(req: Request, res: Response): Promise<void> {
    try {
      const { token, orderNumber } = req.query;

      if (!token || !orderNumber) {
        res.status(400).json({ message: "Missing token or order number" });
        return;
      }

      const orderService = new OrderService();
      const order = await orderService.confirmOrder(orderNumber as string, token as string);
      
      // Send HTML success page
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmed - Pull Up Store</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f2f5;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              padding: 40px;
              max-width: 500px;
              text-align: center;
            }
            .success-icon {
              font-size: 60px;
              color: #4CAF50;
              margin-bottom: 20px;
            }
            h1 {
              color: #333;
              margin-bottom: 10px;
            }
            .order-number {
              font-size: 24px;
              color: #2196F3;
              font-weight: bold;
              margin: 20px 0;
            }
            p {
              color: #666;
              line-height: 1.6;
              margin: 15px 0;
            }
            .status-badge {
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              border-radius: 20px;
              display: inline-block;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h1>Order Confirmed!</h1>
            <div class="order-number">${order.orderNumber}</div>
            <div class="status-badge">Status: Confirmed</div>
            <p>Thank you for confirming your order. Your purchase is now being processed.</p>
            <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p>You will receive shipping updates via email.</p>
            <p style="margin-top: 30px; color: #999; font-size: 14px;">
              You can close this window now.
            </p>
          </div>
        </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Error in confirmOrder:", error);
      
      // Send HTML error page
      res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation Failed - Pull Up Store</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f2f5;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              padding: 40px;
              max-width: 500px;
              text-align: center;
            }
            .error-icon {
              font-size: 60px;
              color: #f44336;
              margin-bottom: 20px;
            }
            h1 {
              color: #333;
              margin-bottom: 10px;
            }
            p {
              color: #666;
              line-height: 1.6;
              margin: 15px 0;
            }
            .error-message {
              background-color: #ffebee;
              color: #c62828;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">❌</div>
            <h1>Confirmation Failed</h1>
            <div class="error-message">${error.message}</div>
            <p>Please check your email for the correct confirmation link or contact support.</p>
          </div>
        </body>
        </html>
      `);
    }
  }
}
