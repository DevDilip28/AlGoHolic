import React, { useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Loader, ArrowLeft } from "lucide-react";

const getDifficultyBadge = (diff) => {
  const base = "badge font-semibold text-xs text-white";
  if (diff === "EASY") return `${base} badge-success`;
  if (diff === "MEDIUM") return `${base} badge-warning`;
  return `${base} badge-error`;
};

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { currentPlaylist, getPlaylistDetails, isLoading, error } =
    usePlaylistStore();

  useEffect(() => {
    if (playlistId) getPlaylistDetails(playlistId);
  }, [playlistId, getPlaylistDetails]);

  const {
    name = "",
    description = "",
    problems: problemRelations = [],
  } = currentPlaylist || {};

  const problems = useMemo(
    () => problemRelations.map((rel) => rel?.problem).filter(Boolean),
    [problemRelations]
  );

  const solvedProblemIds = useMemo(() => {
    if (!authUser || !problems.length) return new Set();
    return new Set(
      problems
        .filter((p) =>
          p?.solvedBy?.some((u) => (u.userId ?? u.id) === authUser.id)
        )
        .map((p) => p.id)
    );
  }, [problems, authUser]);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading playlist...
        </p>
      </div>
    );
  }

  if (error || !currentPlaylist) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-error text-lg font-medium mb-2">
          {error ? "Failed to load playlist" : "Playlist not found"}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error?.message || "The playlist you're looking for doesn't exist."}
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors"
        aria-label="Back to Playlists"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Playlists</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {name}
        </h1>
        <span className="badge badge-primary px-3 py-1">
          {problems.length} problem{problems.length !== 1 ? "s" : ""}
        </span>
      </div>

      {description && (
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">
          {description}
        </p>
      )}

      {problems.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 rounded-xl bg-base-100/50">
          <p>This playlist is empty.</p>
          <Link
            to="/"
            className="text-indigo-500 hover:underline mt-2 inline-block"
          >
            Add problems from the Problem Library
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-base-300 shadow-sm">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200 text-base-content">
              <tr>
                <th className="w-12">✓</th>
                <th>Problem</th>
                <th>Tags</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => {
                const isSolved = solvedProblemIds.has(problem.id);
                return (
                  <tr
                    key={problem.id}
                    className="hover:bg-base-200/50 transition-colors"
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {problem.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="badge badge-outline badge-accent text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={getDifficultyBadge(problem.difficulty)}>
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
