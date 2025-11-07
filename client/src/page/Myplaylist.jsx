import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Loader, RefreshCw } from "lucide-react";

const PlaylistDashboard = () => {
  const { playlists, getAllPlaylists, isLoading, error } = usePlaylistStore();

  const handleRefresh = () => {
    if (!isLoading) getAllPlaylists();
  };

  const playlistsWithCount = useMemo(() => {
    return playlists.map((playlist) => ({
      ...playlist,
      problemCount: playlist._count?.problems ?? playlist.problems?.length ?? 0,
    }));
  }, [playlists]);

  useEffect(() => {
    getAllPlaylists();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          My Playlists
        </h1>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="btn btn-ghost btn-sm gap-2 text-gray-600 hover:text-gray-900 dark:hover:text-gray-100"
          aria-label="Refresh playlists"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-error bg-error/10 p-6 text-center">
          <p className="text-error font-medium mb-2">
            Failed to load playlists
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error.message || "An unexpected error occurred."}
          </p>
          <button onClick={handleRefresh} className="btn btn-sm btn-error">
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : playlistsWithCount.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-xl bg-base-100/50">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
            No playlists found
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            Create your first playlist from the Problem Library to organize your
            coding practice.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors min-w-[180px]"
          >
            Go to Problem Library
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {playlistsWithCount.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlists/${playlist.id}`}
              className="block p-6 border border-base-300 rounded-xl hover:bg-base-200/50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none shadow-sm hover:shadow-md"
              aria-label={`View playlist: ${playlist.name}`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                  {playlist.name}
                </h2>
                <span className="badge badge-primary whitespace-nowrap px-3 py-1">
                  {playlist.problemCount} problem
                  {playlist.problemCount !== 1 ? "s" : ""}
                </span>
              </div>
              {playlist.description ? (
                <p className="text-gray-600 dark:text-gray-400 mt-3 text-base leading-relaxed">
                  {playlist.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDashboard;
