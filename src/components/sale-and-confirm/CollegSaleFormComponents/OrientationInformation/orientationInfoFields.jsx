export const orientationInfoFields = [
  {
    name: "academicYear",
    label: "Academic Year",
    type: "text",
      readOnly: true,
  disabled: false,
    placeholder: "Academic Year",
  },
  {
    name: "campusName",
    label: "Branch Name",
    options: [], // dynamic will replace
  },
  {
    name: "branchType",
    label: "Branch Type",
    options: ["Type-1", "Type-2"],
  },
  {
    name: "city",
    label: "City",
    options: [], // dynamic will replace
  },
  {
    name: "joiningClass",
    label: "Joining Class",
    options: [], // dynamic will replace
  },
  {
    name: "orientationName",
    label: "Course Name",
    options: [], // dynamic will replace
  },
  {
    name: "studentType",
    label: "Student Type",
    options: [], // dynamic will replace
  },
  {
    name: "orientationStartDate",
    label: "Course Start Date",
    type: "text",
      readOnly: true,
  disabled: false,
    placeholder: "Course Start Date",
  },
  {
    name: "orientationEndDate",
    label: "Course End Date",
    type: "text",
      readOnly: true,
  disabled: false,
    placeholder: "Course End Date",
  },
  {
    name: "orientationFee",
    label: "Course Fee",
    type: "text",
      readOnly: true,
  disabled: false,
    placeholder: "Course Fee",
  },
  {
    name: "orientationBatch",
    label: "Orientation Batch",
    options: ["Type-1", "Type-2"],
  },
];
 
export const orientationInfoFieldsLayout = [
  { id: "row1", fields: ["academicYear", "city", "campusName"] },
  { id: "row2", fields: ["joiningClass", "orientationName", "studentType"] },
  { id: "row3", fields: ["orientationStartDate", "orientationEndDate", "orientationFee"] },
];
