import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData?.email) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! with this email " + payload.email
    );
  }
};

export const AuthServices = {
  loginUser,
};
