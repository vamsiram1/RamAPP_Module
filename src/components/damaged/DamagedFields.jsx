import Inputbox from "../../widgets/Inputbox/InputBox";
import Dropdown from "../../widgets/Dropdown/Dropdown";
 
export const damagedFields = [
    {
        name: "applicationNo",
        label: "Application No",
        type: "text",
        disabled: false,
        inputRule: "digits",
        maxLength: "10",
        required:true,
        placeholder: "Enter Application No",
      },
      {
        name: "zoneName",
        label: "Zone Name",
        type: "text",
        disabled: true,
        placeholder: "Zone Name",
      },
      {
        name: "proName",
        label: "PROName",
        type: "text",
        disabled: true,
        placeholder: "PRO Name",
      },
      {
        name: "dgmName",
        label: "DGM Name",
        type: "text",
        disabled: true,
        placeholder: "DGM Name",
      },
      {
        name: "campusName",
        label: "Branch Name",
        type: "text",
        disabled: true,
        placeholder: "Branch Name",
      },
      {
        name: "applicationStatus",
        label: "Select Status of Application",
        required:true,
        options: ["Type-1", "Type-2"],
      },
      {
        name: "reason",
        label: "Reason",
        type: "textarea",
        disabled: false,
        placeholder: "Enter Reason",
      },
]
 
export const damagedFieldsLayout = [
    {id:"row1", fields:["applicationNo","zoneName","dgmName"]},
    {id:"row2", fields:["campusName","proName","applicationStatus"]},
    {id:"row3", fields:["reason"]},
]
 
 