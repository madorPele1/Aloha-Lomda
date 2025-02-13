const PathSelection = ({ onSelectPath }) => (
  <div className="path-selection">
    <div className="selection-explanation">
      תוכלו לבחור בין שני מסלולים ללומדה: <br />
      <b>סיור מודרך</b> או <b>צלילה חופשית.</b>
    </div>
    <div style={{ display: "flex" }}>
      <div className="selection-container">
        <img
          className="selection-boat"
          src={`${import.meta.env.BASE_URL}assets/graphics/front-view-boat.svg`}
          alt="selection-boat"
        />
        <button className="button" onClick={() => onSelectPath("structured")}>
          סיור מודרך
        </button>
        <div className="selection-explanation selection-explanation-div">
          <span>
            מסלול מובנה המותאם למשתמש שרוצה ללמוד את התוכנה על כלל אפשרויותיה
          </span>
        </div>
      </div>
      <div className="selection-container">
        <img
          className="selection-soldier"
          src={`${import.meta.env.BASE_URL}assets/graphics/diving-mask-soldier.svg`}
          alt="selection-soldier"
        />
        <button
          className="button"
          onClick={() => onSelectPath("refresh")}
          style={{ position: "relative" }}
        >
          צלילה חופשית
        </button>
        <div className="selection-explanation selection-explanation-div">
          <span>מסלול רענון המאפשר לבחור בכל פעם בנושא אחר באופן חופשי</span>
        </div>
      </div>
    </div>
  </div>
);

export default PathSelection;
