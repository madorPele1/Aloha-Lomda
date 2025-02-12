import React, { useState, useEffect } from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip);

const GraphScreen = ({ graph }) => {
  const defaultVariable = graph.defaultVariable;
  const variables = graph.variables ? Object.keys(graph.variables) : [];

  const [selectedVariable, setSelectedVariable] = useState(defaultVariable);
  const [sliderValues, setSliderValues] = useState(
    graph.variables?.[defaultVariable]?.sliderValues || []
  );
  const [measureUnits, setMeasureUnits] = useState(
    graph.variables?.[defaultVariable]?.measureUnits || ""
  );
  const [xPositions, setXPositions] = useState(
    graph.variables?.[defaultVariable]?.xPositions || []
  );
  const [sliderValue, setSliderValue] = useState(sliderValues[0] || 0);
  const [ellipseWidth, setEllipseWidth] = useState(xPositions[0] || 0);

  useEffect(() => {
    if (graph.variables?.[selectedVariable]) {
      const newSliderValues = graph.variables[selectedVariable].sliderValues;
      const newXPositions = graph.variables[selectedVariable].xPositions;
      const newMeasureUnits =
        graph.variables[selectedVariable].measureUnits || "";

      setSliderValues(newSliderValues);
      setXPositions(newXPositions);
      setMeasureUnits(newMeasureUnits);

      if (newSliderValues.length > 0) {
        setSliderValue(newSliderValues[0]);
        setEllipseWidth(newXPositions[0] || 0);
      }
    }
  }, [selectedVariable, graph.variables]);

  const handleSliderChange = (event) => {
    const index = Number(event.target.value);
    const progress = (index / (sliderValues.length - 1)) * 100;
    event.target.style.setProperty("--progress", `${progress}%`);
    setSliderValue(sliderValues[index]);
    setEllipseWidth(xPositions[index]);
  };

  const handleVariableChange = (variable) => {
    document
      .querySelector("#ellipseWidth")
      .style.setProperty("--progress", "0%");
    setSelectedVariable(variable);
  };

  // Calculate the max x position dynamically
  const maxXValue = Math.ceil(Math.max(...xPositions) / 100) * 100;

  const generateEllipseData = () => {
    const points = [];
    const height = 0.1;
    const centerX = ellipseWidth / 2;
    for (let i = -50; i <= 50; i++) {
      const x = centerX + (i / 50) * (ellipseWidth / 2);
      const y = Math.sqrt(1 - (i / 50) ** 2) * height;
      const yMirror = -Math.sqrt(1 - (i / 50) ** 2) * height;
      points.push({ x, y, r: 2 });
      points.push({ x, y: yMirror, r: 2 });
    }
    return points;
  };

  const data = {
    datasets: [
      {
        data: generateEllipseData(),
        backgroundColor: "rgba(233, 156, 67, 0.05)", // Fill the ellipse with a solid color
        borderColor: "rgba(233, 156, 67, 0.2)",
        borderWidth: 10,
      },
    ],
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        height: "300px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "20px", margin: "-10px" }}>{graph.title}</h2>
      <Bubble
        data={data}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              grid: {
                color: (ctx) =>
                  ctx.tick.value === 0 ? "black" : "rgba(0, 0, 0, 0.2)", // Make y=0 line black
                tickWidth: 0,
                lineWidth: 3,
              },
              ticks: {
                display: false,
                stepSize: 0.05, 
                maxTicksLimit: 5, 
              },
              max: 1,
              min: -1,
              border: {
                color: "black",
                width: 3,
              },
            },
            x: {
              min: 0,
              max: maxXValue, // Dynamically set the maximum value based on xPositions
              grid: {
                color: "rgba(0, 0, 0, 0.5)",
              },
              ticks: {
                maxTicksLimit: 4, 
              },
              border: {
                color: "black",
                width: 3,
              },
            },
          },
          plugins: {
            legend: { display: false },
          },
        }}
      />

      <div>
        <label
          htmlFor="ellipseWidth"
          style={{ fontSize: "3.5vw", display: "block", width: "105%" }}
        >
          הזיזו את הסמן כדי לצפות בשינוי בשטח השפך המתקבל:
        </label>
        <input
          id="ellipseWidth"
          type="range"
          min={0} // First index
          max={sliderValues.length - 1} // Last index
          step={1} //  move in equal steps
          value={sliderValues.indexOf(sliderValue)} // Convert real value to index
          onChange={handleSliderChange}
          className="custom-slider"
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {sliderValues.map((value, index) => (
            <span key={index}>{value}</span>
          ))}
        </div>
        <p style={{ marginTop: "-5px" }}>
          {selectedVariable} {measureUnits}
        </p>

        {variables.length > 1 && (
          <div className="variables-div">
            {variables.map((variable) => (
              <div
                key={variable}
                onClick={() => handleVariableChange(variable)}
                className="variable"
                style={{
                  background:
                    selectedVariable === variable ? "#5FB6BE" : "#d3d3d3",
                }}
              >
                {variable}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphScreen;
