import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  Trash,
  TrashIcon,
  Plus,
  Filter,
  X,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore.js";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";

const ProblemTable = ({ problems = [] }) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const sentinelRef = useRef(null);

  // Memoized solved problem IDs
  const solvedProblemIds = useMemo(() => {
    if (!authUser) return new Set();
    return new Set(
      problems
        .filter((p) => p.solvedBy?.some((user) => user.userId === authUser.id))
        .map((p) => p.id)
    );
  }, [problems, authUser]);

  // Extract unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [problems]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => difficulty === "ALL" || p.difficulty === difficulty)
      .filter((p) => selectedTag === "ALL" || p.tags?.includes(selectedTag));
  }, [problems, search, difficulty, selectedTag]);

  const displayedProblems = useMemo(() => {
    return filteredProblems.slice(0, visibleCount);
  }, [filteredProblems, visibleCount]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < filteredProblems.length) {
          setVisibleCount((prev) =>
            Math.min(prev + 10, filteredProblems.length)
          );
        }
      },
      { threshold: 0.5 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.disconnect();
      }
    };
  }, [visibleCount, filteredProblems.length]);

  // Difficulty badge class
  const getDifficultyBadge = (diff) => {
    const base = "badge font-semibold text-xs px-2 py-1";
    if (diff === "EASY") return `${base} badge-success text-white`;
    if (diff === "MEDIUM") return `${base} badge-warning text-white`;
    return `${base} badge-error text-white`;
  };

  const handleDelete = (id) => {
    onDeleteProblem(id);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Problem Library
        </h2>
        <button
          className="btn btn-primary gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="sm:hidden mb-4">
        <button
          className="btn btn-outline w-full flex items-center justify-between px-4 py-3 text-base font-medium"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <span className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </span>
          <X
            className={`w-5 h-5 transition-transform ${
              showMobileFilters ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </div>

      {/* Filters */}
      <div className={`mb-6 space-y-3 ${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
        <input
          type="text"
          placeholder="🔍 Search problems..."
          className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            className="select select-bordered bg-base-100 focus:outline-none"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="ALL">All Difficulties</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff.charAt(0) + diff.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered bg-base-100 focus:outline-none"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="ALL">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-base-300 shadow-sm">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content text-sm">
            <tr>
              <th className="w-12"></th>
              <th className="text-left">Problem</th>
              <th className="text-left">Tags</th>
              <th className="text-center">Difficulty</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {displayedProblems.length > 0 ? (
              displayedProblems.map((problem) => {
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
                        aria-label={`Solved: ${problem.title}`}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-medium text-primary hover:underline block"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {problem.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="badge badge-outline badge-accent text-xs px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={getDifficultyBadge(problem.difficulty)}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {authUser?.role === "ADMIN" && (
                          <>
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-sm btn-error btn-square tooltip"
                              data-tip="Delete problem"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                            <button
                              disabled
                              className="btn btn-sm btn-warning btn-square opacity-60 tooltip"
                              data-tip="Edit (coming soon)"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-sm btn-outline btn-primary gap-1"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  <div className="space-y-2">
                    <p className="text-lg font-medium">No problems found</p>
                    <p className="text-sm opacity-80">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {displayedProblems.length > 0 ? (
          displayedProblems.map((problem) => {
            const isSolved = solvedProblemIds.has(problem.id);
            return (
              <div
                key={problem.id}
                className="card bg-base-100 border border-base-300 shadow-sm hover:shadow transition-shadow duration-200"
              >
                <div className="card-body p-4">
                  {/* Title & Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSolved}
                      readOnly
                      aria-label={`Solved: ${problem.title}`}
                      className="checkbox checkbox-sm checkbox-primary mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-medium text-primary hover:underline block text-sm leading-tight"
                      >
                        {problem.title}
                      </Link>
                    </div>
                  </div>

                  {/* Tags - Centered */}
                  <div className="flex flex-wrap justify-center gap-1 mt-3">
                    {problem.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-outline badge-accent text-xs px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.tags?.length > 3 && (
                      <span className="badge badge-ghost text-xs px-2 py-1">
                        +{problem.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Difficulty (Centered) & Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-3 border-t border-base-200">
                    <span className={`${getDifficultyBadge(problem.difficulty)} mx-auto sm:mx-0`}>
                      {problem.difficulty}
                    </span>
                    <div className="flex gap-2 mt-3 sm:mt-0">
                      {authUser?.role === "ADMIN" && (
                        <>
                          <button
                            onClick={() => handleDelete(problem.id)}
                            className="btn btn-sm btn-error btn-square"
                            aria-label="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <button
                            disabled
                            className="btn btn-sm btn-warning btn-square opacity-60"
                            aria-label="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={() => handleAddToPlaylist(problem.id)}
                        aria-label="Save to playlist"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500">
            <div className="space-y-2">
              <p className="text-lg font-medium">No problems found</p>
              <p className="text-sm opacity-80">
                Try adjusting your search or filters.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {filteredProblems.length > 10 &&
        visibleCount < filteredProblems.length && (
          <div className="text-center py-4 text-gray-500 text-sm">
            🔄 Loading more problems...
          </div>
        )}

      <div ref={sentinelRef} className="h-1" />

      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  );
};

export default ProblemTable;