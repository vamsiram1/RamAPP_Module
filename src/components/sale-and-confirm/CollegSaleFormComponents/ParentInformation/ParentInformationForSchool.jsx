import React, { useState } from "react";
import { useFormikContext } from "formik";
import styles from "./ParentInformation.module.css";

import {
  parentInfoFields,
  parentInfoFieldsLayoutForSchool,
} from "./parentInformationFields";

import SiblingInformation from "./SiblingInformation";

import { renderField } from "../../../../utils/renderField";
import Button from "../../../../widgets/Button/Button";
import uploadAnnexureIcon from "../../../../assets/application-status/uploadAnnexureIcon";
import plusIconBlueColor from "../../../../assets/application-status/plusIconBlueColor";

const ParentInformationForSchool = () => {
  const [showSibling, setShowSibling] = useState(true);
  
  // Use Formik context to store values in the main form
  const { values, setFieldValue } = useFormikContext();

  // Map field name → field config
  const fieldMap = parentInfoFields.reduce((acc, f) => {
    acc[f.name] = f;
    return acc;
  }, {});

  const handleClickSiblingButton = () => {
    // show the sibling section (first click)
    // if you want toggle, use: setShowSibling(prev => !prev);
    setShowSibling(true);
  };

  const addSiblingButtonText = showSibling
    ? "Add Another Sibling"
    : "Add Sibling";

    const buttonWidth = showSibling ? "240px" : "194px";

  return (
    <div className={styles.clgAppSalePersonalInforWrapper}>
      <div className={styles.clgAppSaleParentsInfoTop}>
        <p className={styles.clgAppSaleParentsHeading}>Parent Information</p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      <div className={styles.clgAppSaleParentInfoBottom}>
        {parentInfoFieldsLayoutForSchool.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => (
              <div key={fname} className={styles.clgAppSaleFieldCell}>
                {renderField(fname, fieldMap, {
                  value: values[fname] ?? "",
                  onChange: (e) => {
                    const value = e.target.value;
                    // Map mobileNumber to fatherMobile for consistency
                    if (fname === "mobileNumber") {
                      setFieldValue("fatherMobile", value);
                      setFieldValue("mobileNumber", value); // Keep both for backward compatibility
                    } else {
                      setFieldValue(fname, value);
                    }
                  },
                })}
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
};

export default ParentInformationForSchool;
