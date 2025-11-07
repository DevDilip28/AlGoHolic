import { asyncHandler } from "../utils/async-handle.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
} from "../libs/judge0.lib.js";

export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    example,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
    hints,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "You are not allowed to create a problem!");
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);
    if (!languageId) {
      throw new ApiError(400, `Language ${language} is not supported`);
    }

    const submissions = testcases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    const submissionResults = await submitBatch(submissions);
    const tokens = submissionResults.map((res) => res.token);
    const results = await pollBatchResults(tokens);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status.id !== 3) {
        return res.status(400).json({
          error: `Testcase ${i + 1} failed for language ${language}`,
        });
      }
    }
  }

  const newProblem = await db.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      example,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
      hints,
      userId: req.user.id,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newProblem, "Problem created successfully"));
});

export const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany({
    include: {
      solvedBy: {
        where: {
          userId: req.user.id,
        },
      },
    },
  });

  if (!problems || problems.length === 0) {
    throw new ApiError(404, "No problems found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, problems, "Problems fetched successfully"));
});

export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({ where: { id } });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, problem, "Problem fetched successfully"));
});

export const updateProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    example,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  const { id } = req.params;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "You are not allowed to update a problem!");
  }

  const existingProblem = await db.problem.findUnique({ where: { id } });
  if (!existingProblem) {
    throw new ApiError(404, "Problem not found");
  }

  if (referenceSolutions && testcases) {
    try {
      await Promise.all(
        Object.entries(referenceSolutions).map(
          async ([language, solutionCode]) => {
            const languageId = getJudge0LanguageId(language);
            if (!languageId) {
              throw new ApiError(400, `Language ${language} is not supported`);
            }

            const submissions = testcases.map(({ input, output }) => ({
              source_code: solutionCode,
              language_id: languageId,
              stdin: input,
              expected_output: output,
            }));

            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((res) => res.token);
            const results = await pollBatchResults(tokens);

            results.forEach((result, index) => {
              if (result.status.id !== 3) {
                throw new ApiError(
                  400,
                  `Testcase ${index + 1} failed for language ${language}`
                );
              }
            });
          }
        )
      );
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(500, "Failed to verify reference solutions");
    }
  }

  const dataToUpdate = {};
  if (title !== undefined) dataToUpdate.title = title;
  if (description !== undefined) dataToUpdate.description = description;
  if (difficulty !== undefined) dataToUpdate.difficulty = difficulty;
  if (tags !== undefined) dataToUpdate.tags = tags;
  if (example !== undefined) dataToUpdate.example = example;
  if (constraints !== undefined) dataToUpdate.constraints = constraints;
  if (testcases !== undefined) dataToUpdate.testcases = testcases;
  if (codeSnippets !== undefined) dataToUpdate.codeSnippets = codeSnippets;
  if (referenceSolutions !== undefined)
    dataToUpdate.referenceSolutions = referenceSolutions;

  const updatedProblem = await db.problem.update({
    where: { id },
    data: dataToUpdate,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProblem, "Problem updated successfully"));
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({ where: { id } });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  await db.problem.delete({ where: { id } });

  return res
    .status(200)
    .json(new ApiResponse(200, "Problem deleted successfully"));
});

export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany({
    where: {
      solvedBy: {
        some: {
          userId: req.user.id,
        },
      },
    },
    include: {
      solvedBy: {
        where: {
          userId: req.user.id,
        },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, problems, "Problems fetched successfully"));
});
