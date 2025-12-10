import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import {
  IAuthTokens,
  IUserLoginInput,
  IUserRegisterInput,
  IUserResponse,
} from "./auth.interface";
import ApiError from "../../../errors/ApiErrors";
import { comparePassword, hashPassword } from "../../../utils/bcrypt.util";
import { IJwtPayload } from "../../../interfaces/common";
import { generateToken, verifyToken } from "../../../utils/jwt.util";
const SALT_ROUNDS = 10;

export const registerUserToDb = async (
  data: IUserRegisterInput
): Promise<IUserResponse> => {
  const email = data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "Email already exists");

  const hashedPassword = await hashPassword(data.password);

  const now = new Date();
  const freeTrialEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3-day trial

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      subscriptionStatus: "trial",
      freeTrialStart: now,
      freeTrialEnd,
    },
  });

  return {
    id: user.id,
    email: user.email,
    isPremium: user.isPremium,
    subscriptionStatus: user.subscriptionStatus,
    freeTrialStart: user.freeTrialStart!,
    freeTrialEnd: user.freeTrialEnd!,
    createdAt: user.createdAt,
  };
};

const loginUserToDb = async (data: IUserLoginInput): Promise<IAuthTokens> => {
  const email = data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Password or email is incorrect");

  const match = await comparePassword(data.password, user.password);
  if (!match) throw new ApiError(401, "Password or email is incorrect");

  const payload: Omit<IJwtPayload, "iat" | "exp"> = {
    userId: user.id,
    email: user.email,
  };

  // use config based expiries
  const accessToken = generateToken(payload, "access");
  const refreshToken = generateToken(payload, "refresh");

  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefresh },
  });

  return { accessToken, refreshToken };
};

const refreshTokenFromDb = async (token: string): Promise<IAuthTokens> => {
  const decoded = verifyToken(token, "refresh");

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user || !user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const match = await bcrypt.compare(token, user.refreshToken);
  if (!match) {
    throw new ApiError(401, "Refresh token does not match");
  }

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const newAccessToken = generateToken(payload, "access");
  const newRefreshToken = generateToken(payload, "refresh");

  const hashedNewRefresh = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedNewRefresh },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutFromDb = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return true;
};

export const authServices = {
  registerUserToDb,
  loginUserToDb,
  refreshTokenFromDb,
  logoutFromDb,
};
