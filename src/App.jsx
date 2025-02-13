import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import ExplanationScreen from "./components/ExplanationScreen";
import PathSelection from "./components/PathSelection";
import Map from "./components/Map";
import Credits from "./components/Credits";
import chaptersData from "./components/chapters.json";
import "./App.css";

const FlyingBirds = () => (
  <>
    <motion.img
      src={`${import.meta.env.BASE_URL}assets/graphics/bird.svg`}
      alt="Flying Bird"
      className="flying-bird"
      style={{ position: "absolute", top: "25%", width: "80px" }}
      animate={{
        x: ["-20vw", "120vw", "-20vw"],
        scaleX: [1, 1, 1, -1, -1, -1],
      }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
    />
    <motion.img
      src={`${import.meta.env.BASE_URL}assets/graphics/bird.svg`}
      alt="Flying Bird 2"
      className="flying-bird"
      style={{ position: "absolute", top: "75%", width: "60px" }}
      animate={{
        x: ["120vw", "-20vw", "120vw"],
        scaleX: [-1, -1, -1, 1, 1, 1],
      }}
      transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
    />
  </>
);

const getBackgroundClass = (currentScreen, selectedChapter) => {
  if (["map", "path-selection"].includes(currentScreen))
    return "sea-background";
  return selectedChapter === 0 || selectedChapter === null
    ? "mount-background"
    : "palm-background";
};

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("opening");
  const [pathMode, setPathMode] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [screenIndex, setScreenIndex] = useState(0);
  const [showCredits, setShowCredits] = useState(false);
  const [completedChapters, setCompletedChapters] = useState([]);

  useEffect(() => {
    document.body.className = getBackgroundClass(
      currentScreen,
      selectedChapter
    );
  }, [currentScreen, selectedChapter]);

  const handleNextScreen = () => {
    if (selectedChapter === null) return;
    const currentChapter = chaptersData.chapters[selectedChapter];

    if (screenIndex < currentChapter.screens.length - 1) {
      setScreenIndex((prev) => prev + 1);
    } else {
      setCurrentScreen("map");
      setSelectedChapter(null);
      setScreenIndex(0);
    }
  };

  const handleBackScreen = () => {
    if (screenIndex > 0) setScreenIndex((prev) => prev - 1);
  };

  const handleChapterSelect = (chapterId) => {
    setSelectedChapter(chapterId);
    setCurrentScreen("chapter");
    setScreenIndex(0);
  };

  const handleChapterComplete = (chapterId) => {
    setCompletedChapters((prev) =>
      prev.includes(chapterId) ? prev : [...prev, chapterId]
    );
  };

  const screens = {
    opening: (
      <div className="app">
        <h1 className="main-title">
          לומדת <br /> <span style={{ color: "#FA5B60" }}>הערכת סיכונים</span>
        </h1>
        <button onClick={() => handleChapterSelect(0)} className="button">
          התחל
        </button>
        <button
          className="credit-boat-btn"
          onClick={() => setShowCredits(true)}
        >
          <img
            src={`${
              import.meta.env.BASE_URL
            }assets/graphics/front-view-boat.svg`}
            className="credit-boat-img"
            alt="credit-boat"
          />
        </button>
        <FlyingBirds />
      </div>
    ),
    "path-selection": (
      <PathSelection
        onSelectPath={(mode) => {
          setPathMode(mode);
          setCurrentScreen("map");
        }}
      />
    ),
    map: (
      <Map
        path={pathMode}
        completedChapters={completedChapters}
        onChapterComplete={handleChapterComplete}
        onChapterSelect={handleChapterSelect}
      />
    ),
    chapter: selectedChapter !== null && (
      <ExplanationScreen
        {...chaptersData.chapters[selectedChapter].screens[screenIndex]}
        chapter={chaptersData.chapters[selectedChapter].title}
        screenIndex={screenIndex}
        selectedChapter={selectedChapter}
        onSubjectSelect={setScreenIndex}
        onContinue={handleNextScreen}
        onBack={handleBackScreen}
        onBackToMap={() => {
          setCurrentScreen("map");
          setScreenIndex(0);
        }}
      />
    ),
  };

  return (
    <div className="app">
      {screens[currentScreen]}
      {showCredits && <Credits onClose={() => setShowCredits(false)} />}
      {selectedChapter !== null &&
        selectedChapter > 1 &&
        currentScreen === "chapter" && (
          <img
            src={`${
              import.meta.env.BASE_URL
            }assets/graphics/flags/flag${selectedChapter}.svg`}
            className="flag"
            alt={`Flag ${selectedChapter}`}
          />
        )}
    </div>
  );
};

export default App;
