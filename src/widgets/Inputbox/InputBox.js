import React from "react";
import styles from "./InputBox.module.css";
import Asterisk from "../../assets/application-status/Asterisk";
import { validateAadhaar } from "../../utils/validateAadhaar";

// ---------------------- REGEX PATTERNS ---------------------- //
const patterns = {
  alpha: /^[A-Za-z ]*$/, // alphabets + multiple spaces allowed
  digits: /^[0-9]*$/, // only digits
  alphanumeric: /^[A-Za-z0-9 ]*$/,

  // LIVE TYPING FRIENDLY - one space between names
  onlyLettersSingleSpace: /^$|^[A-Za-z]+(?: [A-Za-z]*)?$/, // only one space between words

  // email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
  email: /^$|^[A-Za-z0-9][A-Za-z0-9._%+-]*(@[A-Za-z0-9]*)?(\.[A-Za-z0-9]*)*$/,
  aapar: /^(?![01])[0-9]{12}$/, // 12 digits, first digit not 0 or 1
  aadhaar: /^$|^[2-9][0-9]{0,11}$/, // first digit 2-9

  doorNo: /^$|^[A-Za-z0-9\/\-\$#\.]+$/, // door formats
  area: /^$|^[A-Za-z0-9 ,]+$/, // alphanumeric + comma + space

  digitsOnly: /^$|^[0-9]+$/, // strict digits only
  noSpecialNoDigits: /^[A-Za-z]+(?: [A-Za-z]+)*$/, // names, no digits, no specials

  address: /^[A-Za-z0-9\-\/#& ]*$/, // existing address rule
  none: /.*/, // allow anything
  hallticket: /^[A-Za-z0-9]*$/,
};

const Inputbox = ({
  label,
  id,
  name,
  placeholder,
  onChange,
  value,
  inputRule = "none",
  autoCapitalize = false,
  maxLength = null,
  type = "text",
  disabled = false,
  required = false,
  error,
  readOnly = false,
}) => {
  const handleInput = (e) => {
    let val = e.target.value;

    // pick pattern safely
    const regex = patterns[inputRule] || patterns.none;

    // max length block
    if (maxLength && val.length > maxLength) return;

    // block invalid characters
    if (!regex.test(val)) return;

    // cleanup double spaces for alpha
    if (inputRule === "alpha") {
      val = val.replace(/\s\s+/g, " ");
    }

    // auto-capitalize first letter
    if (autoCapitalize && val.length > 0) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }

    if (inputRule === "aadhaar" && val.length === 12) {
      const isValid = validateAadhaar(val);

      if (!isValid) {
        onChange({
          target: { name, value: val },
          aadhaarError: "Invalid Aadhaar number",
        });
        return;
      }
    }

    onChange({ target: { name, value: val } });
  };

  return (
    <div className={styles.inputbox_wrapper}>
      <label htmlFor={name} className={styles.label_container}>
        {label}
        {required && <Asterisk style={{ marginLeft: "4px" }} />}
      </label>

      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={readOnly ? undefined : handleInput}
        className={styles.input_box}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength || undefined}
      />

      {error && <p className={styles.errormessage}>{error}</p>}
    </div>
  );
};

export default Inputbox;
