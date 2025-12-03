export const orientationInfoFieldsForSchool =[
  {
    name: "academicYear",
    label: "Academic Year",
    type: "text",
    disabled: true,
    placeholder: "Academic Year",
  },
   {
    name:"studentType",
    label:"Student Type",
    options:["Type-1","Type-2"],
  },
  {
    name:"joiningClass",
    label:"Joining Class",
    options:["Type-1","Type-2"],
  },
  {
    name:"orientationName",
    label:"Course Name",
    options:["Type-1","Type-2"],
  },
  {
    name: "branchName",
    label: "Branch Name",
    type: "text",
    disabled: true,
    placeholder: "Enter Branch Name",
  },
  {
    name: "branchType",
    label: "Branch Type",
    type: "text",
    disabled: true,
    placeholder: "Enter Branch Type",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    disabled: true,
    placeholder: "Enter City",
  },
]
 
export const orientationInfoFieldsLayoutForSchool = [
    {id:"row1", fields:["academicYear","branchName","branchType"]},
    {id:"row2", fields:["city","studentType","joiningClass"]},
    {id:"row3", fields:["orientationName","",""]},
]
