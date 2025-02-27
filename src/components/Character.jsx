import React, { useState, useRef } from "react";
import GraphScreen from "./GraphScreen";
import InteractiveAreas from "./InteractiveAreas";
import Question from "./Question";

const Character = ({
  text,
  title,
  image,
  onSubjectSelect,
  subject,
  endSubject,
  interactiveAreas,
  graph,
  bulletPoints,
  question,
  onAnswered,
  video,
  selectedChapter,
  clickableAreas,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const textStyle = image ? { paddingRight: "10vh" } : {};

  return (
    <div className="character">
      <div
        className="explanation-div"
        style={{
          top: graph ? "2vh" : "",
          height: graph ? "80vh" : "",
          display: !graph ? "flex" : "",
        }}
      >
        {clickableAreas && (
          <img
            src={`${
              import.meta.env.BASE_URL
            }assets/graphics/icons/computer-icon.svg`}
            className="computer-icon"
            alt="computer-icon"
          />
        )}

        <h2 className="explanation-title">{title}</h2>

        {image && (
          <div
            onClick={() => video && setIsVideoOpen(true)}
            className={video ? "clickable-image" : ""}
          >
            <InteractiveAreas
              image={image}
              interactiveAreas={interactiveAreas}
              clickableAreas={clickableAreas}
            />
          </div>
        )}
        {!image && graph && <GraphScreen graph={graph} />}

        <p className="character-text" style={textStyle}>
          {text
            .split(/(\[b\].*?\[\/b\])/g) // Split by bold markers
            .map((part, index) => {
              const trimmedPart = part.trim();

              if (
                trimmedPart.startsWith("[b]") &&
                trimmedPart.endsWith("[/b]")
              ) {
                // Handle bold text while preserving line breaks
                return (
                  <b key={index}>
                    {trimmedPart
                      .slice(3, -4) // Remove [b] and [/b]
                      .split("\n")
                      .map((line, i) => (
                        <React.Fragment key={`${index}-${i}`}>
                          {i > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                  </b>
                );
              }

              // Handle normal text with line breaks
              return part.split("\n").map((line, i) => (
                <React.Fragment key={`${index}-${i}`}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ));
            })}
        </p>

        {bulletPoints && (
          <ul className="bullet-points">
            {bulletPoints.map((bulletPoint, index) => (
              <li
                key={index}
                className="bullet-point"
                style={{
                  fontSize: "0.9rem",
                  marginRight: `${(index + 1) * 3}%`,
                }} // Increasing margin
              >
                {bulletPoint}
              </li>
            ))}
          </ul>
        )}

        {question && <Question question={question} onAnswered={onAnswered} />}
        <button
          className="back-to-subjects-btn"
          onClick={() => onSubjectSelect(1)}
          style={{ display: subject?.endSubject === "true" ? "flex" : "none" }}
        >
          <img
            src={`${import.meta.env.BASE_URL}${subject?.subject}`}
            alt="subject-img-btn"
            style={{ width: "13vh" }}
          />
          חזרה לבחירת נושא
        </button>
      </div>

      {!graph && (
        <img
          className="character-img"
          src={`${import.meta.env.BASE_URL}assets/graphics/soldiers/${
            image ? "explain" : question ? "question" : "standing"
          }-${
            selectedChapter && selectedChapter % 2 !== 0 ? "man" : "woman"
          }-soldier.svg`}
          style={{maxWidth: "32vw"}}
          alt="Character"
        />
      )}

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="video-modal">
          <button className="close-btn" onClick={() => setIsVideoOpen(false)}>
            ✖
          </button>
          <video src={video} controls autoPlay />
        </div>
      )}
    </div>
  );
};

export default Character;
