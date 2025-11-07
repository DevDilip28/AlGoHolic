import { asyncHandler } from "../utils/async-handle.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";

export const createPlaylsit = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const userId = req.user.id;

  const playList = await db.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, playList, "Playlist created successfully..."));
});

export const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Invalid or missing problemIds");
  }

  const addingProblem = await db.ProblemInPlaylist.createMany({
    data: problemIds.map((problemId) => ({
      playListId: playlistId,
      problemId,
    })),
    skipDuplicates: true,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        addingProblem,
        "Problems added to playlist successfully"
      )
    );
});

export const getAllPlaylistDetails = asyncHandler(async (req, res) => {
  const playlists = await db.playlist.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlists || playlists.length === 0) {
    throw new ApiError(404, "No playlists found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Successfully fetched all playlist"));
});

export const getPlayListDetails = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Successfully fetched playlist"));
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const DeletePlaylist = await db.playlist.delete({
    where: {
      id: playlistId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, DeletePlaylist, "Playlist deleted successfullly")
    );
});

export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Invalid or missing problemIds");
  }

  const removedProblems = await db.ProblemInPlaylist.deleteMany({
    where: {
      playListId: playlistId,
      problemId: {
        in: problemIds,
      },
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        removedProblems,
        "Problems removed from playlist successfully"
      )
    );
});
