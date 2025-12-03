import React from "react";
import styles from "./CollegeOverviewOrientInfo.module.css";

const CollegeOverviewOrientInfo = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      {/* Title + Divider */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Orientation Information</span>
        <div className={styles.line}></div>
      </div>

      {/* GRID */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Academic Year</span>
          <span className={styles.value}>{data?.academicYearName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>City</span>
          <span className={styles.value}>{data?.cityName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Branch</span>
          <span className={styles.value}>{data?.branchName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Joining Class</span>
          <span className={styles.value}>{data?.className || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Course Name</span>
          <span className={styles.value}>{data?.orientationName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Student Type</span>
          <span className={styles.value}>{data?.studentTypeName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Course Start Date</span>
          <span className={styles.value}>{data?.orientationStartDate ? new Date(data.orientationStartDate).toLocaleDateString('en-GB') : '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Course End Date</span>
          <span className={styles.value}>{data?.orientationEndDate ? new Date(data.orientationEndDate).toLocaleDateString('en-GB') : '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Course Fee</span>
          <span className={styles.value}>{data?.orientationFee || '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default CollegeOverviewOrientInfo;
