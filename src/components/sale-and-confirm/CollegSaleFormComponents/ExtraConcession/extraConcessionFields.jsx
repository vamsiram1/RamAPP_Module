export const extraConcessionFeilds = [
  {
    name: "concessionAmount",
    label: "Concession Amount",
    type: "text",
    disabled: false,
    inputRule: "digits",
    maxLength: "5",
    placeholder: "Enter Concession Amount",
  },
  {
    name: "reason",
    label: "Reason",
    type: "text",
    disabled: false,
    inputRule: "alpha",
    maxLength: "20",
    placeholder: "Enter Reason",
  },
  {
    name: "concessionReferredBy",
    label: "Concession Referred By",
    options: ["Type-1", "Type-2"],
  },
];

export const extraConcessionFieldsLayout = [
  {
    id: "row1",
    fields: ["concessionAmount", "concessionReferredBy", "reason"],
  },
];
