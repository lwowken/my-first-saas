"use client";

import ItemList from "./ItemList";
import { useState } from "react";
import { generateLecturerEmail } from "../lib/formatter";

export default function Home() {

 const [emailType, setEmailType] = useState<"extension" | "absence">("extension");
const [tone, setTone] = useState<"normal" | "polite">("normal");
const [course, setCourse] = useState("");
const [date, setDate] = useState("");
const [result, setResult] = useState("");


  function handleGenerate() {
  const email = generateLecturerEmail(
    emailType,
    tone,
    course,
    date
  );
  setResult(email);
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
       
<div className="max-w-md w-full space-y-4">

  {/* Type */}
  <div>
    <p className="font-medium">Reason</p>
    <select
      value={emailType}
      onChange={(e) => setEmailType(e.target.value as any)}
      className="w-full border p-2 rounded"
    >
      <option value="extension">Request Extension</option>
      <option value="absence">Inform Absence</option>
    </select>
  </div>

  {/* Tone */}
  <div>
    <p className="font-medium">Tone</p>
    <select
      value={tone}
      onChange={(e) => setTone(e.target.value as any)}
      className="w-full border p-2 rounded"
    >
      <option value="normal">Normal</option>
      <option value="polite">Very Polite</option>
    </select>
  </div>

  {/* Course */}
  <div>
    <p className="font-medium">Course Name</p>
    <input
      value={course}
      onChange={(e) => setCourse(e.target.value)}
      className="w-full border p-2 rounded"
      placeholder="e.g. Computer Science 101"
    />
  </div>

  {/* Date */}
  <div>
    <p className="font-medium">Date</p>
    <input
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="w-full border p-2 rounded"
      placeholder="e.g. 12 March 2026"
    />
  </div>

  <button
    onClick={handleGenerate}
    className="w-full bg-black text-white py-2 rounded"
  >
    Generate Email
  </button>

  
</div>



      

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
