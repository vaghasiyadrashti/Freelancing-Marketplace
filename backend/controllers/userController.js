import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import validator from "validator";

export const register = catchAsyncErrors(async (req, res, next) => {
  try{

    const { name, email, phone, password, role } = req.body;

    // Trim inputs & normalize email
    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    password = password?.trim();

    if (!name || !email || !phone || !password || !role) {
      return next(new ErrorHandler("Please fill full form!"));
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return next(new ErrorHandler("Invalid email format!", 400));
    }

    // Validate phone number format
    if (!validator.isMobilePhone(phone, "any")) {
      return next(new ErrorHandler("Invalid phone number!", 400));
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return next(new ErrorHandler("Email already registered!"));
    }

    // create a new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });
    sendToken(user, 201, res, "User Registered!");
  } catch(err) {
    next(err);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {

  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return next(new ErrorHandler("Please provide email ,password and role."));
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }
    if (user.role !== role) {
      return next(
        new ErrorHandler(`User with provided email and ${role} not found!`, 404)
        );
      }
   
    sendToken(user, 201, res, "User Logged In!");
  } catch (error) {
     next(error);
  }

});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


// Log-In user
export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});