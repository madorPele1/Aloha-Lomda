import React, { useState, useEffect } from "react";

const Question = ({ question, onAnswered }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackStyle, setFeedbackStyle] = useState(""); // For conditional styling
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Reset state whenever the question changes
    setUserAnswer("");
    setFeedback("");
    setFeedbackStyle("");
    setAttempts(0);
  }, [question]);

  const handleCheckAnswer = () => {
    const isCorrect = question.answer.some(
      (acceptableAnswer) =>
        acceptableAnswer.trim().toLowerCase() ===
        userAnswer.trim().toLowerCase()
    );

    setUserAnswer(""); // Clear the input box
    setAttempts((prev) => prev + 1);

    if (isCorrect) {
      setFeedback("תשובה נכונה!");
      setFeedbackStyle("correct-feedback"); // Apply green styling
      onAnswered(); // Notify parent that the question is answered
    } else if (attempts + 1 >= 2) {
      setFeedback(
        `תשובתך אינה נכונה. התשובה הנכונה היא: ${question.answer[0]}`
      );
      setFeedbackStyle("incorrect-feedback"); // Apply red styling
      onAnswered(); // Notify parent that the question is answered after 2 attempts
    } else {
      setFeedback("תשובתך אינה נכונה. נסה שנית.");
      setFeedbackStyle("incorrect-feedback"); // Apply red styling
    }
  };

  return (
    <div className="question">
      <h2 style={{fontSize: "2.5rem", margin: "0"}}>שאלת ערנות</h2>
      <p className="question-text">{question.question}</p>
      <input
        type="text"
        className="answer-input"
        placeholder="הזינו את תשובתכם..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />
      <button className="check-answer-btn button" onClick={handleCheckAnswer}>
        בדוק תשובה
      </button>
      {feedback && <p className={`feedback ${feedbackStyle}`}>{feedback}</p>}
    </div>
  );
};

export default Question;
