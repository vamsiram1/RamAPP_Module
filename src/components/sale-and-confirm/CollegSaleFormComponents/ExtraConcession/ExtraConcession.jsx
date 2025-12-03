import React, { useState, useMemo } from "react";
import styles from "./ExtraConcession.module.css";

import { renderField } from "../../../../utils/renderField";
import {
  extraConcessionFeilds,
  extraConcessionFieldsLayout,
} from "./extraConcessionFields";

import { useGetEmployeesForSale } from "../../../../queries/saleApis/clgSaleApis";
import {toTitleCase} from "../../../../utils/toTitleCase";

const ExtraConcession = () => {
  const [values, setValues] = useState({});
  const [showConcessionFields, setShowConcessionFields] = useState(false);

  // Toggle
  const handleToggleConcession = () => {
    setShowConcessionFields((prev) => !prev);
  };

  const setFieldValue = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ----------------------------------
      API: Get employees for dropdown
  ---------------------------------- */
  const { data: employeesRaw = [] } = useGetEmployeesForSale();

  const employeeOptions = useMemo(
    () => employeesRaw.map((e) => toTitleCase(e?.name ?? "")),  
    [employeesRaw]
  );

  /* ----------------------------------
      Build field map dynamically
  ---------------------------------- */
  const fieldMap = useMemo(() => {
    const map = {};

    extraConcessionFeilds.forEach((f) => {
      map[f.name] = { ...f };

      // Inject API options for concessionReferredBy
      if (f.name === "concessionReferredBy") {
        map[f.name].options = employeeOptions;
      }
    });

    return map;
  }, [employeeOptions]);

  return (
    <div className={styles.clgAppSaleExtraConcessionWrapper}>
      <div className={styles.clgAppSaleExtraConcessionInfoTop}>
        <div className={styles.extraConcessionTopLeft}>
          {/* Toggle Button */}
          <div
            className={styles.extraConcessionSelection}
            onClick={handleToggleConcession}
          >
            {showConcessionFields && (
              <div className={styles.extraSelectionOption}></div>
            )}
          </div>

          <p className={styles.clgAppSaleExtraConcessionHeading}>
            Concession Written on Application
          </p>
        </div>

        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      {/* Conditional Fields */}
      {showConcessionFields && (
        <div className={styles.clgAppSaleExtraConcessionInfoBottom}>
          {extraConcessionFieldsLayout.map((row) => (
            <div key={row.id} className={styles.clgAppSalerow}>
              {row.fields.map((fname) => (
                <div key={fname} className={styles.clgAppSaleFieldCell}>
                  {renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    onChange: (e) => setFieldValue(fname, e.target.value),
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExtraConcession;
