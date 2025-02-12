import React, { useState, useRef } from "react";
import MouseClickEffect from "./MouseClickEffect";

const InteractiveAreas = ({ image, interactiveAreas, clickableAreas }) => {
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  const handleTagClick = (index) => {
    setSelectedAreaIndex(index === selectedAreaIndex ? null : index); // Toggle on/off
  };

  if (!image) return null;

  return (
    <div className="image-container">
      {clickableAreas && imageLoaded &&(
        <MouseClickEffect clickableAreas={clickableAreas} imageRef={imageRef} />
      )}
      <img
        src={image}
        alt="screen visual"
        ref={imageRef}
        onLoad={() => setImageLoaded(true)}
        className="explanation-image screenshot"
      />
      {interactiveAreas &&
        interactiveAreas.map((area, index) => (
          <div
            key={index}
            className="interactive-tag"
            style={{
              position: "absolute",
              top: `${15 + index * 40}%`, // Example positioning
              left: `${30 + index * 20}%`,
            }}
            onClick={() => handleTagClick(index)}
          >
            PAC {index + 2}
            {selectedAreaIndex === index && (
              <div className="area-description">
                <button
                  className="close-btn"
                  onClick={() => setSelectedAreaIndex(null)}
                >
                  ✕
                </button>
                <p>{area}</p>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default InteractiveAreas;
