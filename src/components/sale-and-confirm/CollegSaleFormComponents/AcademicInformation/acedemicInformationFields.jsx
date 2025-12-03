// ============================
// MASTER FIELD DEFINITIONS
// ============================
export const academicFields = [
  {
    name: "hallTicketNo",
    label: "Hall Ticket Number",
    type: "text",
    disabled: false,
    inputRule:"hallticket",
    maxLength:"12",
    placeholder: "Enter Hall Ticket Number",
  },
 
  {
    name: "schoolState",
    label: "School State",
    options: ["State-1", "State-2"],
  },
  {
    name: "schoolDistrict",
    label: "School District",
    options: ["District-1", "District-2"],
  },
  { name: "schoolType", label: "School Type", options: ["Type-1", "Type-2"] },
  {
    name: "schoolName",
    label: "School Name",
    options: ["School-1", "School-2"],
  },
 
  {
    name: "tenthHallTicketNo",
    label: "10th Hall Ticket No",
    type: "text",
    inputRule:"hallticket",
        maxLength:"12",
    placeholder: "Enter 10th Hall Ticket No",
  },
  {
    name: "interFirstYearHallTicketNo",
    label: "Inter 1st Year Hall Ticket No",
    type: "text",
    inputRule:"hallticket",
        maxLength:"12",
    placeholder: "Enter Inter 1st Year Hall Ticket No",
  },
 
  {
    name: "interHallTicketNo",
    label: "Inter Hall Ticket No",
    type: "text",
    inputRule:"hallticket",
        maxLength:"12",
    placeholder: "Enter Inter Hall Ticket No",
  },
 
  { name: "clgState", label: "College State", options: ["State-1", "State-2"] },
  {
    name: "clgDistrict",
    label: "College District",
    options: ["District-1", "District-2"],
  },
  { name: "clgType", label: "College Type", options: ["Type-1", "Type-2"] },
 
  {
    name: "collegeName",
    label: "College Name",
    options: ["College-1", "College-2"],
  },
 
  { name: "scoreAppNo", label: "Score App No", type: "text",inputRule:"digitsOnly",maxLength:"8",placeholder:"Enter Score App Number", disabled: false},
  { name: "scoreMarks", label: "Score Marks", type: "text",inputRule:"digitsOnly",maxLength:"3",placeholder:"Enter Score Marks", disabled: false },
 
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
 
// ============================
// LAYOUT DEFINITIONS
// ============================
export const academicLayouts = {
  "INTER1": [
    ["hallTicketNo", "schoolState", "schoolDistrict"],
    ["schoolType", "schoolName", "scoreAppNo"],
    ["scoreMarks", "", ""],
  ],
 
  "INTER2": [
    ["tenthHallTicketNo", "interFirstYearHallTicketNo", "clgState"],
    ["clgDistrict", "clgType", "collegeName"],
    ["scoreAppNo", "scoreMarks", ""],
  ],
 
  "LONG_TERM": [
    ["interHallTicketNo", "clgState", "clgDistrict"],
    ["clgType", "collegeName", "scoreAppNo"],
    ["scoreMarks", "", ""],
  ],
 
  "SHORT_TERM": [
    ["interHallTicketNo", "clgState", "clgDistrict"],
    ["clgType", "collegeName", "scoreAppNo"],
    ["scoreMarks", "", ""],
  ],
  "": [
    ["hallTicketNo", "schoolState", "schoolDistrict"],
    ["schoolType", "schoolName", "scoreAppNo"],
    ["scoreMarks", "", ""],
  ],
 
  // COMMON rows for ALL orientation types
  // common: [
  //   ["scoreAppNo", "", ""],
  //   ["scoreMarks", "foodType", "bloodGroup"],
  //   ["caste", "religion", ""],
  // ],
};
 
// ============================
// DYNAMIC LAYOUT SELECTOR
// ============================
export const getAcademicLayout = (joiningClass) => {
  if (!joiningClass) return academicLayouts[""];  // default
 
  return academicLayouts[joiningClass] || academicLayouts[""];
};
