import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";
import CodeBackground from "../components/CodeBackground.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import AlGoHolLogo from"../assets/Logo.png";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="flex flex-col justify-center px-10 sm:px-16 lg:px-20 py-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-3">
            <img
              src={AlGoHolLogo}
              alt="AlGoHol!c"
              className="w-12 h-12 rounded-xl"
            />
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              AlGoHol!c
            </h1>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Welcome Back, Coder!
          </h2>

          <p className="text-slate-300 leading-relaxed max-w-md">
            Track your progress, solve daily challenges, and keep your DSA
            streak alive. Every login is a step closer to interview mastery.
          </p>

          <div className="grid grid-cols-2 gap-3 text-slate-200 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={18} /> Daily Practice
              Tracker
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={18} /> Personalized
              Progress Graphs
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={18} /> Competitive
              Leaderboards
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={18} /> Rewarding Streak
              System
            </div>
          </div>
        </motion.div>

        <CodeBackground
          title="Continue your coding streak"
          subtitle="Log in to unlock your personalized dashboard."
          small
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-center items-center bg-slate-950/80 backdrop-blur-lg px-10 py-12"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Sign In to AlGoHol!c
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Access your progress, challenges, and achievements.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label-text font-medium">Email Address</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={`input input-bordered w-full pl-10 bg-slate-800 border-slate-700 focus:border-primary text-white ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="label-text font-medium">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-10 bg-slate-800 border-slate-700 focus:border-primary text-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input type="checkbox" className="checkbox checkbox-primary" />{" "}
                Remember me
              </label>
              <Link className="text-sm font-medium text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn btn-primary w-full h-12 flex items-center justify-center gap-2 text-base font-semibold mt-3 hover:scale-105 active:scale-95 transition-all"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="link link-primary font-medium hover:text-primary/80"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
