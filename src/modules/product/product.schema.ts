import { Schema } from "mongoose";

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

    sizes: {
      type: [String],
      required: true,
      default: [],
    },

    colors: {
      type: [String],
      required: true,
      default: [],
    },

    // Stock tracking: { "M-Black": 10, "L-Blue": 5 }
    stock: {
      type: Map,
      of: Number,
      default: {},
    },

    totalStock: {
      type: Number,
      default: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
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

// Text index for search functionality
ProductSchema.index({ name: "text", description: "text" });
