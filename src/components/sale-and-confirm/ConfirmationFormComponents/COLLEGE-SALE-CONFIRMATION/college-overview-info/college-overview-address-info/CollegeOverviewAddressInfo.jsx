import React from "react";
import styles from "./CollegeOverviewAddressInfo.module.css";

const CollegeOverviewAddressInfo = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      {/* Title + Divider */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Address Information</span>
        <div className={styles.line}></div>
      </div>

      {/* GRID */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Door No</span>
          <span className={styles.value}>{data?.doorNo || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Street</span>
          <span className={styles.value}>{data?.street || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Landmark</span>
          <span className={styles.value}>{data?.landmark || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Area</span>
          <span className={styles.value}>{data?.area || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Pincode</span>
          <span className={styles.value}>{data?.pincode || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>State</span>
          <span className={styles.value}>{data?.addressStateName || '-'}</span>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.label}>District</span>
          <span className={styles.value}>{data?.addressDistrictName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Mandal</span>
          <span className={styles.value}>{data?.addressMandalName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>City</span>
          <span className={styles.value}>{data?.addressCityName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>G-pin</span>
          <span className={styles.value}>{'-'}</span>
        </div>
      </div>
    </div>
  );
};

export default CollegeOverviewAddressInfo;
