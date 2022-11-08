import React from "react";

interface ProgressBarProps {
  type: "questions" | "result";
  questions: number;
  questionNumber: number;
  correctAnswers: number;
}

export function ProgressBar({
  type,
  questions,
  questionNumber,
  correctAnswers,
}: ProgressBarProps) {
  if (type === "questions")
    return (
      <progress
        className="progress progress-primary w-full bg-white"
        value={
          questionNumber > 0 ? ((questionNumber + 1) / questions) * 100 : 0
        }
        max="100"
      ></progress>
    );
  else {
    return (
      <progress
        className="progress progress-success bg-error"
        value={(correctAnswers / questions) * 100}
        max="100"
      ></progress>
    );
  }
}
