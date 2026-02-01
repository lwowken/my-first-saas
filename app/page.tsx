"use client";

import { useState } from "react";
import { generateLecturerEmail } from "../lib/formatter";

export default function Home() {
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">

      <div className="w-full max-w-md text-center space-y-10">

        <h1 className="text-4xl font-bold text-gray-800 leading-tight">
          Stuck because you don’t know how to email your lecturer?
        </h1>

        <div className="space-y-6">

          <button
            onClick={() =>
              setResult(generateLecturerEmail("extension", "polite", "", ""))
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl text-xl font-semibold transition shadow-lg"
          >
            Help me ask for extension
          </button>

          <button
            onClick={() =>
              setResult(generateLecturerEmail("absence", "polite", "", ""))
            }
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl text-xl font-semibold transition shadow-lg"
          >
            Help me explain my absence
          </button>

        </div>
      </div>

      {result && (
        <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md mt-12 space-y-4">
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
