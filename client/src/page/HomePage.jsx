import React, { useEffect, useState } from "react";
import {
  Loader,
  Trophy,
  Code2,
  Rocket,
  Bookmark,
  Flame,
  Medal,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import { useProblemStore } from "../store/useProblemStore.js";
import ProblemTable from "../components/ProblemTable.jsx";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const [count, setCount] = useState(0);

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  useEffect(() => {
    if (problems.length > 0) {
      let start = 0;
      const end = problems.length;
      const duration = 1500;
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, stepTime);
    }
  }, [problems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="mx-auto size-8 text-primary animate-spin mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading your coding arena...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <motion.div
        className="absolute top-24 left-1/2 -translate-x-1/2 -z-10 w-[80%] h-[60%] bg-primary/10 blur-3xl rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.section
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Master <span className="text-primary">DSA</span>, Ace Your
            Interviews
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            Welcome to{" "}
            <span className="font-semibold text-primary">AlGoHol!c</span> — your
            smart DSA practice platform. Build consistency with daily
            <span className="text-primary font-medium"> streaks</span>, unlock
            <span className="text-primary font-medium">
              {" "}
              achievement badges
            </span>
            , and track your progress with insights that help you{" "}
            <span className="font-medium">crack top tech interviews</span>.
          </p>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {[
            {
              icon: <Hash className="size-6" />,
              title: "Search by DSA Tags",
              desc: "Find problems instantly using tags like arrays, strings, trees, DP, and more.",
            },
            {
              icon: <Flame className="size-6 text-orange-500" />,
              title: "Daily Streaks",
              desc: "Stay sharp with one DSA problem a day—build momentum that lasts.",
            },
            {
              icon: <Medal className="size-6 text-yellow-400" />,
              title: "Achievement Badges",
              desc: "Unlock badges from your problem submissions — rewards that grow with your progress.",
            },
            {
              icon: <Bookmark className="size-6" />,
              title: "Custom Playlists",
              desc: "Curate your own problem sets for interviews, revision, or weekly goals.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="p-5 rounded-xl bg-card hover:bg-accent/30 transition-all border border-border/20 hover:border-primary/30 group"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          className="relative mb-20 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block px-10 py-8 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 shadow-xl hover:shadow-primary/40 transition-all backdrop-blur-lg"
            whileHover={{ scale: 1.03 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="flex items-center gap-2 mb-3 text-primary justify-center"
            >
              <Trophy className="size-6" />
              <Code2 className="size-6" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-primary">{count}</span>+ Curated Problems
            </h2>

            <p className="text-muted-foreground max-w-md mx-auto">
              Practice from a growing library of curated coding challenges,
              unlock badges as you progress, and keep your streak going strong
              every day.
            </p>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-3 mt-6 justify-center"
            >
              <Rocket className="text-primary size-5" />
              <p className="text-sm font-medium text-primary">
                New problems, streaks, and badges every week 🚀
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        {problems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProblemTable problems={problems} />
          </motion.div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No problems available yet.</p>
            <p className="mt-2 text-sm">
              Stay tuned — new challenges coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
