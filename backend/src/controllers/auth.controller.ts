import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { RegisterInput, LoginInput } from "../validators/schemas";

const userRepository = new UserRepository();

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const userId = await userRepository.create(email, hashedPassword, name);

    // Generate token
    const token = generateToken({ id: userId, email });

    // Get user info
    const user = await userRepository.findById(userId);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    // Get user info (without password)
    const userInfo = await userRepository.findById(user.id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: userInfo,
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};
