// src/page/ProblemsPage.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useProblemStore } from "../store/useProblemStore.js";
import ProblemTable from "../components/ProblemTable.jsx";
import { Search, Filter } from "lucide-react";

const ProblemsPage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Problem <span className="text-primary">Library</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse through all available coding challenges and start your
              practice journey
            </p>
          </div>

          {isProblemsLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading problems...</p>
              </div>
            </div>
          ) : problems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ProblemTable problems={problems} />
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No Problems Found</h3>
              <p className="text-muted-foreground">
                Check back later for new challenges
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProblemsPage;
