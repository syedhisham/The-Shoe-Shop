import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //For handling form data (configuration)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //For handling URL data (configuration)
app.use(express.static("public")); //For public assets (configuration)
app.use(cookieParser());

//imports
import userRoutes from "./routes/user/user.route.js";
import productRoutes from "./routes/product/product.route.js";
import cartRoutes from "./routes/cart/cart.routes.js";

//routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

export { app };
