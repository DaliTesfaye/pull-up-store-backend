import { model , Document } from 'mongoose';
import { UserSchema } from './user.schema';

export interface IUser extends Document {
    email: string;
    password: string;
    accountStatus: 'VERIFIED' | 'UNVERIFIED';
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export const UserModel = model<IUser>('User', UserSchema);