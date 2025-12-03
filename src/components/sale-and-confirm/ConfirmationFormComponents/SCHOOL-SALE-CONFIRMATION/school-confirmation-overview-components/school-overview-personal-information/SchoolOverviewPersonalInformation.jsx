import React from 'react'

import styles from "./SchoolOverviewPersonalInformation.module.css";
import UploadPicture from '../../../../../../widgets/UploadPicture/UploadPicture';

const SchoolOverviewPersonalInformation = ({ overviewData }) => {
  return (
    <div className={styles.wrapper}>
      {/* LEFT: Profile Image */}
      <div className={styles.leftBlock}>
        <div className={styles.imageWrapper}>
          {/* <img
            src="https://via.placeholder.com/150"
            alt="profile"
            className={styles.profileImg}
          />
          <button className={styles.editBtn}>✎ Edit</button>

          <span className={styles.maxSizeText}>max image size is 300kb</span> */}

<UploadPicture/>
          
        </div>
      </div>

      {/* RIGHT: Personal Information */}
      <div className={styles.rightBlock}>
        <div className={styles.headerRow}>
          <span className={styles.sectionTitle}>Personal Information</span>
          <div className={styles.line}></div>
        </div>

        <div className={styles.infoGrid}>
          {/* ROW 1 */}
          <div className={styles.infoItem}>
            <span className={styles.label}>PRO Receipt No</span>
            <span className={styles.value}>{overviewData?.proReceiptNo ?? '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>First Name</span>
            <span className={styles.value}>{overviewData?.firstName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Last Name</span>
            <span className={styles.value}>{overviewData?.lastName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Gender</span>
            <span className={styles.value}>{overviewData?.genderName || '-'}</span>
          </div>

          {/* ROW 2 */}
          <div className={styles.infoItem}>
            <span className={styles.label}>Aapar No</span>
            <span className={styles.value}>{overviewData?.apaarNo || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Date of Birth</span>
            <span className={styles.value}>{overviewData?.dob ? new Date(overviewData.dob).toLocaleDateString('en-GB') : '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Admission Referred by</span>
            <span className={styles.value}>{overviewData?.admissionReferredByName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Quota</span>
            <span className={styles.value}>{overviewData?.quotaName || '-'}</span>
          </div>

          {/* ROW 3 */}
          <div className={styles.infoItem}>
            <span className={styles.label}>Aadhar Card No</span>
            <span className={styles.value}>{overviewData?.aadharCardNo || '-'}</span>
          </div>

          {/* <div className={styles.infoItem}>
            <span className={styles.label}>PRO Receipt No</span>
            <span className={styles.value}>{overviewData?.proReceiptNo ?? '-'}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default SchoolOverviewPersonalInformation;