import { NextFunction, Request, Response } from "express";

import config from "../../config";
import jwt, { Secret } from "jsonwebtoken";

import httpStatus from "http-status";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import prisma from "../../shared/prisma";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new ApiError(401, "No authorization header");

      // ✅ Handle both "Bearer <token>" and raw token
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
      if (!token) throw new ApiError(401, "Invalid token");

      const verifiedUser = jwt.verify(
        token,
        config.jwt.jwt_secret as Secret
      ) as { id: string; email: string; role: string };
      if (!verifiedUser?.id) throw new ApiError(401, "Invalid token");

      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.id },
      });
      if (!user) throw new ApiError(404, "User not found");
      if (user.status === "BLOCKED")
        throw new ApiError(403, "Your account is blocked");

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(403, "Forbidden");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
