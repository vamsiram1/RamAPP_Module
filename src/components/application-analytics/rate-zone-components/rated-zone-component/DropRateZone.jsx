import React from "react";
import styles from "./DropRateZone.module.css";
 
const DropRateZone = ({ title = "", zoneData = [], progressBarClass = "" }) => {
  return (
    <div className={styles.drop_rate_container}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.unordered_list}>
        {zoneData.map((zone, index) => (
          <li key={index} className={styles.zone_row}>
            {/* UPDATED LINE BELOW: Extracts first 3 letters and makes them uppercase */}
            <div className={styles.zone_indicator}>
              {zone.name ? zone.name.substring(0, 3).toUpperCase() : ""}
            </div>
           
            <div className={styles.zone_details}>
              <label className={styles.zone_name}>{zone.name}</label>
              <div className={styles.progress_container}>
                <div className={styles.progress_bar}>
                  <div
                    className={`${styles.progress} ${progressBarClass}`}
                    style={{ width: `${zone.rate}%` }}
                  />
                </div>
                <span className={styles.rate}>{zone.rate}%</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
 
export default DropRateZone;
 