import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user/user.model.js";
import { Auth } from "../../models/user/auth.model.js";
import { Address } from "../../models/user/address.model.js";
import { Contact } from "../../models/user/contact.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    phone,
    password,
    address = [],
  } = req.body;
  if ((!firstName, !lastName, !email, !gender, !phone, !password)) {
    throw new ApiError(401, "Fill all the fields");
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Email already exists");
  }
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new ApiError(400, "Phone number already exists");
  }
  const auth = new Auth({
    password,
  });
  await auth.save()
  const addressIds = await Promise.all(
    address.map(async (addr) => {
      const newAddress = new Address(addr);
      await newAddress.save();
      return newAddress._id;
    })
  );
  const newContact = new Contact({ phone });
  await newContact.save();
  const createUser = await User.create({
    firstName,
    lastName,
    email,
    gender,
    addresses: addressIds,
    contact: newContact._id,
    auth: auth._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, createUser, "User Created successfuly"));
});

export { registerUser };
