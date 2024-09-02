import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  emailVerificationToken: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});
//middleware
authSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  authSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
const Auth = mongoose.model("Auth", authSchema);
export default Auth;
