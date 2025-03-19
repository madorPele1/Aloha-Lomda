import React, { useState } from "react";
import { motion } from "framer-motion";
import Credits from "./Credits";
import womanSoldier from "/assets/graphics/soldiers/standing-woman-soldier.svg";
import manSoldier from "/assets/graphics/soldiers/standing-man-soldier.svg";
import bird from "/assets/graphics/bird.svg"; // Import the bird image

const EndScreen = () => {
  const [showCredits, setShowCredits] = useState(false); // track the screen's number in the chapter

  return (
    <motion.div
      className="end-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100vw",
        height: "100svh",
      }} // Ensure birds stay within bounds
    >
      {/* Title */}
      <motion.img
        src={`${import.meta.env.BASE_URL}assets/fonts/main-title.svg`}
        alt="main-title"
        style={{ width: "45vh", display: "block", marginBottom: "8%" }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {showCredits && <Credits onClose={() => setShowCredits(false)} />}

      {/* Main content box */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.46)",
          padding: "20px",
          borderRadius: "35px",
          backdropFilter: "blur(10px)",
          width: "80%",
          maxWidth: "500px",
        }}
      >
        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          סיימתם את הלומדה בהצלחה! <br />
          כעת, ענו על השאלות בקישור הבא:
        </p>
        <motion.a
          href="https://example.com/test"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="button"
          style={{ fontSize: "1.5rem" }}
        >
          קישור
        </motion.a>
      </motion.div>

      {/* Soldiers at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <img src={womanSoldier} alt="woman Soldier" style={{ width: "13vh" }} />
        <img
          src={manSoldier}
          alt="man Soldier"
          style={{ width: "13vh", transform: "scaleX(-1)" }}
        />
      </motion.div>

      {/* Credits Boat Button */}
      <button className="credit-boat-btn" onClick={() => setShowCredits(true)}>
        <img
          src={`${import.meta.env.BASE_URL}assets/graphics/front-view-boat.svg`}
          className="credit-boat-img"
          alt="credit-boat"
        />
      </button>

      {/* Flying Birds */}
      <motion.img
        src={bird}
        alt="Flying Bird"
        className="flying-bird"
        style={{
          position: "absolute",
          top: "15%",
          width: "80px",
          left: "0%",
        }}
        animate={{
          x: ["-20vw", "120vw", "-20vw"], // Fully exits screen
          scaleX: [1, 1, 1, -1, -1, -1], // Instant flip when reaching edges
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "linear",
          times: [0, 0.48, 0.49, 0.51, 0.52, 1], // Fast flip
        }}
      />

      <motion.img
        src={bird}
        alt="Flying Bird 2"
        className="flying-bird"
        style={{
          position: "absolute",
          top: "50%",
          width: "60px",
          left: "0%",
        }}
        animate={{
          x: ["120vw", "-20vw", "120vw"], // Fully exits screen
          scaleX: [-1, -1, -1, 1, 1, 1], // Instant flip
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "linear",
          times: [0, 0.48, 0.49, 0.51, 0.52, 1], // Fast flip
        }}
      />
    </motion.div>
  );
};

export default EndScreen;
