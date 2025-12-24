export interface CreateOrderDTO {
  // Empty for now - order created from cart
  // Future: shippingAddress, paymentMethod
}

export interface OrderItemResponse {
  productId: string;
  productName: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  itemTotal: number;
}

export interface OrderResponse {
  message?: string;
  orderId: string;
  orderNumber: string;
  items: OrderItemResponse[];
  totalAmount: number;
  status: string;
  confirmationEmailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderHistoryResponse {
  message?: string;
  orders: OrderSummary[];
  pagination: {
    page: number;
    limit: number;
    totalOrders: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface OrderSummary {
  orderId: string;
  orderNumber: string;
  totalItems: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
}
