import React from "react";

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <img
        src={`${import.meta.env.BASE_URL}assets/graphics/spinner.gif`}
        alt="Loading..."
        className="spinner-img"
      />
    </div>
  );
};

export default Spinner;
