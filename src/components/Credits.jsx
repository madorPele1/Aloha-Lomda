import React from "react";
import { motion } from "framer-motion";

const Credits = ({ onClose }) => {
  return (
    <div className="credits-overlay">
      <motion.div
        className="credits-window"
        initial={{ opacity: 0, scale: 0.8, y: "-50%" }}
        animate={{ opacity: 1, scale: 1, y: "0%" }}
        exit={{ opacity: 0, scale: 0.8, y: "-50%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>קרדיטים</h2>
        <ul>
          <li>
            <b>עיצוב ופיתוח: </b> מדור פיתוח הדרכה
          </li>
          <li>
            <b>תוכן:</b> ענף חומ"ס
          </li>
          <li>
            <b>קריינות:</b>אולפן שידור
          </li>
          <li >
            {" "}
            <b>פונט הכותרות: </b> אתר אות.חיים,<br/> <span style={{marginRight: "30px"}} >כתב ידו של עומרי ניב פיירשטיין</span>
          </li>
          <a href="https://www.ot-hayim.co.il/fonts/omri-niv-fireshtein/">
            בקרו בקישור על מנת ללמוד על סיפור חייו
          </a>
        </ul>
      </motion.div>
    </div>
  );
};

export default Credits;
