export function formatText(input: string) {
  if (!input) return "";

  return `🔥 Professional Version:\n\n${input
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}`;
}
