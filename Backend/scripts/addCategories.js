import mongoose from "mongoose";
import { Category } from "../src/models/product/category.model.js"; // Adjust the import path if necessary
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

const addCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Category.deleteMany({});

    const gentsFootwear = await Category.findOneAndUpdate(
      { name: "Gents Footwear" },
      { name: "Gents Footwear", description: "Footwear for men" },
      { upsert: true, new: true }
    );

    const ladiesFootwear = await Category.findOneAndUpdate(
      { name: "Ladies Footwear" },
      { name: "Ladies Footwear", description: "Footwear for women" },
      { upsert: true, new: true }
    );

    await Promise.all([
      Category.findOneAndUpdate(
        { name: "Shoes", parent: gentsFootwear._id },
        {
          name: "Shoes",
          description: "Men's shoes",
          parent: gentsFootwear._id,
        },
        { upsert: true, new: true }
      ),
      Category.findOneAndUpdate(
        { name: "Sandals", parent: gentsFootwear._id },
        {
          name: "Sandals",
          description: "Men's sandals",
          parent: gentsFootwear._id,
        },
        { upsert: true, new: true }
      ),
      Category.findOneAndUpdate(
        { name: "Slippers", parent: gentsFootwear._id },
        {
          name: "Slippers",
          description: "Men's slippers",
          parent: gentsFootwear._id,
        },
        { upsert: true, new: true }
      ),
      Category.findOneAndUpdate(
        { name: "Sneakers", parent: gentsFootwear._id },
        {
          name: "Sneakers",
          description: "Men's sneakers",
          parent: gentsFootwear._id,
        },
        { upsert: true, new: true }
      ),
    ]);

    await Promise.all([
      Category.findOneAndUpdate(
        { name: "Sandals", parent: ladiesFootwear._id },
        {
          name: "Sandals",
          description: "Women's sandals",
          parent: ladiesFootwear._id,
        },
        { upsert: true, new: true }
      ),
      Category.findOneAndUpdate(
        { name: "Pumps", parent: ladiesFootwear._id },
        {
          name: "Pumps",
          description: "Women's pumps",
          parent: ladiesFootwear._id,
        },
        { upsert: true, new: true }
      ),
      Category.findOneAndUpdate(
        { name: "Sneakers", parent: ladiesFootwear._id },
        {
          name: "Sneakers",
          description: "Women's sneakers",
          parent: ladiesFootwear._id,
        },
        { upsert: true, new: true }
      ),
      Category.findOneAndUpdate(
        { name: "Shoes", parent: ladiesFootwear._id },
        {
          name: "Shoes",
          description: "Women's shoes",
          parent: ladiesFootwear._id,
        },
        { upsert: true, new: true }
      ),
    ]);

    console.log("Categories and subcategories added successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error adding categories:", error);
    mongoose.connection.close();
  }
};

addCategories();
