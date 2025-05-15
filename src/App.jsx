import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import ExplanationScreen from "./components/ExplanationScreen";
import PathSelection from "./components/PathSelection";
import Map from "./components/Map";
import Credits from "./components/Credits";
import Spinner from "./components/Spinner";
import chaptersData from "./components/chapters.json";
import bird from "/assets/graphics/bird.svg"; // Import the bird image

import "./App.css";

const FlyingBirds = () => (
  <>
    <motion.img
      src={bird}
      alt="Flying Bird"
      className="flying-bird"
      style={{ position: "absolute", top: "15%", width: "80px", left: "0%" }}
      animate={{
        x: ["-20vw", "120vw", "-20vw"],
        scaleX: [1, 1, 1, -1, -1, -1],
      }}
      transition={{
        repeat: Infinity,
        duration: 6,
        ease: "linear",
        times: [0, 0.48, 0.49, 0.51, 0.52, 1],
      }}
    />
    <motion.img
      src={bird}
      alt="Flying Bird 2"
      className="flying-bird"
      style={{ position: "absolute", top: "70%", width: "60px", left: "0%" }}
      animate={{
        x: ["120vw", "-20vw", "120vw"],
        scaleX: [-1, -1, -1, 1, 1, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 8,
        ease: "linear",
        times: [0, 0.48, 0.49, 0.51, 0.52, 1],
      }}
    />
  </>
);

const getBackgroundClass = (currentScreen, selectedChapter) => {
  if (["map", "pathSelection"].includes(currentScreen)) return "sea-background";
  return selectedChapter === 0 || selectedChapter === null
    ? "mount-background"
    : "palm-background";
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("opening");
  const [pathMode, setPathMode] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [screenIndex, setScreenIndex] = useState(0);
  const [showCredits, setShowCredits] = useState(false);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasPromptedRef = React.useRef(false);
  useEffect(() => {
    if (!hasPromptedRef.current) {
      hasPromptedRef.current = true;
      const password = prompt("אנא הזן סיסמה כדי להיכנס:");
      if (password === "R1B2C3") {
        setIsAuthenticated(true);
      } else {
        alert("סיסמה שגויה. נסה שוב.");
        window.location.reload();
      }
    }
  }, []);

  useEffect(() => {
    document.body.className = getBackgroundClass(
      currentScreen,
      selectedChapter
    );
  }, [currentScreen, selectedChapter]);

  const handleNextScreen = () => {
    if (selectedChapter === null || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      if (
        screenIndex <
        chaptersData.chapters[selectedChapter].screens.length - 1
      ) {
        setScreenIndex((prev) => prev + 1);
      } else {
        setCurrentScreen("map");
        setSelectedChapter(null);
        setScreenIndex(0);
      }
    }, 1000);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
        <img
          src={`${import.meta.env.BASE_URL}assets/fonts/main-title.svg`}
          alt="main-title"
          style={{ width: "45vh", display: "block" }}
        />
        <button
          onClick={() => setCurrentScreen("introduction")}
          className="button"
        >
          התחל
        </button>
        <button
          className="credit-boat-btn"
          onClick={() => setShowCredits(true)}
        >
          <img
            src={`${
              import.meta.env.BASE_URL
            }assets/graphics/front-view-boat.png`}
            className="credit-boat-img"
            alt="credit-boat"
          />
        </button>
        <FlyingBirds />
      </div>
    ),

    introduction: (
      <ExplanationScreen
        {...chaptersData.chapters[0].screens[screenIndex]}
        chapter={chaptersData.chapters[0].title}
        id={chaptersData.chapters[0].id}
        screenIndex={screenIndex}
        selectedChapter={0}
        onSubjectSelect={setScreenIndex}
        onContinue={() => {
          if (screenIndex < chaptersData.chapters[0].screens.length - 1) {
            setScreenIndex((prev) => prev + 1);
          } else {
            setCurrentScreen("pathSelection");
            setScreenIndex(0);
          }
        }}
        onBack={
          screenIndex > 0 ? () => setScreenIndex((prev) => prev - 1) : undefined
        }
      />
    ),

    pathSelection: (
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
        id={chaptersData.chapters[selectedChapter].id}
        screenIndex={screenIndex}
        selectedChapter={selectedChapter}
        onSubjectSelect={setScreenIndex}
        onContinue={handleNextScreen}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onBack={handleBackScreen}
        onBackToMap={() => {
          setCurrentScreen("map");
          setScreenIndex(0);
        }}
      />
    ),
  };

  if (!isAuthenticated) return null;
  return (
    <div className="app">
      {screens[currentScreen]}
      {isLoading && (
        <div className="loading-overlay">
          <Spinner />
        </div>
      )}
      {showCredits && <Credits onClose={() => setShowCredits(false)} />}
    </div>
  );
};

export default App;
