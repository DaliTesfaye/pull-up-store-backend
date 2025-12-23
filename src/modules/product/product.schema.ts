import { Schema } from "mongoose";

const VariantSchema = new Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { _id: true }
);

export const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    compareAtPrice: {
      type: Number,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: ["sweaters", "jackets", "pants", "hoodies"],
      index: true,
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: "At least one image is required",
      },
    },

    variants: {
      type: [VariantSchema],
      default: [],
      validate: {
        validator: function (v: any[]) {
          return v.length > 0;
        },
        message: "At least one variant is required",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for text search on name and description
ProductSchema.index({ name: "text", description: "text" });
