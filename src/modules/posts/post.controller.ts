import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IRequestWithUser } from "../user/user.interface";
import { PostService } from "./post.service";

const createPost = catchAsync(async (req: IRequestWithUser, res: Response) => {
  const post = await PostService.createPost(req.user.userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Post created successfully",
    data: post,
  });
});

const getPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.getPosts(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Posts retrieved successfully",
    data: result,
  });
});

export const PostController = {
  createPost,
  getPosts,
};
