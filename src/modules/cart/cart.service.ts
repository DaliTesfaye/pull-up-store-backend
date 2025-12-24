import { CartModel } from "./cart.model";
import { ProductModel } from "../product/product.model";
import { AddToCartDTO, UpdateCartItemDTO, CartResponse, CartItemResponse } from "./cart.types";
import mongoose from "mongoose";

export class CartService {
  // Get user's cart with full product details
  async getCart(userId: string): Promise<CartResponse> {
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await CartModel.create({ userId, items: [] });
    }

    // Populate cart items with product details
    const cartItems: CartItemResponse[] = [];
    let totalPrice = 0;
    let totalItems = 0;

    for (const item of cart.items) {
      const product = await ProductModel.findById(item.productId);
      
      if (!product) continue; // Skip if product deleted

      // Get stock for this size-color combination
      const stockKey = `${item.size}-${item.color}`;
      const stock = product.stock.get(stockKey) || 0;

      const itemTotal = product.price * item.quantity;
      
      cartItems.push({
        productId: product._id.toString(),
        productName: product.name,
        price: product.price,
        size: item.size,
        color: item.color,
        image: product.images[0] || "",
        stock,
        quantity: item.quantity,
        itemTotal,
      });

      totalPrice += itemTotal;
      totalItems += item.quantity;
    }

    return {
      items: cartItems,
      totalItems,
      totalPrice,
    };
  }

  // Add item to cart or update quantity if exists
  async addToCart(userId: string, data: AddToCartDTO): Promise<CartResponse> {
    const { productId, size, color, quantity } = data;

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID format");
    }

    // Validate product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Validate size exists
    if (!product.sizes.includes(size)) {
      throw new Error("Size not available");
    }

    // Validate color exists
    if (!product.colors.includes(color)) {
      throw new Error("Color not available");
    }

    // Check stock availability
    const stockKey = `${size}-${color}`;
    const availableStock = product.stock.get(stockKey) || 0;

    if (quantity > availableStock) {
      throw new Error(`Only ${availableStock} items available in stock`);
    }

    // Get or create cart
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = await CartModel.create({ userId, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId && item.size === size && item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > availableStock) {
        throw new Error(`Only ${availableStock} items available in stock`);
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        size,
        color,
        quantity,
      } as any);
    }

    await cart.save();
    return this.getCart(userId);
  }

  // Update cart item quantity
  async updateCartItem(
    userId: string,
    productId: string,
    size: string,
    color: string,
    data: UpdateCartItemDTO
  ): Promise<CartResponse> {
    const { quantity } = data;

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID format");
    }

    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId && item.size === size && item.color === color
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    // Validate stock
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const stockKey = `${size}-${color}`;
    const availableStock = product.stock.get(stockKey) || 0;

    if (quantity > availableStock) {
      throw new Error(`Only ${availableStock} items available in stock`);
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return this.getCart(userId);
  }

  // Remove item from cart
  async removeFromCart(userId: string, productId: string, size: string, color: string): Promise<CartResponse> {
    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID format");
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
      (item: any) => !(item.productId.toString() === productId && item.size === size && item.color === color)
    );

    await cart.save();
    return this.getCart(userId);
  }

  // Clear entire cart
  async clearCart(userId: string): Promise<CartResponse> {
    let cart = await CartModel.findOne({ userId });
    
    if (!cart) {
      cart = await CartModel.create({ userId, items: [] });
    } else {
      cart.items = [];
      await cart.save();
    }

    return this.getCart(userId);
  }
}
