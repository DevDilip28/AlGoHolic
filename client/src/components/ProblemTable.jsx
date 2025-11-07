import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus } from "lucide-react";

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
  const sentinelRef = useRef(null);

  const solvedProblemIds = useMemo(() => {
    if (!authUser) return new Set();
    return new Set(
      problems
        .filter((p) => p.solvedBy?.some((user) => user.userId === authUser.id))
        .map((p) => p.id)
    );
  }, [problems, authUser]);

  const allTags = useMemo(() => {
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [problems]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => difficulty === "ALL" || p.difficulty === difficulty)
      .filter((p) => selectedTag === "ALL" || p.tags?.includes(selectedTag));
  }, [problems, search, difficulty, selectedTag]);

  const displayedProblems = useMemo(() => {
    return filteredProblems.slice(0, visibleCount);
  }, [filteredProblems, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < filteredProblems.length) {
          setVisibleCount((prev) =>
            Math.min(prev + 10, filteredProblems.length)
          );
        }
      },
      { threshold: 1.0 }
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

  const getDifficultyBadge = (diff) => {
    const base = "badge font-semibold text-xs text-white";
    if (diff === "EASY") return `${base} badge-success`;
    if (diff === "MEDIUM") return `${base} badge-warning`;
    return `${base} badge-error`;
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search problems..."
          className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered bg-base-100"
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
          className="select select-bordered bg-base-100"
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

      <div className="overflow-x-auto rounded-xl border border-base-300 shadow-sm">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th className="w-12">✓</th>
              <th>Problem</th>
              <th>Tags</th>
              <th>Difficulty</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
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
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  <div className="space-y-2">
                    <p className="text-lg">No problems match your filters.</p>
                    <p className="text-sm">
                      Try adjusting your search or tags.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredProblems.length > 10 &&
        visibleCount < filteredProblems.length && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Loading more problems...
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
