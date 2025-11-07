import React, { useEffect, useState } from "react";
import {
  Trophy,
  Target,
  Calendar,
  Flame,
  Star,
  Award,
  TrendingUp,
  CheckCircle,
  Mail,
  Loader,
  Zap,
  Crown,
  Medal,
  Activity,
  BarChart3,
  GitBranch,
  GitCommit,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useProblemStore } from "../store/useProblemStore";

const getStreak = () => {
  const data = JSON.parse(localStorage.getItem("streakData"));
  return data?.streakCount || 0;
};

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { problems, solvedProblems, getSolvedProblemByUser, getAllProblems } =
    useProblemStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSolved: 0,
    totalProblems: 0,
    streak: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        await Promise.all([getAllProblems(), getSolvedProblemByUser()]);
      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [getAllProblems, getSolvedProblemByUser]);

  useEffect(() => {
    if (!loading && problems.length > 0) {
      const solvedIds = new Set(solvedProblems.map((s) => s.problemId));
      setStats({
        totalSolved: solvedIds.size,
        totalProblems: problems.length,
        streak: getStreak(),
        longestStreak: authUser?.longestStreak || 0,
      });
    }
  }, [problems, solvedProblems, authUser, loading]);

  const streakBadges = [
    {
      threshold: 7,
      title: "Week Warrior",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-gradient-to-br from-orange-500/10 to-orange-600/10",
    },
    {
      threshold: 14,
      title: "Fortnight Fanatic",
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-gradient-to-br from-yellow-500/10 to-amber-500/10",
    },
    {
      threshold: 30,
      title: "Month Master",
      icon: Crown,
      color: "text-purple-500",
      bg: "bg-gradient-to-br from-purple-500/10 to-violet-500/10",
    },
    {
      threshold: 50,
      title: "Streak Legend",
      icon: Star,
      color: "text-blue-500",
      bg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
    },
    {
      threshold: 100,
      title: "Ultimate Streaker",
      icon: Trophy,
      color: "text-emerald-500",
      bg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "First Solve",
      icon: CheckCircle,
      earned: stats.totalSolved > 0,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      id: 2,
      title: "10 Solves",
      icon: Target,
      earned: stats.totalSolved >= 10,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: 3,
      title: "7-Day Streak",
      icon: Flame,
      earned: stats.streak >= 7,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      id: 4,
      title: "Consistency King",
      icon: TrendingUp,
      earned: stats.longestStreak >= 30,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      id: 5,
      title: "Problem Master",
      icon: Star,
      earned: stats.totalSolved >= 50,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      id: 6,
      title: "Code Crusader",
      icon: Award,
      earned: stats.totalSolved >= 100,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const recentActivity = solvedProblems.slice(0, 5).map((s, i) => ({
    id: i,
    title:
      problems.find((p) => p._id === s.problemId)?.title || "Unknown Problem",
    status: s.status || "Accepted",
    time: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "Recently",
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <Loader className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-100">
      <motion.section
        className="w-full py-12 px-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
              {authUser?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-green-500 w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {authUser?.name || "User"}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {authUser?.bio || "Problem Solver • Learner • Coder"}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {authUser?.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-6 py-3 shadow-md">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            <Flame className="w-4 h-4 text-orange-500" />
            Current Streak
          </div>
          <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
            {stats.streak} days
          </p>
        </div>
      </motion.section>

      <div className="w-full max-w-7xl mx-auto py-10 px-6 space-y-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Problems Solved",
              value: stats.totalSolved,
              icon: CheckCircle,
              color: "from-green-500 to-emerald-600",
            },
            {
              title: "Longest Streak",
              value: `${stats.longestStreak}d`,
              icon: TrendingUp,
              color: "from-blue-500 to-indigo-600",
            },
            {
              title: "Completion",
              value: `${
                Math.round((stats.totalSolved / stats.totalProblems) * 100) || 0
              }%`,
              icon: BarChart3,
              color: "from-purple-500 to-violet-600",
            },
            {
              title: "Achievements",
              value: achievements.filter((a) => a.earned).length,
              icon: Award,
              color: "from-amber-500 to-orange-600",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div
                className={`p-2.5 rounded-lg bg-gradient-to-r ${s.color} text-white w-fit mb-3`}
              >
                <s.icon className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold mb-0.5">{s.value}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {s.title}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg border text-center transition-all ${
                  achievement.earned
                    ? `${achievement.bg} ${achievement.color} border-current shadow-sm`
                    : "border-slate-200 dark:border-slate-700 text-slate-400 bg-slate-50 dark:bg-slate-800/40"
                }`}
              >
                <achievement.icon
                  className={`w-5 h-5 mx-auto mb-1 ${
                    achievement.earned ? "" : "grayscale"
                  }`}
                />
                <h3 className="text-sm font-medium">{achievement.title}</h3>
                <p className="text-xs text-slate-500">
                  {achievement.earned ? "Earned!" : "Locked"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-500" /> Streak Badges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {streakBadges.map((badge, index) => {
                const isEarned = stats.streak >= badge.threshold;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border text-center ${
                      isEarned
                        ? `${badge.bg} ${badge.color} border-current shadow-sm`
                        : "border-slate-200 dark:border-slate-700 text-slate-400 bg-slate-50 dark:bg-slate-800/40"
                    }`}
                  >
                    <badge.icon
                      className={`w-5 h-5 mx-auto mb-1 ${
                        isEarned ? "" : "grayscale"
                      }`}
                    />
                    <h3 className="text-sm font-medium">{badge.title}</h3>
                    <p className="text-xs text-slate-500">
                      {badge.threshold} days
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.length ? (
                recentActivity.map((a) => (
                  <motion.div
                    key={a.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex justify-between items-center transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          a.status === "Accepted"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {a.status === "Accepted" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {a.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {a.status}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {a.time}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-6">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No activity yet</p>
                  <p className="text-xs mt-1 text-slate-400">
                    Solve your first problem to see it here!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
