import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  example: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

const sampleProblemData = {
  title: "Reverse Integer",
  description:
    "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], return 0.",
  difficulty: "EASY",
  tags: ["Math"],
  constraints: "-2^31 <= x <= 2^31 - 1",
  hints:
    "Pop the last digit using mod 10, and build the result. Check overflow before updating.",
  testcases: [
    { input: "123", output: "321" },
    { input: "-123", output: "-321" },
    { input: "120", output: "21" },
    { input: "1534236469", output: "0" },
  ],
  example: {
    JAVASCRIPT: {
      input: "x = 123",
      output: "321",
      explanation: "Reverse the digits.",
    },
    PYTHON: {
      input: "x = -123",
      output: "-321",
      explanation: "Keep the sign.",
    },
    JAVA: {
      input: "x = 120",
      output: "21",
      explanation: "Leading zeros are dropped.",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
 * @param {number} x
 * @return {number}
 */
function reverse(x) {
  // your code here
}`,
    PYTHON: `class Solution:
    def reverse(self, x: int) -> int:
        # your code here
        pass`,
    JAVA: `class Solution {
    public int reverse(int x) {
        // your code here
        return 0;
    }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `function reverse(x) {
  const INT_MAX = 2147483647;
  const INT_MIN = -2147483648;
  let rev = 0;
  while (x !== 0) {
    const pop = x % 10;
    x = x > 0 ? Math.floor(x / 10) : Math.ceil(x / 10);
    if (rev > INT_MAX / 10 || (rev === INT_MAX / 10 && pop > 7)) return 0;
    if (rev < INT_MIN / 10 || (rev === INT_MIN / 10 && pop < -8)) return 0;
    rev = rev * 10 + pop;
  }
  return rev;
}

const input = require('fs').readFileSync(0, 'utf8').trim();
const x = parseInt(input);
process.stdout.write(String(reverse(x)));`,

    PYTHON: `import sys

def reverse(x):
    INT_MAX = 2147483647
    INT_MIN = -2147483648
    rev = 0
    sign = -1 if x < 0 else 1
    x = abs(x)
    while x != 0:
        pop = x % 10
        x //= 10
        rev = rev * 10 + pop
        if rev > INT_MAX:
            return 0
    return sign * rev if sign * rev >= INT_MIN else 0

data = sys.stdin.read().strip()
x = int(data)
result = reverse(x)
sys.stdout.write(str(result))`,

    JAVA: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int x = sc.nextInt();
    int rev = 0;
    while (x != 0) {
      int pop = x % 10;
      x /= 10;
      if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && pop > 7)) {
        System.out.print(0);
        sc.close();
        return;
      }
      if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && pop < -8)) {
        System.out.print(0);
        sc.close();
        return;
      }
      rev = rev * 10 + pop;
    }
    System.out.print(rev);
    sc.close();
  }
}`,
  },
};

const CreateProblemForm = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testcases: [{ input: "", output: "" }],
      tags: [""],
      example: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({ control, name: "testcases" });
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "tags" });
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load sample function
  const handleLoadSample = () => {
    reset(sampleProblemData);
  };

  const onSubmit = async (value) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/problems/create-problem", value);
      toast.success(res.data.message || "Problem created successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create problem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="card bg-base-100 shadow-xl rounded-xl mb-8">
          <div className="card-body p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <FileText className="w-7 h-7 text-primary" />
                Create New Problem
              </h2>
              <button
                type="button"
                className="btn btn-secondary btn-sm md:btn-md gap-2"
                onClick={handleLoadSample}
              >
                <Download className="w-4 h-4" />
                Load Sample Problem
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="card bg-base-100 shadow-xl rounded-xl">
            <div className="card-body p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Title</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full px-4 py-2.5 text-base"
                    {...register("title")}
                    placeholder="Enter problem title"
                  />
                  {errors.title && (
                    <p className="text-error text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full p-4 min-h-[120px]"
                    {...register("description")}
                    placeholder="Describe the problem"
                  />
                  {errors.description && (
                    <p className="text-error text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Difficulty</span>
                  </label>
                  <select
                    className="select select-bordered w-full px-4 py-2.5"
                    {...register("difficulty")}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <p className="text-error text-sm mt-1">
                      {errors.difficulty.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl rounded-xl">
            <div className="card-body p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Tags
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendTag("")}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      {...register(`tags.${index}`)}
                      placeholder="e.g., array"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-square"
                      onClick={() => removeTag(index)}
                      disabled={tagFields.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.tags?.message && (
                <p className="text-error text-sm mt-2">{errors.tags.message}</p>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl rounded-xl">
            <div className="card-body p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Test Cases
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendTestCase({ input: "", output: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Test Case
                </button>
              </div>
              <div className="space-y-5">
                {testCaseFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-200 rounded-lg">
                    <div className="card-body p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">
                          Test Case #{index + 1}
                        </h4>
                        {testCaseFields.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() => removeTestCase(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Input
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered w-full p-3 min-h-[100px] font-mono text-sm"
                            {...register(`testcases.${index}.input`)}
                            placeholder="e.g., 3 3\n1 2 3"
                          />
                          {errors.testcases?.[index]?.input && (
                            <p className="text-error text-sm mt-1">
                              {errors.testcases[index].input.message}
                            </p>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Expected Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered w-full p-3 min-h-[100px] font-mono text-sm"
                            {...register(`testcases.${index}.output`)}
                            placeholder="e.g., 2"
                          />
                          {errors.testcases?.[index]?.output && (
                            <p className="text-error text-sm mt-1">
                              {errors.testcases[index].output.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {["JAVASCRIPT", "PYTHON", "JAVA"].map((lang) => (
            <div key={lang} className="card bg-base-100 shadow-xl rounded-xl">
              <div className="card-body p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  {lang}
                </h3>

                <div className="mb-7">
                  <h4 className="font-semibold mb-3">Starter Code Template</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Controller
                      name={`codeSnippets.${lang}`}
                      control={control}
                      render={({ field }) => (
                        <Editor
                          height="320px"
                          language={
                            lang.toLowerCase() === "javascript"
                              ? "javascript"
                              : lang.toLowerCase()
                          }
                          theme="vs-dark"
                          value={field.value}
                          onChange={field.onChange}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            automaticLayout: true,
                            tabSize: 2,
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.codeSnippets?.[lang]?.message && (
                    <p className="text-error text-sm mt-2">
                      {errors.codeSnippets[lang].message}
                    </p>
                  )}
                </div>

                <div className="mb-7">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Reference Solution
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Controller
                      name={`referenceSolutions.${lang}`}
                      control={control}
                      render={({ field }) => (
                        <Editor
                          height="320px"
                          language={
                            lang.toLowerCase() === "javascript"
                              ? "javascript"
                              : lang.toLowerCase()
                          }
                          theme="vs-dark"
                          value={field.value}
                          onChange={field.onChange}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            automaticLayout: true,
                            tabSize: 2,
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.referenceSolutions?.[lang]?.message && (
                    <p className="text-error text-sm mt-2">
                      {errors.referenceSolutions[lang].message}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Example</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Input</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full p-3 font-mono text-sm"
                        {...register(`example.${lang}.input`)}
                        placeholder="Input"
                      />
                      {errors.example?.[lang]?.input && (
                        <p className="text-error text-sm mt-1">
                          {errors.example[lang].input.message}
                        </p>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Output</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full p-3 font-mono text-sm"
                        {...register(`example.${lang}.output`)}
                        placeholder="Output"
                      />
                      {errors.example?.[lang]?.output && (
                        <p className="text-error text-sm mt-1">
                          {errors.example[lang].output.message}
                        </p>
                      )}
                    </div>
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">
                          Explanation
                        </span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full p-3 min-h-[100px]"
                        {...register(`example.${lang}.explanation`)}
                        placeholder="Explanation"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="card bg-base-100 shadow-xl rounded-xl">
            <div className="card-body p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" />
                Additional Information
              </h3>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Constraints</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full p-4 min-h-[100px] font-mono"
                    {...register("constraints")}
                    placeholder="e.g., 1 ≤ n ≤ 10⁵"
                  />
                  {errors.constraints && (
                    <p className="text-error text-sm mt-1">
                      {errors.constraints.message}
                    </p>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Hints</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full p-4 min-h-[100px]"
                    {...register("hints")}
                    placeholder="Guidance for solvers"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl rounded-xl">
            <div className="card-body p-6 md:p-8">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-8 gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Create Problem
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProblemForm;
