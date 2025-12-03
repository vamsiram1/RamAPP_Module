import React from "react";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../widgets/Dropdown/Dropdown";
import styles from "./CollegeOrientInfoForms.module.css";
import useOrientationFormState from "./hooks/useOrientationFormState";

const CollegeAcademicConfForms = ({ academicYear, academicYearId, onDataChange, overviewData, prePopulatedData }) => {
  const state = useOrientationFormState({ academicYear, onDataChange, overviewData });

  return (
    <div className={styles.section}>
      {/* Title */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Orientation Information</span>
        <div className={styles.line}></div>
      </div>

      <div className={styles.grid}>
        {/* Row 1: Academic Year, City, Branch */}
        <Inputbox
          label="Academic Year"
          name="academicYear"
          placeholder="Academic Year"
          value={state.academicYearValue}
          disabled={true}
          readOnly={true}
          style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
        />

        <Dropdown
          dropdownname="City"
          name="city"
          results={state.citiesLoading ? ["Loading..."] : state.cityOptions.length > 0 ? state.cityOptions : ["No cities available"]}
          onChange={state.handleCityChange}
          value={state.selectedCityName}
        />

        <Dropdown
          dropdownname="Branch"
          name="branch"
          results={!state.selectedCityName ? ["Select a city first"] : state.campusesLoading ? ["Loading..."] : state.branchOptions.length > 0 ? state.branchOptions : ["No branches available"]}
          onChange={state.handleBranchChange}
          value={state.selectedBranchName}
        />

        {/* Row 2: Joining Class, Course Name, Student Type */}
        <Dropdown
          dropdownname="Joining Class"
          name="joiningClass"
          results={!state.selectedBranchName ? ["Select a branch first"] : state.classesLoading ? ["Loading..."] : state.classOptions.length > 0 ? state.classOptions : ["No classes available"]}
          onChange={state.handleClassChange}
          value={state.selectedClassName}
        />

        <Dropdown
          dropdownname="Course Name"
          name="courseName"
          results={!state.selectedClassName ? ["Select a branch and class first"] : state.orientationsLoading ? ["Loading..."] : state.orientationOptions.length > 0 ? state.orientationOptions : ["No courses available"]}
          onChange={state.handleOrientationChange}
          value={state.selectedCourseName}
        />

        <Dropdown
          dropdownname="Student Type"
          name="studentType"
          results={!state.selectedCourseName ? ["Select a branch and course first"] : state.studentTypesLoading ? ["Loading..."] : state.studentTypeOptions.length > 0 ? state.studentTypeOptions : ["No student types available"]}
          onChange={state.handleStudentTypeChange}
          value={state.selectedStudentType}
        />

        {/* Row 3: Course Start Date, Course End Date, Course Fee */}
        <Inputbox label="Course Start Date" name="courseStartDate" placeholder="Course Start Date" type="date" value={state.courseStartDate} readOnly />

        <Inputbox label="Course End Date" name="courseEndDate" placeholder="Course End Date" type="date" value={state.courseEndDate} readOnly />

        <Inputbox label="Course Fee" name="courseFee" placeholder="Course Fee" value={state.courseFee} readOnly />
      </div>
    </div>
  );
};

export default CollegeAcademicConfForms;
