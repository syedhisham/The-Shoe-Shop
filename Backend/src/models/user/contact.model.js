import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^(\+92|0)?3\d{9}$/, "is invalid"],
  },
  phoneVerificationCode: {
    type: String,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
});

export const Contact = mongoose.model("Contact", contactSchema);

