import React from "react";
import styles from "./DamagedFormContainer.module.css";
import DamagedForm from "../../components/damaged/DamagedForm";

// Container applies full-width layout wrapper
const DamagedFormContainer = () => {
    return (
        <div className={styles.damagedFormContainer}>
            <DamagedForm/>
        </div>
    );
};

export default DamagedFormContainer;
