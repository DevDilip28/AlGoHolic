import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addProblemToPlaylist,
  createPlaylsit,
  deletePlaylist,
  getAllPlaylistDetails,
  getPlayListDetails,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRoutes = express.Router();

playlistRoutes.post("/create-playlist", authMiddleware, createPlaylsit);

playlistRoutes.post(
  "/:playlistId/add-problem",
  authMiddleware,
  addProblemToPlaylist
);

playlistRoutes.get("/allPlaylist", authMiddleware, getAllPlaylistDetails);

playlistRoutes.get("/:playlistId", authMiddleware, getPlayListDetails);

playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);

playlistRoutes.delete(
  ":playlistId/remove-problem",
  authMiddleware,
  removeProblemFromPlaylist
);

export default playlistRoutes;
