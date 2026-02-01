// lib/formatter.ts

export function formatText(input: string, mode: string, level: string) {
  if (!input) return "";
  return input;
}

export function generateLecturerEmail(
  type: "extension" | "absence",
  tone: "polite",
  course: string,
  date: string
) {
  if (type === "extension") {
    return `Dear Dr (lecturer name),

I hope you are well.

I am writing to request a short extension for my assignment because:

👉 (write your reason here in one sentence)

Sorry for the inconvenience. I hope you can understand.

Thank you for your time.

Best regards,  
(your full name)  
(student ID)`;
  }

  if (type === "absence") {
    return `Dear Dr (lecturer name),

I hope you are well.

I was unable to attend class because:

👉 (write your reason here in one sentence)

Sorry for the inconvenience. Thank you for your understanding.

Best regards,  
(your full name)  
(student ID)`;
  }

  return "";
}

