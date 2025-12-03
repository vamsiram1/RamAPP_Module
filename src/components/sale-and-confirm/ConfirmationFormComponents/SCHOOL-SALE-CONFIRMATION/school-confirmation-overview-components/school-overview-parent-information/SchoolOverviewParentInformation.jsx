import React from 'react'
import styles from "./SchoolOverviewParentInformation.module.css";
const SchoolOverviewParentInformation = ({ overviewData }) => {
  return (
    <div className={styles.wrapper}>
      {/* Title + line */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Parent Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Content grid */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Father Name</span>
          <span className={styles.value}>{overviewData?.parentInfo?.fatherName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Phone Number</span>
          <span className={styles.value}>{overviewData?.parentInfo?.phoneNumber || '-'}</span>
        </div>
      </div>
    </div>
  )
}

export default SchoolOverviewParentInformation