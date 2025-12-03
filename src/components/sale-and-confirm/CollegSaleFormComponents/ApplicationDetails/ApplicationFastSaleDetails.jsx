import React from "react";
import styles from "./ApplicationSaleDetails.module.css";
import leftArrow from "../../../../assets/Frame 1410092236.svg";
import leftArrow2 from "../../../../assets//material-symbols_arrow-back-rounded.svg";

const ApplicationFastSaleDetails = () => {
    return(
        <div className={styles.clgAppSaleDetailsTop}>
            <div className={styles.clgAppSaleDetailsLeft}>
                <figure>
                    <img src={leftArrow}/>
                </figure>
                <div className={styles.clgAppSaleDetailsHeadingStepper}>
                    <p className={styles.clgAppSaleDetails}>Application Fast Sale</p>
                    <div>
                        stepper
                    </div>
                </div>
            </div>
            <div className={styles.clgAppSaleDetailRight}>
                <div className={styles.clgApplicationDetails}>
                    <p className={styles.clgAppDetailsHeading}>Academic Year</p>
                    <p className={styles.clgAppDetailsValue}>2025-2026</p>
                </div>
                <div className={styles.clgApplicationDetails}>
                    <p className={styles.clgAppDetailsHeading}>Application No</p>
                    <p className={styles.clgAppDetailsValue}>246189268</p>
                </div>
                <div className={styles.clgApplicationDetails}>
                    <p className={styles.clgAppDetailsHeading}>Branch</p>
                    <p className={styles.clgAppDetailsValue} data-fulltext="Kavuri_hills">Kavuri hills _ 01</p>
                </div>
                <div className={styles.clgApplicationDetails}>
                    <p className={styles.clgAppDetailsHeading}>Zone</p>
                    <p className={styles.clgAppDetailsValue} data-fulltext="Hyderbad_Central">Hyderabad_Central</p>
                </div>
                <div className={styles.clgApplicationDetails}>
                    <p className={styles.clgAppDetailsHeading}>Application Fee</p>
                    <p className={styles.clgAppDetailsValue}>500</p>
                </div>
            </div>
        </div>
    )
}

export default ApplicationFastSaleDetails;
