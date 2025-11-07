import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  CheckCircle2,
  XCircle,
  MemoryStick as Memory,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionsList from "../components/SubmissionList";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  const { executeCode, submission, isExecuting, error } = useExecutionStore();

  useEffect(() => {
    if (id) {
      getProblemById(id);
      getSubmissionCountForProblem(id);
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  useEffect(() => {
    if (problem) {
      const snippet = problem.codeSnippets?.[selectedLanguage] || "";
      setCode(submission?.sourceCode || snippet);
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage, submission?.sourceCode]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem?.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>
            {problem.example && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                <div className="space-y-6">
                  {Object.values(problem.example).map((ex, index) => (
                    <div
                      key={index}
                      className="bg-base-200 p-6 rounded-xl font-mono"
                    >
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 font-semibold">
                          Input:
                        </div>
                        <pre className="bg-black/90 px-4 py-2 rounded-lg text-white overflow-x-auto">
                          {ex.input}
                        </pre>
                      </div>
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 font-semibold">
                          Output:
                        </div>
                        <pre className="bg-black/90 px-4 py-2 rounded-lg text-white overflow-x-auto">
                          {ex.output}
                        </pre>
                      </div>
                      {ex.explanation && (
                        <div>
                          <div className="text-emerald-300 mb-2 font-semibold">
                            Explanation:
                          </div>
                          <p className="text-base-content/80">
                            {ex.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl">
                  <div className="bg-black/90 px-4 py-3 rounded-lg text-white text-lg font-mono whitespace-pre-wrap break-words">
                    {problem.constraints}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );

      case "discussion":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-base-content/70">
            <MessageSquare className="w-12 h-12 mb-4 opacity-60" />
            <p>No discussions yet. Be the first to start one!</p>
          </div>
        );

      case "hints":
        return (
          <div className="p-4">
            {problem.hints ? (
              Array.isArray(problem.hints) ? (
                <ul className="list-disc pl-5 space-y-2 text-white">
                  {problem.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              ) : typeof problem.hints === "string" ? (
                <p className="text-white whitespace-pre-line">
                  {problem.hints}
                </p>
              ) : (
                <p className="text-base-content/70">Unsupported hints format</p>
              )
            ) : (
              <p className="text-base-content/70">No hints available</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const parseJsonField = (field) => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch (e) {
      console.warn("Failed to parse JSON field:", field);
      return [];
    }
  };

  const parsedStdout = parseJsonField(submission?.stdout);
  const parsedTime = parseJsonField(submission?.time);
  const parsedMemory = parseJsonField(submission?.memory);

  const testCaseResults = testcases.map((tc, index) => {
    const userOutput = parsedStdout?.[index] ?? null;
    const time = parsedTime?.[index] ? parseFloat(parsedTime[index]) : null;
    const memory = parsedMemory?.[index]
      ? parseFloat(parsedMemory[index])
      : null;
    const passed =
      userOutput !== null && userOutput.trim() === tc.output.trim();
    return { ...tc, userOutput, passed, time, memory };
  });

  const passedTests = testCaseResults.filter((tc) => tc.passed).length;
  const totalTests = testCaseResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  const overallStatus =
    totalTests > 0 && passedTests === totalTests ? "Accepted" : "Failed";

  const avgTime = parsedTime.length
    ? parsedTime.map((t) => parseFloat(t)).reduce((a, b) => a + b, 0) /
      parsedTime.length
    : 0;
  const avgMemory = parsedMemory.length
    ? parsedMemory.map((m) => parseFloat(m)).reduce((a, b) => a + b, 0) /
      parsedMemory.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 max-w-7xl w-full mx-auto">
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 flex items-start gap-2">
          <Link to="/" className="flex items-center gap-2 text-primary mt-2">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/70 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated{" "}
                {new Date(problem.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {submissionCount} Submissions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                95% Success Rate
              </span>
            </div>
          </div>
        </div>
        <div className="flex-none flex items-center gap-4">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
            aria-label="Bookmark"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-circle" aria-label="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <select
            className="select select-bordered select-primary w-40"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered px-2">
                {[
                  { id: "description", label: "Description", icon: FileText },
                  { id: "submissions", label: "Submissions", icon: Code2 },
                  {
                    id: "discussion",
                    label: "Discussion",
                    icon: MessageSquare,
                  },
                  { id: "hints", label: "Hints", icon: Lightbulb },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    className={`tab tab-lifted gap-2 ${
                      activeTab === id ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab(id)}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {renderTabContent()}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered px-2">
                <button className="tab tab-lifted tab-active gap-2">
                  <Terminal className="w-4 h-4" />
                  Code Editor
                </button>
              </div>
              <div className="h-[600px] w-full">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>
              <div className="p-4 border-t border-base-300 bg-base-200">
                <div className="flex justify-center">
                  <button
                    className={`btn btn-primary gap-2 ${
                      isExecuting ? "loading" : ""
                    }`}
                    onClick={handleRunCode}
                    disabled={isExecuting}
                  >
                    {!isExecuting && <Play className="w-4 h-4" />}
                    Run Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Execution Results</h3>
              {isExecuting && (
                <span className="text-sm text-primary flex items-center gap-1">
                  <span className="loading loading-spinner loading-xs"></span>
                  Running...
                </span>
              )}
            </div>

            {error ? (
              <div className="alert alert-error shadow-lg mb-4">
                <span>⚠️ {error}</span>
              </div>
            ) : submission ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                      <h3 className="card-title text-sm">Status</h3>
                      <div
                        className={`text-lg font-bold ${
                          overallStatus === "Accepted"
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        {overallStatus}
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                      <h3 className="card-title text-sm">Success Rate</h3>
                      <div className="text-lg font-bold">
                        {successRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                      <h3 className="card-title text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Avg. Runtime
                      </h3>
                      <div className="text-lg font-bold">
                        {avgTime > 0 ? `${avgTime.toFixed(3)} s` : "-"}
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200 shadow-lg">
                    <div className="card-body p-4">
                      <h3 className="card-title text-sm flex items-center gap-2">
                        <Memory className="w-4 h-4" />
                        Avg. Memory
                      </h3>
                      <div className="text-lg font-bold">
                        {avgMemory > 0 ? `${Math.round(avgMemory)} KB` : "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Input</th>
                        <th>Expected</th>
                        <th>Your Output</th>
                        <th>Time</th>
                        <th>Memory</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testCaseResults.length > 0 ? (
                        testCaseResults.map((tc, index) => (
                          <tr key={index}>
                            <td>
                              {tc.passed ? (
                                <div className="flex items-center gap-2 text-success">
                                  <CheckCircle2 className="w-5 h-5" />
                                  Passed
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-error">
                                  <XCircle className="w-5 h-5" />
                                  Failed
                                </div>
                              )}
                            </td>
                            <td className="font-mono text-sm max-w-xs break-words">
                              {tc.input}
                            </td>
                            <td className="font-mono text-sm max-w-xs break-words">
                              {tc.output}
                            </td>
                            <td className="font-mono text-sm max-w-xs break-words">
                              {tc.userOutput !== null ? tc.userOutput : "-"}
                            </td>
                            <td className="text-sm">
                              {tc.time !== null
                                ? `${tc.time.toFixed(3)} s`
                                : "-"}
                            </td>
                            <td className="text-sm">
                              {tc.memory !== null
                                ? `${Math.round(tc.memory)} KB`
                                : "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            No test cases available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-base-content/70">
                Click "Run Code" to see execution results.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
