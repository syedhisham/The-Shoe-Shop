import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  addressLine1: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
    match: [/^\d{5}$/, "is invalid"],
  },
});

const Address = mongoose.model("Address", addressSchema);
export default Address;
