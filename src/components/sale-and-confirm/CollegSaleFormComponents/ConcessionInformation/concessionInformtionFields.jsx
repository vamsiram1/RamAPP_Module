export const concessionInformationFields = [
  {
    name: "firstYearConcession",
    label: "1st Year Concession",
    type: "text",
    disabled: false,
    inputRule: "digits",
    maxLength: "5",
    placeholder: "Enter 1st Year Concession",
  },
  {
    name: "secondYearConcession",
    label: "2nd Year Concession",
    type: "text",
    disabled: false,
    inputRule: "digits",
    maxLength: "5",
    placeholder: "Enter 2nd Year Concession",
  },
  {
    name: "referredBy",
    label: "Referred By",
    options: ["Type-1", "Type-2"],
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    disabled: false,
    inputRule: "alpha",
    maxLength: "20",
    placeholder: "Enter Description",
  },
  {
    name: "authorizedBy",
    label: "Authorized By",
    options: ["Type-1", "Type-2"],
  },
  {
    name: "concessionReason",
    label: "Concession Reason",
    type: "select",
    options: [], // Will be populated from API
    disabled: false,
    placeholder: "Select Concession Reason",
  },
];

export const concessionInformationFieldsLayout = [
  {
    id: "row1",
    fields: ["firstYearConcession", "secondYearConcession", "referredBy"],
  },
  { id: "row2", fields: ["description", "authorizedBy", "concessionReason"] },
];
