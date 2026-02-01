"use client";

import { useState } from "react";
import { generateLecturerEmail } from "../lib/formatter";

export default function Home() {
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-24 px-6">

      <div className="w-full max-w-md text-center space-y-10">

       <h1 className="text-4xl font-semibold text-black">


  Write an email to your lecturer in 10 seconds.
</h1>

<p className="text-gray-700">


  No prompts. No thinking. Just click.
</p>

        <div className="space-y-6">

       <button
  onClick={() => setResult(generateLecturerEmail("extension", "polite", "", ""))}
  className="w-full bg-black text-white py-5 rounded-xl text-lg font-medium hover:scale-[1.02] active:scale-[0.98] transition"

>
  I need an extension
</button>

<button
  onClick={() => setResult(generateLecturerEmail("absence", "polite", "", ""))}
  className="w-full border border-black py-5 rounded-xl text-lg font-medium text-black hover:bg-gray-100 transition"

>
  I will be absent
</button>


        </div>
      </div>

      {result && (
        <div className="bg-white shadow-x1 rounded-2xl p-8 w-full max-w-md mt-14 space-y-6">
         <p className="text-sm text-gray-600">Generated email</p>

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
