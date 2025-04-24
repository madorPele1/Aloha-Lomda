import React, { useState, useEffect } from "react";

const Question = ({ question, onAnswered }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [inputs, setInputs] = useState(["", "", ""]);
  const [feedback, setFeedback] = useState("");
  const [feedbackStyle, setFeedbackStyle] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showAnswer, setShowAnswer] = useState(false); // show correct on second fail
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  useEffect(() => {
    setUserAnswer("");
    setInputs(["", "", ""]);
    setSelectedOption("");
    setFeedback("");
    setFeedbackStyle("");
    setAttempts(0);
    setShowAnswer(false);
  }, [question]);

  const handleCheckAnswer = () => {
    if (question.puddleQuestion) {
      const isCorrect = inputs.every(
        (val, index) => val.trim() === question.answer[index]
      );

      if (isCorrect) {
        setFeedback(
          <>
            תשובה נכונה!
            <br />A = 10
          </>
        );
        setFeedbackStyle("correct-feedback");
        setAnsweredCorrectly(true);
        onAnswered();
      } else if (attempts + 1 >= 2) {
        setFeedback(
          <>
            תשובתך אינה נכונה. <br />
            התשובות הנכונות הן: {question.answer.join(", ")}
          </>
        );
        setFeedbackStyle("incorrect-feedback");
        setShowAnswer(true);
        onAnswered();
      } else {
        setFeedback("תשובתך אינה נכונה. נסה שנית.");
        setFeedbackStyle("incorrect-feedback");
      }

      setAttempts((prev) => prev + 1);
    } else if (question.MultipleChoice) {
      const isCorrect = question.answer.includes(selectedOption);
      setAttempts((prev) => prev + 1);

      if (isCorrect) {
        setFeedback("תשובה נכונה!");
        setFeedbackStyle("correct-feedback");
        setShowAnswer(true); // Show correct highlight
        setAnsweredCorrectly(true);
        onAnswered();
      } else if (attempts + 1 >= 2) {
        setFeedbackStyle("incorrect-feedback");
        setShowAnswer(true);
        onAnswered();
      } else {
        setFeedback("תשובתך אינה נכונה. נסה שנית.");
        setFeedbackStyle("incorrect-feedback");
      }
    } else {
      setAnsweredCorrectly(true);
      const isCorrect = question.answer.some(
        (acceptableAnswer) =>
          acceptableAnswer.trim().toLowerCase() ===
          userAnswer.trim().toLowerCase()
      );

      setUserAnswer("");
      setAttempts((prev) => prev + 1);

      if (isCorrect) {
        setFeedback("תשובה נכונה!");
        setFeedbackStyle("correct-feedback");
        onAnswered();
      } else if (attempts + 1 >= 2) {
        setFeedback(
          <>
            תשובתך אינה נכונה. <br />
            התשובה הנכונה היא: {question.answer[0]}
          </>
        );
        setFeedbackStyle("incorrect-feedback");
        onAnswered();
      } else {
        setFeedback("תשובתך אינה נכונה. נסה שנית.");
        setFeedbackStyle("incorrect-feedback");
      }
    }
  };

  return (
    <div className="question">
      {!question.puddleQuestion && (
        <h2 style={{ fontSize: "2.5rem", margin: "-25px" }}>שאלת ערנות</h2>
      )}
      <p
        className="question-text"
        style={{
          margin: question.puddleQuestion ? "-30px 10px 10px 10px" : "",
        }}
      >
        {question.question}
      </p>

      {question.puddleQuestion ? (
        <div className="equation-inputs">
          <div className="equation-line">
            <span> kg </span>
            <input
              type="text"
              className="answer-input puddle-input"
              value={inputs[0]}
              onChange={(e) => {
                const newInputs = [...inputs];
                newInputs[0] = e.target.value;
                setInputs(newInputs);
              }}
            />
          </div>
          <div className="equation-divider">━━━━━━━━━━━ = A</div>
          <div className="equation-line">
            <span> kg/m³ × </span>
            <input
              type="text"
              className="answer-input puddle-input"
              value={inputs[2]}
              onChange={(e) => {
                const newInputs = [...inputs];
                newInputs[2] = e.target.value;
                setInputs(newInputs);
              }}
            />
            <span> m</span>
            <input
              type="text"
              className="answer-input puddle-input"
              value={inputs[1]}
              onChange={(e) => {
                const newInputs = [...inputs];
                newInputs[1] = e.target.value;
                setInputs(newInputs);
              }}
            />
          </div>
        </div>
      ) : question.MultipleChoice ? (
        <div className="multiple-choice">
          {question.options?.map((option, index) => {
            let optionClass = "mc-option";

            if (showAnswer) {
              if (
                option === selectedOption &&
                !question.answer.includes(option)
              ) {
                optionClass += " incorrect";
              }
              if (question.answer.includes(option)) {
                optionClass += " correct";
              }
            }

            return (
              <div
                key={index}
                className={optionClass}
                onClick={() => setSelectedOption(option)}
              >
                <span
                  className={`mc-circle ${
                    selectedOption === option ? "filled" : ""
                  }`}
                >
                  {selectedOption === option && (
                    <span className="mc-inner-dot" />
                  )}
                </span>
                <span>{option}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <input
          type="text"
          className="answer-input"
          placeholder="הזינו את תשובתכם..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
      )}

      {
        <button className="check-answer-btn button" onClick={handleCheckAnswer}>
          בדוק תשובה
        </button>
      }

      {feedback && <p className={`feedback ${feedbackStyle}`}>{feedback}</p>}
    </div>
  );
};

export default Question;
