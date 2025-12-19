import { Schema } from "mongoose";

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    confirmPassword: {
      type: String,
      required: true,
      select: false,
    },
    accountStatus: {
      type: String,
      enum: ["VERIFIED", "UNVERIFIED"],
      default: "UNVERIFIED",
      index: true,
    },

    firstName: {
      type: String,
      trim: true,
      required: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
    },

    phone: {
      type: String,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
