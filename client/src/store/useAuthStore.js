import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { updateStreak } from "../lib/streak.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/getme");
      const user = res.data.data;
      set({ authUser: user });
      toast.success(`👋 Welcome back, ${user.name}!`);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Session expired. Please log in again.";
      toast.error(`🔒 ${message}`);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.data });
      toast.success(res.data.message || "✅ Account created successfully!");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to create account. Please try again.";
      toast.error(`❌ ${message}`);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.data });

      updateStreak();

      toast.success(res.data.message || "✅ Login successful!");
      return true;
    } catch {
      toast.error("❌ Invalid email or password");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("👋 You’ve been logged out!");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong while logging out.";
      toast.error(`⚠️ ${message}`);
    }
  },
}));
