import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: res.data.data });
    } catch (error) {
      console.error("Error fetching all problems:", error);
      toast.error(" ❌ Failed to fetch problems.");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);
      set({ problem: res.data.data });
      toast.success(res.data?.message || "Problem fetched successfully!");
    } catch (error) {
      console.error("Error fetching problem with id", error);
      toast.error(" ❌ Failed to fetch problem.");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problem");
      set({ solvedProblems: res.data.data });
      toast.success(
        res.data?.message || "Solved problems fetched successfully!"
      );
    } catch (error) {
      console.error(" Error fetching solved problems:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to fetch solved problems.";
      toast.error(errorMsg);
    }
  },
}));
