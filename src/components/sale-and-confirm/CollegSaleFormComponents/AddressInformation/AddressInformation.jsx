import React, {useState, useEffect, useMemo} from "react";
import { useFormikContext } from "formik";
import styles from "./AddressInformation.module.css";

import {
  addressInformationFields,
  addressInformationFieldsLayout
} from "./addressInformationFields";

import { renderField } from "../../../../utils/renderField";

import {
  useGetPincode,
  useGetMandalsByDistrict,
  useGetCityByDistrict,
} from "../../../../queries/saleApis/clgSaleApis";
import {toTitleCase} from "../../../../utils/toTitleCase";

const AddressInformation = () => {
  const { values, setFieldValue } = useFormikContext();
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);

  /* -------------------------
      API CALL - PINCODE
  ------------------------- */
  // Convert pincode to string and ensure it's 6 digits for API call
  const pincodeString = values.pincode ? String(values.pincode).trim() : "";
  const isValidPincode = pincodeString.length === 6 && /^\d{6}$/.test(pincodeString);
  const { data: pincodeData } = useGetPincode(isValidPincode ? pincodeString : "");

  /* -----------------------------------------------------
      HANDLE PINCODE RESPONSE CORRECTLY (IMPORTANT)
  ------------------------------------------------------ */
  useEffect(() => {
    // pincode must be 6 digits + API must have returned data
    const pincodeValue = values.pincode ? String(values.pincode).trim() : "";
    const isPincodeValid = pincodeValue.length === 6 && /^\d{6}$/.test(pincodeValue);
    
    if (isPincodeValid && pincodeData) {
      console.log("🔍 AddressInfo: pincodeData received →", pincodeData);
      console.log("🔍 AddressInfo: Current pincode value:", pincodeValue);

      // Only update if the data is different to avoid unnecessary re-renders
      const currentState = values.state || "";
      const currentDistrict = values.district || "";
      const newState = pincodeData.stateName || "";
      const newDistrict = pincodeData.districtName || "";

      // Set state and district names if they're different
      if (newState && newState !== currentState) {
        setFieldValue("state", newState);
        console.log("✅ AddressInfo: Set state from pincode:", newState);
      }
      if (newDistrict && newDistrict !== currentDistrict) {
        setFieldValue("district", newDistrict);
        console.log("✅ AddressInfo: Set district from pincode:", newDistrict);
      }
      
      // Store IDs if available
      if (pincodeData.stateId && (!values.stateId || values.stateId !== pincodeData.stateId)) {
        setFieldValue("stateId", pincodeData.stateId);
        console.log("✅ AddressInfo: Set stateId from pincode:", pincodeData.stateId);
      }
      if (pincodeData.districtId && (!values.districtId || values.districtId !== pincodeData.districtId)) {
        setFieldValue("districtId", pincodeData.districtId);
        setSelectedDistrictId(pincodeData.districtId);
        console.log("✅ AddressInfo: Set districtId from pincode:", pincodeData.districtId);
      }
    } else if (!isPincodeValid && values.pincode) {
      // Only reset if pincode was previously valid and now invalid
      // Don't reset if pincode is empty (might be initial state)
      const wasValid = String(values.pincode || "").length === 6;
      if (wasValid) {
        console.log("🔄 AddressInfo: Pincode became invalid, resetting address fields");
        setFieldValue("state", "");
        setFieldValue("district", "");
        setFieldValue("mandal", "");
        setFieldValue("city", "");
        setFieldValue("stateId", "");
        setFieldValue("districtId", "");
        setFieldValue("mandalId", "");
        setFieldValue("cityId", "");
        setSelectedDistrictId(null);
      }
    }
  }, [pincodeData, values.pincode, values.state, values.district, values.stateId, values.districtId, setFieldValue]);

  // Sync selectedDistrictId when districtId is set directly (from auto-population)
  // This is critical to trigger the mandal and city APIs
  useEffect(() => {
    const districtIdValue = values.districtId;
    if (districtIdValue && districtIdValue !== 0 && districtIdValue !== null && districtIdValue !== "") {
      const districtIdNum = Number(districtIdValue);
      if (districtIdNum !== selectedDistrictId && !isNaN(districtIdNum)) {
        setSelectedDistrictId(districtIdNum);
        console.log("🔄 AddressInfo: Set selectedDistrictId from Formik districtId:", districtIdNum, "to trigger mandal/city APIs");
      }
    } else if (!districtIdValue && selectedDistrictId) {
      // Clear selectedDistrictId if districtId is cleared
      setSelectedDistrictId(null);
      console.log("🔄 AddressInfo: Cleared selectedDistrictId");
    }
  }, [values.districtId, selectedDistrictId]);

  console.log("District Id: ", selectedDistrictId);

  /* -------------------------
      FETCH MANDALS & CITY
  ------------------------- */
  // Use effective district ID to ensure API calls work even if state updates are delayed
  const effectiveDistrictId = selectedDistrictId || values.districtId;
  const { data: mandalRaw = [] } = useGetMandalsByDistrict(effectiveDistrictId ? Number(effectiveDistrictId) : null);
  console.log("Mandals: ",mandalRaw)
  const { data: cityRaw = [] } = useGetCityByDistrict(effectiveDistrictId ? Number(effectiveDistrictId) : null);

  /* -------------------------
      OPTIONS
  ------------------------- */
  const mandalOptions = useMemo(
    () => {
      const options = mandalRaw.map((m) => toTitleCase(m.name ?? ""));
      console.log("📋 AddressInfo: Mandal options:", options, "from mandalRaw:", mandalRaw);
      return options;
    },
    [mandalRaw]
  );

  const cityOptions = useMemo(
    () => cityRaw.map((c) => toTitleCase(c.name ?? "")),
    [cityRaw]
  );

  // Create maps for ID lookup
  const mandalNameToId = useMemo(() => {
    const map = new Map();
    mandalRaw.forEach((m) => {
      if (m.name && m.id) {
        map.set(toTitleCase(m.name), m.id);
      }
    });
    return map;
  }, [mandalRaw]);

  const cityNameToId = useMemo(() => {
    const map = new Map();
    cityRaw.forEach((c) => {
      if (c.name && c.id) {
        map.set(toTitleCase(c.name), c.id);
      }
    });
    return map;
  }, [cityRaw]);

  // Sync IDs when labels are present but IDs are missing (for pre-populated data)
  useEffect(() => {
    // Sync stateId if state is present but stateId is missing
    if (values.state && (!values.stateId || values.stateId === 0 || values.stateId === null)) {
      // Try to find state ID from pincode data if available
      if (pincodeData?.stateId) {
        setFieldValue("stateId", pincodeData.stateId);
        console.log("🔄 AddressInfo: Synced stateId from pincodeData:", pincodeData.stateId);
      }
    }
    
    // Sync districtId if district is present but districtId is missing
    if (values.district && (!values.districtId || values.districtId === 0 || values.districtId === null)) {
      // Try to find district ID from pincode data if available
      if (pincodeData?.districtId) {
        setFieldValue("districtId", pincodeData.districtId);
        setSelectedDistrictId(pincodeData.districtId);
        console.log("🔄 AddressInfo: Synced districtId from pincodeData:", pincodeData.districtId);
      }
    }
    
    // Sync mandalId if mandal is present but mandalId is missing
    // Wait for mandal API data to load before syncing
    if (values.mandal && (!values.mandalId || values.mandalId === 0 || values.mandalId === null)) {
      // Only sync if we have mandal data loaded
      if (mandalNameToId.size > 0) {
        const originalMandal = String(values.mandal).trim();
        const mandalLabel = toTitleCase(originalMandal);
        let mandalIdValue = mandalNameToId.get(mandalLabel);
        
        console.log("🔍 AddressInfo: Looking for mandal:", originalMandal, "normalized:", mandalLabel, "in map with", mandalNameToId.size, "entries");
        console.log("🔍 AddressInfo: Available mandal keys:", Array.from(mandalNameToId.keys()));
        
        // Try exact match first
        if (mandalIdValue) {
          setFieldValue("mandalId", mandalIdValue);
          // Also ensure the mandal value matches the dropdown format (toTitleCase)
          if (values.mandal !== mandalLabel) {
            setFieldValue("mandal", mandalLabel);
            console.log("🔄 AddressInfo: Updated mandal value to match dropdown format:", mandalLabel);
          }
          console.log("✅ AddressInfo: Synced mandalId (exact match):", mandalIdValue, "for mandal:", mandalLabel);
        } else {
          // Try case-insensitive match
          let found = false;
          for (const [key, id] of mandalNameToId.entries()) {
            if (key.toLowerCase() === mandalLabel.toLowerCase()) {
              setFieldValue("mandalId", id);
              setFieldValue("mandal", key); // Update to exact match from dropdown
              console.log("✅ AddressInfo: Synced mandalId (case-insensitive):", id, "for mandal:", originalMandal, "matched with:", key);
              found = true;
              break;
            }
          }
          
          // If still not found, try without toTitleCase
          if (!found) {
            for (const [key, id] of mandalNameToId.entries()) {
              if (key.toLowerCase() === originalMandal.toLowerCase() || 
                  toTitleCase(key).toLowerCase() === originalMandal.toLowerCase()) {
                setFieldValue("mandalId", id);
                setFieldValue("mandal", key); // Update to exact match from dropdown
                console.log("✅ AddressInfo: Synced mandalId (alternative match):", id, "for mandal:", originalMandal, "matched with:", key);
                found = true;
                break;
              }
            }
          }
          
          if (!found) {
            console.warn("⚠️ AddressInfo: Could not find mandalId for:", originalMandal, "Available options:", Array.from(mandalNameToId.keys()));
          }
        }
      } else {
        console.log("⏳ AddressInfo: Waiting for mandal API data to load. selectedDistrictId:", selectedDistrictId, "districtId:", values.districtId, "mandalRaw length:", mandalRaw.length, "effectiveDistrictId:", effectiveDistrictId);
      }
    }
    
    // Sync cityId if city is present but cityId is missing
    // Wait for city API data to load before syncing
    if (values.city && (!values.cityId || values.cityId === 0 || values.cityId === null)) {
      // Only sync if we have city data loaded
      if (cityNameToId.size > 0) {
        const cityLabel = toTitleCase(values.city);
        const cityIdValue = cityNameToId.get(cityLabel);
        if (cityIdValue) {
          setFieldValue("cityId", cityIdValue);
          console.log("🔄 AddressInfo: Synced cityId:", cityIdValue, "for city:", values.city);
        } else {
          // Try case-insensitive match
          for (const [key, id] of cityNameToId.entries()) {
            if (key.toLowerCase() === cityLabel.toLowerCase()) {
              setFieldValue("cityId", id);
              console.log("🔄 AddressInfo: Synced cityId (case-insensitive):", id, "for city:", values.city);
              break;
            }
          }
        }
      } else {
        console.log("⏳ AddressInfo: Waiting for city API data to load before syncing cityId");
      }
    }
  }, [
    values.state, 
    values.district, 
    values.mandal, 
    values.city, 
    values.stateId, 
    values.districtId, 
    values.mandalId, 
    values.cityId, 
    pincodeData, 
    mandalNameToId, 
    cityNameToId, 
    setFieldValue,
    mandalRaw.length,
    cityRaw.length,
    selectedDistrictId, // Add to ensure sync runs when districtId changes
    mandalRaw, // Add to ensure sync runs when mandal data loads
    cityRaw, // Add to ensure sync runs when city data loads
  ]);

  /* -------------------------
      FIELD MAP
  ------------------------- */
  const fieldMap = useMemo(() => {
    const map = {};

    addressInformationFields.forEach((f) => {
      map[f.name] = { ...f };

      if (f.name === "mandal") map[f.name].options = mandalOptions;
      if (f.name === "city") map[f.name].options = cityOptions;
    });

    return map;
  }, [mandalOptions, cityOptions]);

  return (
    <div className={styles.clgAppSaleAddressInfoWrapper}>
      <div className={styles.clgAppSaleAddressInfoTop}>
        <p className={styles.clgAppSaleAddressHeading}>Address Information</p>
        <div className={styles.clgAppSalePersonalInfoSeperationLine}></div>
      </div>

      <div className={styles.clgAppSaleAddressInfoBottom}>
        {addressInformationFieldsLayout.map((row) => (
          <div key={row.id} className={styles.clgAppSalerow}>
            {row.fields.map((fname) => {
              if (!fname) return null;
              return (
                <div key={fname} className={styles.clgAppSaleFieldCell}>
                  {renderField(fname, fieldMap, {
                    value: values[fname] ?? "",
                    onChange: (e) => {
                      const selectedValue = e.target.value;
                      console.log(`🔄 Address Field ${fname} changed to:`, selectedValue);
                      setFieldValue(fname, selectedValue);
                      
                      // Store IDs when dropdowns are selected
                      if (fname === "mandal" && mandalNameToId.has(selectedValue)) {
                        const id = mandalNameToId.get(selectedValue);
                        console.log(`✅ Storing mandalId: ${id}`);
                        setFieldValue("mandalId", id);
                      } else if (fname === "city" && cityNameToId.has(selectedValue)) {
                        const id = cityNameToId.get(selectedValue);
                        console.log(`✅ Storing cityId: ${id}`);
                        setFieldValue("cityId", id);
                      }
                    },
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressInformation;
