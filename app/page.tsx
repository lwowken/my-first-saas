"use client";

import { useState } from "react";
import { generateLecturerEmail } from "../lib/formatter";

export default function Home() {
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center gap-8 pt-24 px-4">

      <h1 className="text-3xl font-semibold text-center">
        Generate lecturer email in one click
      </h1>

      <p className="text-gray-500 text-center max-w-md">
        No typing. No thinking. Just copy and send.
      </p>

      <div className="w-full max-w-md space-y-4">

        <button
          onClick={() =>
            setResult(generateLecturerEmail("extension", "polite", "", ""))
          }
          className="w-full bg-black text-white py-4 rounded text-lg"
        >
          I need an extension for my assignment
        </button>

        <button
          onClick={() =>
            setResult(generateLecturerEmail("absence", "polite", "", ""))
          }
          className="w-full bg-gray-800 text-white py-4 rounded text-lg"
        >
          I will be absent from class
        </button>

      </div>

      {result && (
        <div className="w-full max-w-md space-y-3">
          <pre className="whitespace-pre-wrap border p-4 rounded bg-white text-black">
            {result}
          </pre>

          <button
            className="w-full border py-3 rounded"
            onClick={() => navigator.clipboard.writeText(result)}
          >
            Copy Email
          </button>
        </div>
      )}

    </div>
  );
}

