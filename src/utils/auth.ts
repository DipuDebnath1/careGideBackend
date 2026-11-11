/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import config from "../config";


// refresh token decoded
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token as string,
      config.JWT_SECRET,
    ) as JwtPayload;
    console.log("Decoded token:", decoded); // Debugging line
    return decoded;
  } catch (error: any) {
    throw new AppError(
      401,
      'Invalid token: ' + error.message,
    );
  }
};

// Authorization middleware
const auth =
  (...requiredRights: string[]) =>
  async (req: any, res: any, next: any) => {
    try {
        let token: string | undefined;
      // token get from  cookie or header
      if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      } else if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return next(
          new AppError(401, 'Unauthorized Access '),
        );
      }
      // verify token
      const decodedData: any = verifyToken(token);

      // Check if the user has required rights
      if (requiredRights.length) {
        const hasRequiredRights = requiredRights.includes(decodedData.role);
        if (!hasRequiredRights ) {
          return next(new AppError(403, 'Forbidden'));
        }
      }
      // Attach the user to the request object
      req.user = decodedData;

      // Continue to the next middleware
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
