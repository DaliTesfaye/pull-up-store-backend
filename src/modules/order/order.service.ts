import { OrderModel } from "./order.model";
import { CartModel } from "../cart/cart.model";
import { ProductModel } from "../product/product.model";
import { UserModel } from "../user/user.model";
import { OrderResponse, OrderHistoryResponse, OrderSummary } from "./order.types";
import { sendOrderConfirmationEmail } from "../../utils/email";
import mongoose from "mongoose";

export class OrderService {
  // Generate unique order number
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

    // Count today's orders to generate sequential number
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const todayOrdersCount = await OrderModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const sequentialNumber = String(todayOrdersCount + 1).padStart(4, "0");
    return `ORD-${dateStr}-${sequentialNumber}`;
  }

  // Create order from cart
  async createOrder(userId: string): Promise<OrderResponse> {
    // Get user's cart
    const cart = await CartModel.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Get user details for email
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate all products and check stock
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = await ProductModel.findById(cartItem.productId);

      if (!product) {
        throw new Error(`Product not found`);
      }

      if (!product.isActive) {
        throw new Error(`Product "${product.name}" is no longer available`);
      }

      // Check stock
      const stockKey = `${cartItem.size}-${cartItem.color}`;
      const availableStock = product.stock.get(stockKey) || 0;

      if (cartItem.quantity > availableStock) {
        throw new Error(
          `Insufficient stock for "${product.name}" (Size: ${cartItem.size}, Color: ${cartItem.color}). Only ${availableStock} available`
        );
      }

      const itemTotal = product.price * cartItem.quantity;

      orderItems.push({
        productId: product._id.toString(),
        productName: product.name,
        price: product.price,
        size: cartItem.size,
        color: cartItem.color,
        quantity: cartItem.quantity,
        itemTotal,
      });

      totalAmount += itemTotal;
    }

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order with pending status
    const order = await OrderModel.create({
      userId,
      orderNumber,
      items: orderItems,
      totalAmount,
      status: "pending",
      confirmationEmailSent: false,
    });

    // Reduce stock for each item
    for (const item of orderItems) {
      const product = await ProductModel.findById(item.productId);
      if (product) {
        const stockKey = `${item.size}-${item.color}`;
        const currentStock = product.stock.get(stockKey) || 0;

        product.stock.set(stockKey, currentStock - item.quantity);
        product.totalStock -= item.quantity;
        product.inStock = product.totalStock > 0;

        await product.save();
      }
    }

    // Generate confirmation token
    const confirmationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    order.confirmationToken = confirmationToken;
    await order.save();

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(
        user.email,
        user.firstName,
        orderNumber,
        orderItems,
        totalAmount,
        confirmationToken
      );

      order.confirmationEmailSent = true;
      order.confirmationEmailSentAt = new Date();
      await order.save();
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Order still created, just email failed
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    return {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      confirmationEmailSent: order.confirmationEmailSent,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  // Get order history with pagination
  async getOrderHistory(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<OrderHistoryResponse> {
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      OrderModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OrderModel.countDocuments({ userId }),
    ]);

    const orderSummaries: OrderSummary[] = orders.map((order: any) => ({
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      totalItems: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    }));

    const totalPages = Math.ceil(totalOrders / limit);

    return {
      orders: orderSummaries,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  // Get single order by ID
  async getOrderById(userId: string, orderId: string): Promise<OrderResponse> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID format");
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId.toString() !== userId) {
      throw new Error("Unauthorized to view this order");
    }

    return {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      confirmationEmailSent: order.confirmationEmailSent,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  // Cancel order
  async cancelOrder(userId: string, orderId: string): Promise<OrderResponse> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID format");
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId.toString() !== userId) {
      throw new Error("Unauthorized to cancel this order");
    }

    // Check if order can be cancelled
    if (!["pending", "confirmed", "processing"].includes(order.status)) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    // Restore stock for all items
    for (const item of order.items) {
      const product = await ProductModel.findById(item.productId);
      if (product) {
        const stockKey = `${item.size}-${item.color}`;
        const currentStock = product.stock.get(stockKey) || 0;

        product.stock.set(stockKey, currentStock + item.quantity);
        product.totalStock += item.quantity;
        product.inStock = true;

        await product.save();
      }
    }

    // Update order status
    order.status = "cancelled";
    await order.save();

    return {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      confirmationEmailSent: order.confirmationEmailSent,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  // Confirm order via email link
  async confirmOrder(orderNumber: string, token: string): Promise<OrderResponse> {
    const order = await OrderModel.findOne({ orderNumber });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.confirmationToken !== token) {
      throw new Error("Invalid confirmation token");
    }

    if (order.status !== "pending") {
      throw new Error(`Order is already ${order.status}`);
    }

    // Update order status to confirmed
    order.status = "confirmed";
    order.confirmationToken = undefined; // Clear token after use
    await order.save();

    return {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      confirmationEmailSent: order.confirmationEmailSent,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
