"use client";

import { useState } from "react";
import { generateLecturerEmail } from "../lib/formatter";

export default function Home() {
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-24 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">

        <h1 className="text-3xl font-bold text-center text-gray-800">
          Lecturer Email Generator
        </h1>

        <p className="text-center text-gray-500">
          Click a button → copy → send. No thinking needed.
        </p>

        <button
          onClick={() =>
            setResult(generateLecturerEmail("extension", "polite", "", ""))
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-medium transition"
        >
          I need an extension for my assignment
        </button>

        <button
          onClick={() =>
            setResult(generateLecturerEmail("absence", "polite", "", ""))
          }
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-lg font-medium transition"
        >
          I will be absent from class
        </button>

        {result && (
          <div className="space-y-3 pt-4">
            <pre className="whitespace-pre-wrap border p-4 rounded-lg bg-gray-50 text-gray-800 text-sm">
              {result}
            </pre>

            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Copy Email
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
