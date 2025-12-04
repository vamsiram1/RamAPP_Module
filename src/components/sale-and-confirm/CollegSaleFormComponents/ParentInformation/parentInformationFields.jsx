import PhoneNumberBox from "../../../../widgets/PhoneNumber/PhoneNumberBox";

export const parentInfoFields =[

  // FATHER
  { name: "fatherName", label: "Father Name", type: "text",placeholder:"Enter Father Name", inputRule: "onlyLettersSingleSpace",
    autoCapitalize: true, },
  { name: "fatherMobile", label: "Mobile Number", component: PhoneNumberBox },
  { name: "fatherEmail", label: "Email", type: "text",inputRule: "email",placeholder:"Enter Father Email"  },

  { name: "fatherSector", label: "Sector", options: [] },
  { name: "fatherOccupation", label: "Occupation", options: [] },
  { name: "fatherOther", label: "Other", type: "text",placeholder:"Enter Other",inputRule: "alpha",
    autoCapitalize: true, },

  // MOTHER
  { name: "motherName", label: "Mother Name", type: "text",placeholder:"Enter Mother Name", inputRule: "onlyLettersSingleSpace",
    autoCapitalize: true,  },
  { name: "motherMobile", label: "Mobile Number", component: PhoneNumberBox },
  { name: "motherEmail", label: "Email", type: "text",inputRule: "email",placeholder:"Enter Mother Email"  },

  { name: "motherSector", label: "Sector", options: [] },
  { name: "motherOccupation", label: "Occupation", options: [] },
  { name: "motherOther", label: "Other", type: "text",placeholder:"Enter Other",inputRule: "alpha",
    autoCapitalize: true, },

];


export const siblingsInformationFields=[
   {
    name: "fullName",
    label: "Full Name",
    type: "text",
    disabled: false,
    inputRule: "onlyLettersSingleSpace",
    placeholder: "Enter Full Name",
    autoCapitalize: true, 
  },
   {
    name:"relationType",
    label:"Relation Type",
    options:["Type-1","Type-2"],
  },
   {
    name:"selectClass",
    label:"Select Class",
    options:["Type-1","Type-2"],
  },
   {
    name: "schoolName",
    label: "School Name",
    type: "text",
    disabled: false,
    inputRule: "none",
    autoCapitalize: true,
    placeholder: "Enter School Name",
  },
   {
    name:"gender",
    label:"Select Gender",
    options:["Type-1","Type-2"],
  },
]

export const parentInfoFieldsLayout = [

  // FATHER
  { id: "row1", fields: ["fatherName", "fatherMobile", "fatherEmail"] },
  { id: "row2", fields: ["fatherSector", "fatherOccupation", "fatherOther"] },

  // MOTHER
  { id: "row3", fields: ["motherName", "motherMobile", "motherEmail"] },
  { id: "row4", fields: ["motherSector", "motherOccupation", "motherOther"] },

];

export const siblingFieldsLayout = [
  {id:"row1", fields:["fullName","relationType","selectClass"]},
  {id:"row2", fields:["schoolName","gender",""]}
]

export const parentInfoFieldsLayoutForSchool = [
  {id:"row1", fields: ["fatherName","fatherMobile",""]}
]
