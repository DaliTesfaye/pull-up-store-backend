import { UserModel , IUser } from "./user.model";
import { UpdateProfileDTO } from "./user.types";

export class UserService {
    // Get User by ID
    async getUserById(userId: string): Promise<IUser | null> {
        return UserModel.findById(userId).exec();
    }

    // Update User Profile
    async updateUserProfile(userId: string, updateData: UpdateProfileDTO): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).exec();
    }

    // Delete User
    async deleteUser(userId: string): Promise<IUser | null> {
        return UserModel.findByIdAndDelete(userId).exec();
    }
}