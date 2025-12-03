import React from "react";
import styles from "./CollegeOverviewParentInfo.module.css";

const CollegeOverviewParentInfo = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      {/* Title + line */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Parent Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Father Information Grid */}
      <div className={styles.parentSection}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Father Name</span>
            <span className={styles.value}>{data?.fatherName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Phone Number</span>
            <span className={styles.value}>{data?.fatherMobile || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{data?.fatherEmail || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Sector</span>
            <span className={styles.value}>{data?.fatherSectorName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Occupation</span>
            <span className={styles.value}>{data?.fatherOccupationName || '-'}</span>
          </div>
        </div>
      </div>

      {/* Mother Information Grid */}
      <div className={styles.parentSection}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Mother Name</span>
            <span className={styles.value}>{data?.motherName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Phone Number</span>
            <span className={styles.value}>{data?.motherMobile || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{data?.motherEmail || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Sector</span>
            <span className={styles.value}>{data?.motherSectorName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Occupation</span>
            <span className={styles.value}>{data?.motherOccupationName || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeOverviewParentInfo;
