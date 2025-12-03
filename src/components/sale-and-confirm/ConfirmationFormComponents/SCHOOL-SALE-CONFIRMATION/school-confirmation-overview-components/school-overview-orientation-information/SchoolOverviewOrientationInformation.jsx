
import styles from "./SchoolOverviewOrientationInformation.module.css";

const SchoolOverviewOrientationInformation = ({ overviewData }) => {
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
          <span className={styles.value}>{overviewData?.academicYearValue || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Branch</span>
          <span className={styles.value}>{overviewData?.branchName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Student Type</span>
          <span className={styles.value}>{overviewData?.studentTypeName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Joining Class</span>
          <span className={styles.value}>{overviewData?.joiningClassName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Course Name</span>
          <span className={styles.value}>{overviewData?.orientationName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>City</span>
          <span className={styles.value}>{overviewData?.cityName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Course Start Date</span>
          <span className={styles.value}>-</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Course End Date</span>
          <span className={styles.value}>-</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Course Fee</span>
          <span className={styles.value}>-</span>
        </div>

      </div>
    </div>
  );
}

export default SchoolOverviewOrientationInformation;
