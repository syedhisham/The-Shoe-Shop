import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      required: true,
      min: 0,
    },
    sizes: [
      {
        type: String,
      },
    ],
    colors: {
      type: [String],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Image",
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(aggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
