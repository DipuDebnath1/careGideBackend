import { PipelineStage, Types } from "mongoose";
import Post from "./post.model";

const createPost = async (
  userId: string,
  payload: { title: string; content: string }
) => {
  const post = await Post.create({
    title: payload.title,
    content: payload.content,
    author: new Types.ObjectId(userId),
  });

  return {
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    author: post.author.toString(),
    createdAt: post.createdAt,
  };
};

// One aggregation: match the user, then $lookup their posts from the posts collection.
const getPosts = async (query: any) => {
  const filter: any = {
    isDeleted: false,
  };
  if (query.author) filter.author = new Types.ObjectId(query.author);
  if (query.search) filter.title = { $regex: query.search, $options: "i" };

  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const pipeline: PipelineStage[] = [
  {
    $match: filter,
  }, 
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "author",
    },
  },
  {
    $unwind: "$author",
  },
  {
    $project: {
      _id: 1,
      authorName: "$author.name",
      authorId: "$author._id",
      title: 1,
      content: 1,
      createdAt: 1,
    },
  },
  {
    $sort: {
      createdAt: -1,
    },
  },
  {
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      total: [{ $count: 'count' }],
    },
  },

  ];

  const result = await Post.aggregate(pipeline);
  const total = result[0]?.total[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: result[0]?.data ?? [],
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const PostService = {
  createPost,
  getPosts,
};
