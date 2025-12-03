import React, { useState, useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import styles from "./ParentInformation.module.css";

import {
  parentInfoFields,
  parentInfoFieldsLayout,
} from "./parentInformationFields";

import SiblingInformation from "./SiblingInformation";
import { renderField } from "../../../../utils/renderField";

import Button from "../../../../widgets/Button/Button";
import uploadAnnexureIcon from "../../../../assets/application-status/uploadAnnexureIcon";
import plusIconBlueColor from "../../../../assets/application-status/plusIconBlueColor";

import { useGetSector, useGetOccupation } from "../../../../queries/saleApis/clgSaleApis";

const ParentInformation = () => {
 const { values, setFieldValue, errors, touched } = useFormikContext();
  const [showSibling, setShowSibling] = useState(false);

  const { data: sectorData } = useGetSector();
  const { data: occupationData } = useGetOccupation();

  // Create name-to-ID maps for storing IDs
  const sectorNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(sectorData?.data)) {
      sectorData.data.forEach((s) => {
        if (s.name && s.id) {
          map.set(s.name, s.id);
        }
      });
    }
    return map;
  }, [sectorData]);

  const occupationNameToId = useMemo(() => {
    const map = new Map();
    if (Array.isArray(occupationData?.data)) {
      occupationData.data.forEach((o) => {
        if (o.name && o.id) {
          map.set(o.name, o.id);
        }
      });
    }
    return map;
  }, [occupationData]);

  // Build field map dynamically - memoized to prevent unnecessary recalculations
  const fieldMap = useMemo(() => {
    return parentInfoFields.reduce((acc, f) => {
      let field = { ...f };

      // populate dropdowns for father & mother
      if (f.name.includes("Sector"))
        field.options = sectorData?.data?.map((s) => s.name) || [];

      if (f.name.includes("Occupation"))
        field.options = occupationData?.data?.map((o) => o.name) || [];

      acc[f.name] = field;
      return acc;
    }, {});
  }, [sectorData, occupationData]);

  // 💥 Check father Other condition
  const showFatherOther =
    values.fatherSector === "Others" && values.fatherOccupation === "Others";

  // 💥 Check mother Other condition
  const showMotherOther =
    values.motherSector === "Others" && values.motherOccupation === "Others";

  // Use useEffect to clear fields instead of direct setFieldValue in render
  useEffect(() => {
    if (!showFatherOther && values.fatherOther) {
      setFieldValue("fatherOther", "");
    }
  }, [showFatherOther, values.fatherOther, setFieldValue]);

  useEffect(() => {
    if (!showMotherOther && values.motherOther) {
      setFieldValue("motherOther", "");
    }
  }, [showMotherOther, values.motherOther, setFieldValue]);

  // Store fatherSectorId when fatherSector changes
  useEffect(() => {
    if (values.fatherSector && sectorNameToId.has(values.fatherSector)) {
      const id = sectorNameToId.get(values.fatherSector);
      setFieldValue("fatherSectorId", id);
      console.log(`✅ Stored fatherSectorId: ${id} for fatherSector: ${values.fatherSector}`);
    } else if (!values.fatherSector && values.fatherSectorId) {
      setFieldValue("fatherSectorId", null);
    }
  }, [values.fatherSector, sectorNameToId, setFieldValue]);

  // Store fatherOccupationId when fatherOccupation changes
  useEffect(() => {
    if (values.fatherOccupation && occupationNameToId.has(values.fatherOccupation)) {
      const id = occupationNameToId.get(values.fatherOccupation);
      setFieldValue("fatherOccupationId", id);
      console.log(`✅ Stored fatherOccupationId: ${id} for fatherOccupation: ${values.fatherOccupation}`);
    } else if (!values.fatherOccupation && values.fatherOccupationId) {
      setFieldValue("fatherOccupationId", null);
    }
  }, [values.fatherOccupation, occupationNameToId, setFieldValue]);

  // Store motherSectorId when motherSector changes
  useEffect(() => {
    if (values.motherSector && sectorNameToId.has(values.motherSector)) {
      const id = sectorNameToId.get(values.motherSector);
      setFieldValue("motherSectorId", id);
      console.log(`✅ Stored motherSectorId: ${id} for motherSector: ${values.motherSector}`);
    } else if (!values.motherSector && values.motherSectorId) {
      setFieldValue("motherSectorId", null);
    }
  }, [values.motherSector, sectorNameToId, setFieldValue]);

  // Store motherOccupationId when motherOccupation changes
  useEffect(() => {
    if (values.motherOccupation && occupationNameToId.has(values.motherOccupation)) {
      const id = occupationNameToId.get(values.motherOccupation);
      setFieldValue("motherOccupationId", id);
      console.log(`✅ Stored motherOccupationId: ${id} for motherOccupation: ${values.motherOccupation}`);
    } else if (!values.motherOccupation && values.motherOccupationId) {
      setFieldValue("motherOccupationId", null);
    }
  }, [values.motherOccupation, occupationNameToId, setFieldValue]);

  // Sync IDs when labels are present but IDs are missing (for pre-populated data)
  useEffect(() => {
    // Sync fatherSectorId
    if (values.fatherSector && (!values.fatherSectorId || values.fatherSectorId === 0) && sectorNameToId.has(values.fatherSector)) {
      const id = sectorNameToId.get(values.fatherSector);
      setFieldValue("fatherSectorId", id);
      console.log(`✅ Synced fatherSectorId: ${id} for fatherSector: ${values.fatherSector}`);
    }
    
    // Sync fatherOccupationId
    if (values.fatherOccupation && (!values.fatherOccupationId || values.fatherOccupationId === 0) && occupationNameToId.has(values.fatherOccupation)) {
      const id = occupationNameToId.get(values.fatherOccupation);
      setFieldValue("fatherOccupationId", id);
      console.log(`✅ Synced fatherOccupationId: ${id} for fatherOccupation: ${values.fatherOccupation}`);
    }
    
    // Sync motherSectorId
    if (values.motherSector && (!values.motherSectorId || values.motherSectorId === 0) && sectorNameToId.has(values.motherSector)) {
      const id = sectorNameToId.get(values.motherSector);
      setFieldValue("motherSectorId", id);
      console.log(`✅ Synced motherSectorId: ${id} for motherSector: ${values.motherSector}`);
    }
    
    // Sync motherOccupationId
    if (values.motherOccupation && (!values.motherOccupationId || values.motherOccupationId === 0) && occupationNameToId.has(values.motherOccupation)) {
      const id = occupationNameToId.get(values.motherOccupation);
      setFieldValue("motherOccupationId", id);
      console.log(`✅ Synced motherOccupationId: ${id} for motherOccupation: ${values.motherOccupation}`);
    }
  }, [values.fatherSector, values.fatherSectorId, values.fatherOccupation, values.fatherOccupationId, values.motherSector, values.motherSectorId, values.motherOccupation, values.motherOccupationId, sectorNameToId, occupationNameToId, setFieldValue]);

  // 💥 Build dynamic layout
  const dynamicLayout = [
    {
      id: "row1",
      fields: ["fatherName", "fatherMobile", "fatherEmail"],
    },

    {
      id: "row2",
      fields: showFatherOther
        ? ["fatherSector", "fatherOccupation", "fatherOther"]
        : ["fatherSector", "fatherOccupation",""],
    },

    {
      id: "row3",
      fields: ["motherName", "motherMobile", "motherEmail"],
    },

    {
      id: "row4",
      fields: showMotherOther
        ? ["motherSector", "motherOccupation", "motherOther"]
        : ["motherSector", "motherOccupation",""],
    },

    showSibling ? { id: "rowSibling", fields: [] } : null,
  ].filter(Boolean);


  return (
    <div className={styles.clgAppSalePersonalInforWrapper}>
      <div className={styles.clgAppSaleParentsInfoTop}>
        <p className={styles.clgAppSaleParentsHeading}>Parent Information</p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      <div className={styles.clgAppSaleParentInfoBottom}>

        {dynamicLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => (
              <div key={fname} className={styles.clgAppSaleFieldCell}>
                {fname &&
                  renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    onChange: (e) => setFieldValue(fname, e.target.value),
                    error: touched[fname] && errors[fname],
                  })}
              </div>
            ))}
          </div>
        ))}

        {/* Sibling Info */}
        {showSibling && <SiblingInformation onClose={() => setShowSibling(false)} />}

        {/* Buttons */}
        <div className={styles.clgAppSalerow}>
          <div className={styles.clgAppSaleFieldCell}>
            <Button
              buttonname="Upload Annexure"
              variant="upload"
              lefticon={uploadAnnexureIcon}
              width="196px"
            />
          </div>

          <div className={styles.clgAppSaleFieldCell}>
            <Button
              buttonname={
                showSibling ? "Add Another Sibling" : "Add Sibling"
              }
              variant="secondaryWithExtraPadding"
              lefticon={plusIconBlueColor}
              width={showSibling ? "240px" : "194px"}
              onClick={() => setShowSibling(true)}
            />
          </div>

          <div className={styles.clgAppSaleFieldCell}></div>
        </div>
      </div>
    </div>
  );
};

export default ParentInformation;
