import React from "react";
import styles from "./CollegeOverviewPersonalInfo.module.css";
import UploadPicture from "../../../../../../widgets/UploadPicture/UploadPicture";

const CollegeOverviewPersonalInfo = ({ data }) => {
  console.log('🔵 CollegeOverviewPersonalInfo received data:', data);
  
  return (
    <div className={styles.wrapper}>
      {/* LEFT: Profile Image */}
      <div className={styles.leftBlock}>
        <div className={styles.imageWrapper}>
          {/* <img
            src="/student.png" 
            alt="Profile"
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
          <div className={styles.infoItem}>
            <span className={styles.label}>First Name</span>
            <span className={styles.value}>{data?.firstName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Last Name</span>
            <span className={styles.value}>{data?.lastName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Gender</span>
            <span className={styles.value}>{data?.genderName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Aapar No</span>
            <span className={styles.value}>{data?.apaarNo || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Date of Birth</span>
            <span className={styles.value}>{data?.dob ? new Date(data.dob).toLocaleDateString('en-GB') : '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Admission Referred by</span>
            <span className={styles.value}>{data?.admissionReferredByName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Quota</span>
            <span className={styles.value}>{data?.quotaName || '-'}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Aadhar Card No</span>
            <span className={styles.value}>{data?.aadharNo || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeOverviewPersonalInfo;
