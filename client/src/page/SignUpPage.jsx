import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Sparkles } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore.js";
import AlGoHolLogo from "../assets/Logo.png";
import CodeBackground from "../components/CodeBackground.jsx";

const SignUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data) => {
    const success = await signup(data);
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
            Master DSA with Consistency
          </h2>

          <p className="text-slate-300 leading-relaxed max-w-md">
            Build daily coding habits, visualize your progress, earn streaks &
            badges, and ace your interviews with interactive practice tools.
          </p>

          <div className="grid grid-cols-2 gap-3 text-slate-200 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={18} /> Personalized DSA
              Roadmap
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={18} /> Daily Coding
              Streaks
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={18} /> Leaderboard
              Challenges
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={18} /> Interview Prep
            </div>
          </div>
        </motion.div>

        <CodeBackground
          title="Join 10,000+ learners"
          subtitle="Sharpen your logic every single day."
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
              Create Your Account
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Join the AlGoHol!c community and start your journey today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label-text font-medium">Full Name</label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="text"
                  {...register("name")}
                  placeholder="John Doe"
                  className={`input input-bordered w-full pl-10 bg-slate-800 border-slate-700 focus:border-primary text-white ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="label-text font-medium">Email</label>
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

            <div className="flex items-start gap-2 mt-3">
              <input
                type="checkbox"
                required
                className="checkbox checkbox-primary mt-1"
              />
              <p className="text-sm text-slate-400">
                I agree to the <Link className="link link-primary">Terms</Link>{" "}
                and <Link className="link link-primary">Privacy Policy</Link>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
