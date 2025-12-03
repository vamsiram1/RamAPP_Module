import React from "react";
import styles from "./SchoolOverviewAcadameciInfo.module.css";

const SchoolOverviewAcadameciInfo = ({ overviewData }) => {
  return (
    <div className={styles.wrapper}>
      {/* Title */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Academic Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Content grid */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Orientation Name</span>
          <span className={styles.value}>{overviewData?.orientationName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Orientation Fee</span>
          <span className={styles.value}>-</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Score App No</span>
          <span className={styles.value}>-</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Score Marks</span>
          <span className={styles.value}>-</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Food Type</span>
          <span className={styles.value}>-</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Blood Group</span>
          <span className={styles.value}>-</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Caste</span>
          <span className={styles.value}>-</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Religion</span>
          <span className={styles.value}>-</span>
        </div>
      </div>
    </div>
  );
};

export default SchoolOverviewAcadameciInfo;