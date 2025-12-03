import Dropdown from "../widgets/Dropdown/Dropdown";
import Inputbox from "../widgets/Inputbox/InputBox";
import Textarea from "../widgets/Textarea/Textarea";

export const renderField = (fieldName, fieldMap, extraProps = {}) => {
  const field = fieldMap[fieldName];
  if (!field) return null;

  // Custom component (Gender, PhoneNumberBox, DatePicker etc.)
  if (field.component) {
    const ComponentToRender = field.component;
    return (
      <ComponentToRender
        key={field.name}
        name={field.name}
        label={field.label}
        placeholder={field.placeholder}
        {...extraProps}
      />
    );
  }

  // Text input
  if (field.type === "text") {
    return (
      <Inputbox
        key={field.name}
        label={field.label}
        name={field.name}
        placeholder={field.placeholder}
        disabled={field.disabled || false}
        readOnly={field.readOnly || false}
        required={field.required || false}
        inputRule={field.inputRule}
        autoCapitalize={field.autoCapitalize}
        maxLength={field.maxLength}
        {...extraProps}
      />
    );
  }

  // Textarea input
  if (field.type === "textarea") {
    return (
      <Textarea
        key={field.name}
        label={field.label}
        name={field.name}
        placeholder={field.placeholder}
        rows={field.rows || 4}
        {...extraProps}
      />
    );
  }

  // Dropdown
  if (field.options && Array.isArray(field.options)) {
    return (
      <Dropdown
        key={field.name}
        dropdownname={field.label}
        name={field.name}
        results={field.options}
        {...extraProps}
        disabled={field.disabled || false}
        required={field.required || false}
      />
    );
  }

  return null;
};
