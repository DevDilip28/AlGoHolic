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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="btn btn-outline w-full h-12 flex items-center justify-center gap-2 text-base font-semibold hover:border-primary/50">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.25 1.19-1.08 2.17-2.3 2.75V21h3.93c2.29-1.87 3.67-4.72 3.67-8.75z"
                  fill="#4285F4"
                />
                <path
                  d="M12 21c2.29 0 4.15-.92 5.44-2.4L12 15.5v-4.26H8.07a12.87 12.87 0 0 0 3.93 8.75c.23.13.46.25.7.35z"
                  fill="#34A853"
                />
                <path
                  d="M7.07 14.5c-.28-.82-.44-1.71-.44-2.5s.16-1.68.44-2.5V6.5H3.7a12.87 12.87 0 0 0 0 13h3.37z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.5c1.56 0 2.98.52 4.16 1.54L20.5 2.1C18.36 0 15.4 0 12 0C9.4 0 7.07 0 5.3 0L12 4.5z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <button className="btn btn-outline w-full h-12 flex items-center justify-center gap-2 text-base font-semibold hover:border-primary/50">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.576v-4.242C6.281 17.695 5.017 16.008 5.017 14.004c0-.694.25-1.336.734-1.824-.007-.184-.013-1.232.013-1.788.627-.084 1.258-.058 1.878.004.234.132.448.326.618.572.55.843 1.487 1.428 2.546 1.428 1.059 0 2.002-.585 2.546-1.428.17-.246.384-.44.618-.572.62-.062 1.251-.088 1.878-.004.026.556.007 1.604.013 1.788.484.488.734 1.13.734 1.824 0 2.004-1.264 3.691-3.022 4.004v4.242c0 .315.194.687.793.576C18.562 21.8 22 17.302 22 12c0-6.627-5.373-12-12-12z"
                  fill="#1D1D1D"
                />
              </svg>
              Continue with GitHub
            </button>
          </div>

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
