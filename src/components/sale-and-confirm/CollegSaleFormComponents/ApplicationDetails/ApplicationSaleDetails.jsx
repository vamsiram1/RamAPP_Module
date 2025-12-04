import React, { useEffect, useRef } from "react";
import styles from "./ApplicationSaleDetails.module.css";

import leftArrow from "../../../../assets/application-status/Frame 1410092236.svg";

import { useGetApplicationHeaderValues } from "../../../../queries/saleApis/clgSaleApis";
import ProgressHeader from "../../../../widgets/ProgressHeader/ProgressHeader";

const ApplicationSaleDetails = ({ saleName, onDataLoaded, applicationNo, onBack }) => {
  // 🔥 Fetch API - use applicationNo from props (passed from table), fallback to hardcoded value only for development/testing
  const effectiveApplicationNo = applicationNo;
  
  if (applicationNo) {
    console.log("✅ ApplicationSaleDetails - Using applicationNo from table:", applicationNo);
  } else {
    console.warn("⚠️ ApplicationSaleDetails - No applicationNo provided, using hardcoded fallback:", effectiveApplicationNo);
  }
  
  const { data, isLoading, isError } =
    useGetApplicationHeaderValues(effectiveApplicationNo);

  // 🟢 Extract values
  const details = data?.data || {};

  // Extract IDs and values
  const academicYear = details.academicYear || "-";
  const academicYearId = details.academicYearId || details.academicYear_id || details.acadYearId || details.yearId || null;
  const appNo = details.applicationNo || details.appNo || details.application_no || "-";
  const studAdmsNo = details.studAdmsNo || details.stud_adms_no || details.studentAdmsNo || details.student_adms_no || null;
  const campusName = details.campusName || "-";
  const campusId = details.campusId || details.campus_id || details.branchId || details.branch_id || null;
  const cityName = details.cityName || details.city || "-";
  const cityId = details.cityId || details.city_id || null;
  const zoneName = details.zoneName || "-";
  const appFee = details.applicationFee ?? "0";

  // Use ref to track if data has been sent to prevent infinite loops
  const dataSentRef = useRef(false);
  const lastDataRef = useRef(null);

  // Log extracted IDs for debugging
  console.log("📊 ApplicationSaleDetails - Extracted data:", {
    academicYear,
    academicYearId,
    campusName,
    campusId,
    cityName,
    cityId,
    appNo,
    studAdmsNo,
    zoneName,
    appFee,
    rawDetails: details
  });

  // Pass data to parent component when loaded - only once when data is ready
  useEffect(() => {
    // Only proceed if data is loaded and not in error state
    if (isLoading || isError || !details || !onDataLoaded) {
      return;
    }

    // Create data object
    const dataToSend = {
      academicYear,
      academicYearId,
      campusName,
      campusId,
      cityName,
      cityId,
      appNo, // Application number
      studAdmsNo, // Student admission number (for update API)
      zoneName,
      appFee,
    };

    // Check if data has changed or hasn't been sent yet
    const dataString = JSON.stringify(dataToSend);
    const lastDataString = lastDataRef.current ? JSON.stringify(lastDataRef.current) : null;

    if (dataString !== lastDataString) {
      console.log("📤 ApplicationSaleDetails - Passing data to parent:", dataToSend);
      onDataLoaded(dataToSend);
      lastDataRef.current = dataToSend;
      dataSentRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError, details, onDataLoaded]);

  // 🔄 Loading state
  if (isLoading)
    return (
      <div className={styles.clgAppSaleDetailsTop}>
        <p>Loading application details...</p>
      </div>
    );

  // ❌ Error state
  if (isError)
    return (
      <div className={styles.clgAppSaleDetailsTop}>
        <p>Error loading application details</p>
      </div>
    );

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className={styles.clgAppSaleDetailsTop}>
      <div className={styles.clgAppSaleDetailsLeft}>
        <figure>
          <img 
            src={leftArrow} 
            alt="back arrow" 
            onClick={handleBackClick}
            style={{ cursor: onBack ? 'pointer' : 'default' }}
          />
        </figure>

        <div className={styles.clgAppSaleDetailsHeadingStepper}>
          <p className={styles.clgAppSaleDetails}>
            Application {saleName}
          </p>
          <ProgressHeader step={0} totalSteps={2} />
        </div>
      </div>

      {/* RIGHT SIDE VALUES FROM API */}
      <div className={styles.clgAppSaleDetailRight}>
        <div className={styles.clgApplicationDetails}>
          <p className={styles.clgAppDetailsHeading}>Academic Year</p>
          <p className={styles.clgAppDetailsValue}>{academicYear}</p>
        </div>

        <div className={styles.clgApplicationDetails}>
          <p className={styles.clgAppDetailsHeading}>Application No</p>
          <p className={styles.clgAppDetailsValue}>{appNo}</p>
        </div>

        <div className={styles.clgApplicationDetails}>
          <p className={styles.clgAppDetailsHeading}>Branch</p>
          <p
            className={styles.clgAppDetailsValue}
            data-fulltext={campusName}
          >
            {campusName}
          </p>
        </div>

        <div className={styles.clgApplicationDetails}>
          <p className={styles.clgAppDetailsHeading}>Zone</p>
          <p
            className={styles.clgAppDetailsValue}
            data-fulltext={zoneName}
          >
            {zoneName}
          </p>
        </div>

        <div className={styles.clgApplicationDetails}>
          <p className={styles.clgAppDetailsHeading}>Application Fee</p>
          <p className={styles.clgAppDetailsValue}>{appFee}</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSaleDetails;
