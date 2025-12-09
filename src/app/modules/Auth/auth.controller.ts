// import { Request, Response } from "express";
// import { AuthServices } from "./auth.service";
// import httpStatus from "http-status";
// // login user
// const loginUser = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthServices.loginUser(req.body);
//   res.cookie("token", result.token, { httpOnly: true });
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: result.message || "User logged in successfully",
//     data: result,
//   });
// });



// export const AuthController = {
//   loginUser,
// };
