import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      min: 0,
    },
    sizes: [
      {
        type: String,
      },
    ],
    colors: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Image",
      },
    ],
    stock: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(aggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
