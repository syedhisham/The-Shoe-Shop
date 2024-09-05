import { User } from "../../models/user/user.model.js";

export const makeAdmin = async (email) => {
  try {
    const result = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true } // Return the updated document
    );

    if (!result) {
      console.log(`User with email ${email} not found.`);
    } else {
      console.log(`User with email ${email} has been updated to admin.`);
    }
  } catch (err) {
    console.error("Error updating user role:", err);
  }
};
