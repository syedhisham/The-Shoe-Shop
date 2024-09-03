import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user/user.model.js";
import { Auth } from "../../models/user/auth.model.js";
import { Address } from "../../models/user/address.model.js";
import { Contact } from "../../models/user/contact.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};
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
  await auth.save();
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
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email }).populate("auth");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordValid = await user.auth.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password.");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id)
    .select("-auth.password -refreshToken -auth")
    .populate({
      path: "auth",
      select: "-password",
    })
    .lean();

  if (!loggedInUser) {
    throw new ApiError(500, "Error fetching user details.");
  }

  delete loggedInUser.auth;

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export { registerUser, loginUser, logoutUser };
