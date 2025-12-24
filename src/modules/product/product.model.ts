import { Document, model } from "mongoose";
import { ProductSchema } from "./product.schema";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: "sweaters" | "jackets" | "pants" | "hoodies";
  images: string[];
  sizes: string[];
  colors: string[];
  stock: Map<string, number>;
  totalStock: number;
  inStock: boolean;
  isActive: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const ProductModel = model<IProduct>("Product", ProductSchema);
