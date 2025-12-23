import { Document, model } from "mongoose";
import { ProductSchema } from "./product.schema";

export interface IVariant {
  _id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: "sweaters" | "jackets" | "pants" | "hoodies";
  images: string[];
  variants: IVariant[];
  isActive: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const ProductModel = model<IProduct>("Product", ProductSchema);
