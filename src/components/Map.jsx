import EndScreen from "./EndScreen";
import React, { useState, useEffect } from "react";

const Map = ({
  path,
  completedChapters,
  onChapterComplete,
  onChapterSelect,
}) => {
  const structuredMode = path === "structured";
  const lastCompleted = Math.max(0, ...completedChapters);
  const allCompleted = completedChapters.length === 5;
  const [showEndScreen, setShowEndScreen] = useState(false);

  // Structured Mode Logic
  const isChapterAvailableStructured = (chapter) => {
    if (allCompleted) return true;
    return chapter === lastCompleted + 1 || completedChapters.includes(chapter);
  };

  const isGlowingStructured = (chapter) => {
    if (allCompleted) return false;
    return chapter === lastCompleted + 1;
  };

  const isDisabledStructured = (chapter) => {
    return (
      !isChapterAvailableStructured(chapter) &&
      !completedChapters.includes(chapter)
    );
  };

  // Refresh Mode Logic
  const isChapterAvailableRefresh = () => true; // Always available

  const isGlowingRefresh = (chapter) => !completedChapters.includes(chapter);

  // Choose logic based on mode
  const isChapterAvailable = structuredMode
    ? isChapterAvailableStructured
    : isChapterAvailableRefresh;
  const isGlowing = structuredMode ? isGlowingStructured : isGlowingRefresh;
  const isDisabled = structuredMode ? isDisabledStructured : () => false; // Only needed in structured mode

  const handleChapterClick = (chapter) => {
    if (isChapterAvailable(chapter)) {
      onChapterComplete(chapter);
      onChapterSelect(chapter);
    }
  };

  useEffect(() => {
    if (showEndScreen) {
      document.body.classList.add("mount-background");
      document.body.classList.remove("sea-background");
    }
  }, [showEndScreen]);

  return (
    <div className="map">
    <div className="islands">
      {showEndScreen && <EndScreen />}
      
      {!showEndScreen && completedChapters.length === 5 && (
        <button
          className="button end-btn"
          onClick={() => setShowEndScreen(true)}
        >
          סיום הלומדה
        </button>
      )}

      {/* Render islands only when the end screen is not displayed */}
      {!showEndScreen
        ? [1, 2, 3, 4, 5].map((chapter) => (
            <button
              key={chapter}
              className={`island-container-btn island${chapter} ${
                isGlowing(chapter) ? "glowing" : ""
              } ${isDisabled(chapter) ? "disabled" : ""}`}
              onClick={() => handleChapterClick(chapter)}
              disabled={!isChapterAvailable(chapter)}
            >
              <img
                className={`island-img ${isGlowing(chapter) ? "glowing" : ""}`}
                src={`src/assets/graphics/islands/island${chapter}.svg`}
                alt={`island${chapter}`}
              />
            </button>
          ))
        : ""}
    </div>
  </div>
  );
};


export default Map;
