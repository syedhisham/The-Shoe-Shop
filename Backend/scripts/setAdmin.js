import mongoose from "mongoose";
import dotenv from "dotenv";
import { makeAdmin } from "../src/controllers/setAdmin/setAdmin.controller.js";

dotenv.config({
  path: "../.env",
});
console.log(process.env.MONGODB_URI);

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongodb connected");

    await makeAdmin("syedhishamshah27@gmail.com");
    await mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
  }
};

run();
