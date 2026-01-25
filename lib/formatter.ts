// lib/formatter.ts

export function formatText(input: string, mode: string, level: string) {
  if (!input) return "";
  return input;
}

export function generateLecturerEmail(
  type: "extension" | "absence",
  tone: "normal" | "polite",
  course: string,
  date: string
) {
  let body = "";

  if (type === "extension") {
    body =
      `I hope you are well.\n\n` +
      `I am writing to ask if it would be possible to request a short extension for the assignment in ${course}, originally due on ${date}. ` +
      `Unfortunately, I was unable to complete it on time due to unforeseen circumstances.\n\n`;
  }

  if (type === "absence") {
    body =
      `I hope you are well.\n\n` +
      `I am writing to inform you that I was unable to attend class for ${course} on ${date} due to unforeseen circumstances.\n\n`;
  }

  if (tone === "polite") {
    body +=
      `I sincerely apologize for any inconvenience caused and would really appreciate your understanding.\n\n`;
  }

  return (
    `Dear Dr [Last Name],\n\n` +
    body +
    `Thank you very much for your time.\n\n` +
    `Best regards,\n` +
    `[Your Full Name]\n` +
    `[Student ID]`
  );
}
