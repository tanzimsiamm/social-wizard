import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendSuccessResponse } from "../../../utils/SendResponse";
import { IUserRegisterInput, IUserLoginInput } from "./auth.interface";

// Register User
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const body: IUserRegisterInput = req.body;

  const result = await authServices.registerUserToDb(body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

// Login User
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const body: IUserLoginInput = req.body;
  const tokens = await authServices.loginUserToDb(body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: tokens,
  });
});

// Refresh Token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const tokens = await authServices.refreshTokenFromDb(refreshToken);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Token refreshed successfully",
    data: tokens,
  });
});

export const authController = {
  registerUser,
  loginUser,
  refreshToken,
};
