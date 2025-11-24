import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: {
  id: number;
  email: string;
}): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): { id: number; email: string } => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.verify(token, secret) as { id: number; email: string };
};
