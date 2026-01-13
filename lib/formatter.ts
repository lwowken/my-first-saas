import { workAsyncStorage } from "next/dist/server/app-render/entry-base";

export function formatText(input: string) {
  if (!input) return "";

  const clean = input.trim();

  const improved =
    "Dear Sir / Madam,\n\n" +
    clean.charAt(0).toUpperCase() +
    clean.slice(1) +
    ".\n\nThank you for your time.\n\nSincerely,";

  return `✨ Polite Version:\n\n${improved}\n\n— Created with ProText`;
}
