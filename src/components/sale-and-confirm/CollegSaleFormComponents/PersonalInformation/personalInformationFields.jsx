import Gender from "../../../../widgets/GenderWidget/Gender";
import DatePicker from "../../../../widgets/DateWidgets/DatePicker/DatePicker";

export const personalInfoFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    disabled: false,
    placeholder: "Enter First Name",
    inputRule: "onlyLettersSingleSpace",
    autoCapitalize: true,
  },
  {
    name: "surName",
    label: "Surname / Last Name",
    type: "text",
    disabled: false,
    placeholder: "Enter Surname / Last Name",
    inputRule: "onlyLettersSingleSpace",
    autoCapitalize: true,
  },
  {
    name: "gender",
    label: "Gender",
    component: Gender,
  },
  {
    name: "aaparNo",
    label: "Apaar No",
    type: "text",
    disabled: false,
    placeholder: "Enter Aapar No",
    inputRule: "digits",
    maxLength:"12"
  },
  {
    name: "dob",
    label: "Date of Birth",
    component: DatePicker,
  },
  {
    name: "aadharCardNo",
    label: "Aadhar Card No",
    type: "text",
    disabled: false,
    placeholder: "Enter Aadhar Card No",
    inputRule: "aadhaar",
    maxLength:"12"
  },
  {
    name: "quotaAdmissionReferredBy",
    label: "Quota/Admission Referred By",
    options: [
      "Staff",
      "Management",
      "NRI",
      "J&K",
      "Foreign",
      "Sports",
      "PH",
      "Defence",
      "SC/ST/OBC",
    ],
  },
  {
    name: "employeeId",
    label: "Employee ID",
    options: [
      "Employee1 - ID1",
      "Employee2 - ID2",
      "Employee3 - ID3",
      "Employee4 - ID4",
    ],
  },
  {
    name: "admissionType",
    label: "Admission Type",
    options: ["With Pro", "Direct Walk-in"],
  },
  {
    name: "proReceiptNo",
    label: "PRO Receipt No",
    type: "text",
    disabled: false,
    placeholder: "Enter PRO Receipt No",
     inputRule: "digits",
      maxLength:"9",
  },
  { name: "foodType", label: "Food Type", options: ["Veg", "Non-Veg"] },
  {
    name: "bloodGroup",
    label: "Blood Group",
    options: ["A+", "A-", "B+", "O+", "AB+"],
  },
  { name: "caste", label: "Caste", options: ["OC", "BC", "SC", "ST"] },
  {
    name: "religion",
    label: "Religion",
    options: ["Hindu", "Muslim", "Christian"],
  },
];

export const personalInfoFieldsLayout = [
  { id: "row1", fields: ["firstName", "surName", ""] },
  { id: "row2", fields: ["gender", "aaparNo", ""] },
  { id: "row3", fields: ["dob", "aadharCardNo", "quotaAdmissionReferredBy"] },
  { id: "row4", fields: ["employeeId", "admissionType", "foodType"] },
  { id: "row5", fields: ["bloodGroup", "caste", "religion"] },
];

export const personalInfoFastSaleFieldsLayout = [
  { id: "row1", fields: ["firstName", "surName", ""] },
  { id: "row2", fields: ["gender", "aaparNo", ""] },
  { id: "row3", fields: ["dob", "aadharCardNo", "quotaAdmissionReferredBy"] },
  { id: "row4", fields: ["employeeId", "admissionType", ""] },
];

export const personalInfoFieldsLayoutForSchool = [
  { id: "row1", fields: ["firstName", "surName", ""] },
  { id: "row2", fields: ["gender", "aaparNo", ""] },
  { id: "row3", fields: ["dob", "aadharCardNo", "quotaAdmissionReferredBy"] },
  { id: "row4", fields: ["employeeId", "admissionType", "proReceiptNo"] },
];
