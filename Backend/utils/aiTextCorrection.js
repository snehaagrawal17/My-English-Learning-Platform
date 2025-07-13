export default function analyzeText(text) {
  return {
    originalText: text,
    correctedText: "Corrected sample sentence.",
    grammarErrors: [
      { error: "Missing punctuation", suggestion: "Add a period at the end." }
    ],
    suggestions: ["Improve fluency", "Use connectors"],
    score: Math.floor(Math.random() * 30) + 70
  };
}
