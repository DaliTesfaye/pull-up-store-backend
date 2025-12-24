import { Document, model } from "mongoose";
import { OrderSchema } from "./order.schema";

export interface IOrderItem {
  productId: string;
  productName: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  itemTotal: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  userId: string;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  confirmationEmailSent: boolean;
  confirmationEmailSentAt?: Date;
  confirmationToken?: string;
  shippingAddress?: IShippingAddress;
  paymentMethod?: string;
  tax?: number;
  shippingFee?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const OrderModel = model<IOrder>("Order", OrderSchema);
