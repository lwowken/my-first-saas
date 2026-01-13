"use client";

import ItemList from "./ItemList";
import { useState } from "react";
import { formatText } from "../lib/formatter";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  function handleGenerate() {
    const output = formatText(input);
    setResult(output);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold text-center">
   Turn casual messages into polite writing
</h1>
<p className="text-gray-500 text-center max-w-md">
  Perfect for students who want their messages to sound more respectful.

</p>



      <div className="w-full max-w-md space-y-4">
        <textarea
          className="w-full border p-3 rounded"
          rows={4}
          placeholder="Enter your text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-black text-white py-2 rounded"
        >
          Improve my text
        </button>

        {result && (
  <div className="space-y-2">
    <pre className="whitespace-pre-wrap border p-3 rounded bg-white text-black dark:bg-zinc-900 dark:text-white">

      {result}
    </pre>

    <button
      className="w-full border py-2 rounded"
      onClick={() => navigator.clipboard.writeText(result)}
    >
      Copy Result
    </button>
  </div>
)}
      </div>



<div className="border rounded p-4 text-center space-y-2">
  <h2 className="text-xl font-semibold">
    Pricing
  </h2>

  <p className="text-gray-600">
    Unlimited text improvements for
  </p>

  <p className="text-3xl font-bold">
    RM 19 / month
  </p>

  <button className="w-full bg-black text-white py-2 rounded">
    Start Free Trial
  </button>
</div>





    </div>
  );
}
