export function formatText(input: string, mode: string, level: string)
 {
  if (!input) return "";

  const clean = input.trim().toLowerCase();

  let output = "";

  if (mode === "apology") {
    output =
      "I sincerely apologize for the inconvenience. " +
      "Thank you very much for your understanding and patience.";
  }

  if (mode === "request") {
    output =
      "I hope this message finds you well. " +
      "I would greatly appreciate your assistance regarding this matter.";
  }

  if (mode === "email") {
    output =
      "Dear Sir or Madam,\n\n" +
      "I am writing to inform you regarding the following matter. " +
      "I look forward to your kind response.\n\n" +
      "Best regards,";
  }

  if (level === "high") {
  output += " I truly appreciate your kind understanding and patience in this matter.";
}


  return `✨ Polite Version:\n\n${output}\n— Created with ProText`;
}
