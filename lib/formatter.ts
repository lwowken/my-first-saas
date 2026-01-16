export function formatText(input: string, mode: string, level: string) {
  if (!input) return "";

  let output = "";

  if (mode === "apology") {
    output = "Sorry for being late. Thanks for understanding.";
  }

  if (mode === "request") {
    output = "Hi, could you help me with this when you have a moment?";
  }

  if (mode === "email") {
    output =
      "Hi,\n\n" +
      "I wanted to follow up on this.\n\n" +
      "Thanks,\n";
  }

  if (level === "high") {
    output = output.replace(
      "Thanks",
      "Thank you very much"
    );
  }

  return `✨ Polite Version:\n\n${output}`;
}
