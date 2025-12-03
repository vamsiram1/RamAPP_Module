import React from "react";
import styles from "./CollegeOverviewSiblingInfo.module.css";

const CollegeOverviewSiblingInfo = ({ siblingsData = [] }) => {
  console.log('CollegeOverviewSiblingInfo - Received siblingsData:', siblingsData);

  // If no siblings data, show a message
  if (!siblingsData || siblingsData.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.headerRow}>
          <span className={styles.title}>Sibling Information</span>
          <div className={styles.line}></div>
        </div>
        <div className={styles.infoGrid}>
          <p className={styles.noData}>No sibling information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Title + line */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Sibling Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Render each sibling */}
      {siblingsData.map((sibling, index) => (
        <div key={index} className={styles.siblingSection}>
          {siblingsData.length > 1 && (
            <div className={styles.siblingNumber}>Sibling {index + 1}</div>
          )}
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Full Name</span>
              <span className={styles.value}>{sibling?.fullName || '-'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Relation Type</span>
              <span className={styles.value}>{sibling?.relationName || '-'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Class</span>
              <span className={styles.value}>{sibling?.className || '-'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>School</span>
              <span className={styles.value}>{sibling?.schoolName || '-'}</span>
            </div>

            {/* <div className={styles.infoItem}>
              <span className={styles.label}>Gender</span>
              <span className={styles.value}>{sibling?.gender || '-'}</span>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollegeOverviewSiblingInfo;
