import { asyncHandler } from "../utils/async-handle.js";
import { db } from "../libs/db.js";
import { ApiResponse } from "../utils/api-response.js";

export const getAllSubmission = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const submissions = await db.submission.findMany({
    where: {
      userId: userId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "Submissions fetched successfully")
    );
});

export const getSubmissionsForProblem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const problemId = req.params.problemId;

  const submissions = await db.submission.findMany({
    where: {
      userId: userId,
      problemId: problemId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "Submissions fetched successfully")
    );
});

export const getAllTheSubmissionsForProblem = asyncHandler(async (req, res) => {
  const problemId = req.params.problemId;
  const submissions = await db.submission.count({
    where: {
      problemId: problemId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "Submissions fetched successfully")
    );
});
