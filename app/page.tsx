"use client";

import { useState } from "react";
import { generateLecturerEmail } from "../lib/formatter";

export default function Home() {
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center space-y-6">

        <h1 className="text-2xl font-semibold text-gray-800">
         Stuck because you don’t know how to email your lecturer?
        </h1>

        <button
          onClick={() =>
            setResult(generateLecturerEmail("extension", "polite", "", ""))
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-medium transition"
        >
          Help me ask for extension
        </button>

        <button
          onClick={() =>
            setResult(generateLecturerEmail("absence", "polite", "", ""))
          }
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg text-lg font-medium transition"
        >
         Help me explain my absence
        </button>

      </div>

      {result && (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md mt-6 space-y-3">
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {result}
          </pre>

          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Copy Email
          </button>
        </div>
      )}

    </div>
  );
}
