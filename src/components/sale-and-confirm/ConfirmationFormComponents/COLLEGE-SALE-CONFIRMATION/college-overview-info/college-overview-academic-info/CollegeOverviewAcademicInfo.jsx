import React from "react";
import styles from "./CollegeOverviewAcademicInfo.module.css";

const CollegeOverviewAcademicInfo = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      {/* Title + line */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Academic Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Content grid */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Hall Ticket Number</span>
          <span className={styles.value}>{data?.hallTicketNo || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>School State</span>
          <span className={styles.value}>{data?.preSchoolStateName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>School District</span>
          <span className={styles.value}>{data?.preSchoolDistrictName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>School Type</span>
          <span className={styles.value}>{'-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>School Name</span>
          <span className={styles.value}>{data?.preSchoolName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Score App No</span>
          <span className={styles.value}>{data?.studAdmsNo || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Score Marks</span>
          <span className={styles.value}>{data?.scoreMarks || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Food type</span>
          <span className={styles.value}>{data?.foodTypeName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Blood Group</span>
          <span className={styles.value}>{data?.bloodGroupName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Caste</span>
          <span className={styles.value}>{data?.casteName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Religion</span>
          <span className={styles.value}>{data?.religionName || '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default CollegeOverviewAcademicInfo;
