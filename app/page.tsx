"use client";

import ItemList from "./ItemList";
import { useState } from "react";
import { formatText } from "../lib/formatter";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("request");
  const [level, setLevel] = useState("normal");

 

  function handleGenerate() {
    const output = formatText(input, mode, level);


    setResult(output);
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 pt-24">

      <h1 className="text-2xl font-semibold text-center">
  Write messages without sounding awkward
</h1>

<p className="text-gray-500 text-center max-w-md">
  Built for students and new professionals who want to sound confident and respectful.
</p>


      <div className="w-full max-w-md space-y-4">
        <textarea
          className="w-full border p-3 rounded"
          rows={4}
          placeholder="Enter your text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

<div className="flex gap-3 justify-center">
  <button
    onClick={() => setMode("request")}
    className={`border px-4 py-2 rounded ${mode === "request" ? "bg-white text-black" : ""}`}
  >
    Request
  </button>

  <button
    onClick={() => setMode("apology")}
    className={`border px-4 py-2 rounded ${mode === "apology" ? "bg-white text-black" : ""}`}
  >
    Apology
  </button>

  <button
    onClick={() => setMode("email")}
    className={`border px-4 py-2 rounded ${mode === "email" ? "bg-white text-black" : ""}`}
  >
    Formal
  </button>
</div>

<div className="flex gap-3 justify-center">
  <button
    onClick={() => setLevel("normal")}
    className={`border px-3 py-1 rounded ${level === "normal" ? "bg-white text-black" : ""}`}
  >
    Polite
  </button>

  <button
    onClick={() => setLevel("high")}
    className={`border px-3 py-1 rounded ${level === "high" ? "bg-white text-black" : ""}`}
  >
    Very Polite
  </button>
</div>


      

        <button
          onClick={handleGenerate}
          className="w-full bg-black text-white py-2 rounded"
        >
          Improve my message 
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

<p className="text-xs text-gray-500 text-center">
  Early access — currently free for feedback
</p>



    </div>
  );
}
