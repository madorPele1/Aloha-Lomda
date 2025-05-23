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
  const defaultVariable = graph?.defaultVariable;
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
  const [defaultSliderValue, setDefaultSliderValue] = useState(
    graph.variables?.[defaultVariable]?.defaultSliderValue ||
      sliderValues[0] ||
      0
  );
  const [sliderValue, setSliderValue] = useState(defaultSliderValue);
  const [ellipseWidth, setEllipseWidth] = useState(
    xPositions[sliderValues.indexOf(defaultSliderValue)] || xPositions[0] || 0
  );

  useEffect(() => {
    if (graph.variables?.[selectedVariable]) {
      const newSliderValues = graph.variables[selectedVariable].sliderValues;
      const newXPositions = graph.variables[selectedVariable].xPositions;
      const newMeasureUnits =
        graph.variables[selectedVariable].measureUnits || "";
      const newDefaultSliderValue =
        graph.variables[selectedVariable].defaultSliderValue ||
        newSliderValues[0];

      setSliderValues(newSliderValues);
      setXPositions(newXPositions);
      setMeasureUnits(newMeasureUnits);
      setDefaultSliderValue(newDefaultSliderValue);

      const defaultIndex = newSliderValues.indexOf(newDefaultSliderValue);
      setSliderValue(newSliderValues[defaultIndex] || newSliderValues[0]);
      setEllipseWidth(newXPositions[defaultIndex] || newXPositions[0]);
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
        backgroundColor: "rgba(233, 156, 67, 0.05)",
        borderColor: "rgba(233, 156, 67, 0.2)",
        borderWidth: 10,
      },
    ],
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        height: "30%",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "20px", margin: "-10px", lineHeight: "25px" }}>
        {graph.title}
      </h2>
      <Bubble
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            y: {
              grid: {
                color: (ctx) =>
                  ctx.tick.value === 0 ? "black" : "rgba(0, 0, 0, 0.2)",
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
              max: maxXValue,
              grid: {
                color: "rgba(0, 0, 0, 0.5)",
              },
              ticks: {
                maxTicksLimit: 4,
              },
              title: {
                display: true,
                text: "מטרים",
              },
              border: {
                color: "black",
                width: 3,
              },
            },
          },
          plugins: {
            legend: { display: true },
          },
        }}
      />

      <div>
        <label
          htmlFor="ellipseWidth"
          style={{ fontSize: "3.5vw", display: "block", width: "105%" }}
        >
          הזיזו את הסמן כדי לצפות בשינוי המתקבל:
        </label>
        <input
          id="ellipseWidth"
          type="range"
          min={0}
          max={sliderValues.length - 1}
          step={1}
          value={sliderValues.indexOf(sliderValue)}
          onChange={handleSliderChange}
          className="custom-slider"
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {sliderValues.map((value, index) => (
            <span key={index}>{value}</span>
          ))}
        </div>
        {selectedVariable === "מצב יציבות" && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "-20px 0",
            }}
          >
            <p>ללא אינברסיה</p>
            <p>עם אינברסיה</p>
          </div>
        )}

        <p style={{ marginTop: "-5px" }}>
          {selectedVariable} {measureUnits}
        </p>

        {graph.variables?.[selectedVariable]?.defaultSliderValue !==
          undefined && (
          <p style={{ fontWeight: "bold", color: "#5FB6BE" }}>
            ערך ברירת מחדל: {defaultSliderValue}
          </p>
        )}

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
