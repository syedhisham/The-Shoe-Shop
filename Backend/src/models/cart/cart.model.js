import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

cartSchema.virtual("totalQuantity").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (total, item) => total + item.quantity * (item.product?.price || 0),
    0
  );
});

export const Cart = mongoose.model("Cart", cartSchema);
