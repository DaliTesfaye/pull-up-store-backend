import {Document, model} from 'mongoose';
import { CartSchema } from './cart.schema';

export interface ICartItem {
    productId: string;
    size: string;
    color: string;
    quantity: number;
}

export interface ICart extends Document {
    userId: string;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

export const CartModel = model<ICart>('Cart', CartSchema);
