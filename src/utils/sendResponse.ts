import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  accessToken?: String;
};

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  res.status(responseData.statusCode).json({
    success: responseData.success,
    statusCode: responseData.statusCode,
    message: responseData.message,
    data: responseData.data,
    accessToken: responseData.accessToken,
  });
};

export default sendResponse;
