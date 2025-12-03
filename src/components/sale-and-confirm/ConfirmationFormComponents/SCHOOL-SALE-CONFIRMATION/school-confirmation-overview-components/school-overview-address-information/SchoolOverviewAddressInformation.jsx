import styles from "./SchoolOverviewAddressInformation.module.css";

const AddressInformationDetails = ({ overviewData }) => {
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
          <span className={styles.value}>{overviewData?.addressDetails?.doorNo || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Street</span>
          <span className={styles.value}>{overviewData?.addressDetails?.street || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Landmark</span>
          <span className={styles.value}>{overviewData?.addressDetails?.landmark || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Area</span>
          <span className={styles.value}>{overviewData?.addressDetails?.area || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Pincode</span>
          <span className={styles.value}>{overviewData?.addressDetails?.pincode || '-'}</span>
        </div>


        <div className={styles.infoItem}>
          <span className={styles.label}>State</span>
          <span className={styles.value}>-</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>District</span>
          <span className={styles.value}>{overviewData?.addressDetails?.districtName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Mandal</span>
          <span className={styles.value}>{overviewData?.addressDetails?.mandalName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>City</span>
          <span className={styles.value}>{overviewData?.addressDetails?.cityName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>G-pin</span>
          <span className={styles.value}>-</span>
        </div>

      </div>
    </div>
  );
}


export default AddressInformationDetails;