import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //get all comments for a video
  try {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
      throw new ApiError(400, "Bad request: please provide video Id.");
    }

    page = Number(page);
    limit = Number(limit);

    const startIndex = (page - 1) * limit;

    const comments = await Comment.aggregate([
      {
        $match: {
          video: mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          _id: 1,
          content: 1,
          "owner.username": 1,
          "owner.email": 1,
          "owner.avatar": 1,
          "owner.fullName": 1,
        },
      },
    ]);

    if (!comments) {
      throw new ApiError(500, "Server error: failed to fetch comments.");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          comments,
          currentPage: page,
          hasNextPage: comments.length === limit,
        },
        "Comments fetched successfully."
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Server error: failed to fetch comments."
    );
  }
});

const addComment = asyncHandler(async (req, res) => {
  // add a comment to a video
  try {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || !videoId) {
      throw new ApiError(400, "Bad request: missing required fields.");
    }

    const comment = await Comment.create({
      content,
      video: videoId,
      owner: userId,
    });

    if (!comment) {
      throw new ApiError(500, "Server error: failed to add comment.");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, comment, "Comment added successfully."));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Server error: failed to add comment."
    );
  }
});

const updateComment = asyncHandler(async (req, res) => {
  //  update a comment
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !commentId) {
      throw new ApiError(400, "Bad request: missing required fields.");
    }

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    if (!comment) {
      throw new ApiError(500, "Server error: failed to update comment.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment updated successfully."));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Server error: failed to update comment."
    );
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  //delete a comment
  try {
    const { commentId } = req.params;

    if (!commentId) {
      throw new ApiError(400, "Bad request: missing required fields.");
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      throw new ApiError(500, "Server error: failed to delete comment.");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment deleted successfully."));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Server error: failed to delete comment."
    );
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
