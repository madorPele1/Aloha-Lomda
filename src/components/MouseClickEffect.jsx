import { motion } from "framer-motion";
import { useEffect, useState, useLayoutEffect } from "react";

const MouseClickEffect = ({ clickableAreas, imageRef }) => {
  const [clickIndex, setClickIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });

  // Define original image dimensions (should match actual image size)
  const originalImageSize = { width: 600, height: 400 };

  // Update image size when it resizes
  const updateImageSize = () => {
    if (imageRef?.current) {
      setImageSize({
        width: imageRef.current.offsetWidth || 1,
        height: imageRef.current.offsetHeight || 1,
      });
    }
  };

  useLayoutEffect(() => {
    updateImageSize();
    window.addEventListener("resize", updateImageSize);
    return () => window.removeEventListener("resize", updateImageSize);
  }, []);

  useEffect(() => {
    if (!clickableAreas?.length || clickIndex >= clickableAreas.length) {
      setClickIndex(0); // Restart animation loop
      return;
    }

    const { x, y, delay } = clickableAreas[clickIndex];

    // Ensure x and y are numbers
    if (isNaN(x) || isNaN(y)) {
      console.error(`Invalid x (${x}) or y (${y}) at index ${clickIndex}`);
      return;
    }

    // Convert original image coordinates to fit current image size
    const pixelX = (x / originalImageSize.width) * imageSize.width;
    const pixelY = (y / originalImageSize.height) * imageSize.height;

    // Move cursor after delay
    const moveTimeout = setTimeout(() => {
      setCursorPos({ x: pixelX, y: pixelY });

      // Move to the next click after 500ms
      const nextClickTimeout = setTimeout(() => {
        setClickIndex((prev) => prev + 1);
      }, 500);

      return () => clearTimeout(nextClickTimeout);
    }, delay);

    return () => clearTimeout(moveTimeout);
  }, [clickIndex, clickableAreas, imageSize]);

  // Do not render the mouse if clickableAreas is empty
  if (!clickableAreas?.length) {
    return null;
  }

  return (
    <motion.div
      className="virtual-mouse"
      animate={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      transition={{ type: "tween", duration: 0.5 }}
    />
  );
};

export default MouseClickEffect;
