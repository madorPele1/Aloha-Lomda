import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import Character from "./Character";

const ExplanationScreen = ({
  chapter,
  title,
  id,
  text,
  image,
  buttons,
  onSubjectSelect,
  onContinue,
  isLoading,
  setIsLoading,
  onBack,
  onBackToMap,
  graph,
  subject,
  interactiveAreas,
  screenIndex,
  clickableAreas,
  bulletPoints,
  question,
  video,
  selectedChapter,
  paddingRight,
}) => {
  const audioSrc = `${
    import.meta.env.BASE_URL
  }assets/audio/chapters/chapter${selectedChapter}/${screenIndex + 1}.wav`;
  const [play, { stop, sound }] = useSound(audioSrc);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(!question);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (sound) {
      play();
      setIsAudioPlaying(true);
      sound.on("end", () => setIsAudioPlaying(false));
    }

    return () => {
      if (sound) {
        sound.off("end");
        stop();
      }
    };
  }, [sound]);

  useEffect(() => {
    setIsQuestionAnswered(!question);
  }, [question]);

  const handleSkipAudio = () => {
    if (
      isDeveloperMode ||
      prompt("הזינו סיסמא על מנת להפעיל מצב מפתחים") === "1"
    ) {
      stop();
      setIsAudioPlaying(false);
      setIsDeveloperMode(true);
      setIsLoading(false);
      if (!isDeveloperMode) alert("כניסה בוצעה בהצלחה");
    } else {
      alert("סיסמא שגויה");
    }
  };

  const handleSubjectSelect = (topic) => {
    if (!completedTopics.includes(topic)) {
      setCompletedTopics([...completedTopics, topic]);
    }
    onSubjectSelect(topic);
  };

  const allTopicsCompleted =
    buttons && completedTopics.length === buttons.length;
  const isContinueDisabled = (!isQuestionAnswered && question) || isLoading;

  return (
    <div className="explanation-screen">
      <div className="navbar">
        <div className="fixed-navbar">
          <button
            className="hamburger-menu-btn"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <img
              style={{ width: "30px" }}
              src={`${
                import.meta.env.BASE_URL
              }assets/graphics/icons/hamburger-menu.svg`}
              alt="hamburger-menu"
            />
          </button>
          <img
            src={`${import.meta.env.BASE_URL}assets/fonts/chapter${id}.svg`}
            alt="chapter-title"
            style={{ width: "78vw" }}
          />
        </div>

        <div className={`opened-navbar ${isMenuOpen ? "visible" : ""}`}>
          <button
            className="sound-btn"
            disabled={isAudioPlaying}
            onClick={() => {
              stop();
              play();
            }}
          >
            <img
              src={`${
                import.meta.env.BASE_URL
              }assets/graphics/icons/sound-icon.svg`}
              alt="sound-icon"
            />
            {isAudioPlaying ? "Playing..." : "השמעה חוזרת"}
          </button>

          <button className="back-to-map-btn" onClick={onBackToMap}>
            <img
              src={`${
                import.meta.env.BASE_URL
              }assets/graphics/icons/back-to-map-icon.svg`}
              alt="back-to-map"
            />
            חזרה למפה
          </button>
          <button className="skip-btn" onClick={handleSkipAudio}>
            <img
              src={`${
                import.meta.env.BASE_URL
              }assets/graphics/icons/skip-icon.svg`}
              alt="skip-icon"
            />
            מצב מפתחים
          </button>
        </div>
      </div>

      {buttons && buttons.length > 0 ? (
        <div className="button-screen">
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="subject-buttons">
            {buttons.map((button, index) => (
              <button
                key={index}
                className="subject-button"
                style={{
                  fontWeight: "800",
                  boxShadow: `6px 6px ${button.backgroundColor}`,
                  opacity: completedTopics.includes(button.firstScreen)
                    ? 0.5
                    : 1,
                }}
                onClick={() => handleSubjectSelect(button.firstScreen)}
              >
                {button.label}
                <p style={{ fontWeight: "400" }}>{button.subLabel}</p>
                <img
                  src={`${import.meta.env.BASE_URL}${button.subject}`}
                  alt={`${button.label}-img`}
                />
              </button>
            ))}
          </div>
          {allTopicsCompleted && (
            <button className="continue-btn button" onClick={onBackToMap}>
              המשך
            </button>
          )}
        </div>
      ) : (
        <div className="default-screen">
          <Character
            text={text}
            title={title}
            image={image}
            paddingRight={paddingRight}
            video={video}
            subject={subject}
            buttons={buttons}
            onSubjectSelect={onSubjectSelect}
            interactiveAreas={interactiveAreas}
            clickableAreas={clickableAreas}
            isAudioPlaying={isAudioPlaying}
            onContinue={onContinue}
            graph={graph}
            bulletPoints={bulletPoints}
            question={question}
            selectedChapter={selectedChapter}
            onAnswered={() => setIsQuestionAnswered(true)}
          />
          <button
            className="continue-btn button"
            onClick={onContinue}
            disabled={isContinueDisabled}
            style={{
              display: subject?.endSubject ? "none" : "",
              opacity: isContinueDisabled ? 0.5 : 1,
            }}
          >
            המשך
          </button>
          {screenIndex > 1 && (
            <button className="back-btn button" onClick={onBack}>
              חזור
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplanationScreen;
