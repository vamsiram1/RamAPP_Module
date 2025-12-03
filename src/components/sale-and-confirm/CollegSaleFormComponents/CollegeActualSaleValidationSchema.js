import * as Yup from "yup";

// ---------------------- REGEX ---------------------- //
const onlyLettersSingleSpace = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

const aaparRegex = /^(?![01])[0-9]{12}$/;
const aadharRegex = /^[2-9]{1}[0-9]{11}$/;

const doorNoRegex = /^[A-Za-z0-9\-\/#& ]+$/;
const areaRegex = /^[A-Za-z0-9 ,]+$/;

const digitsOnlyRegex = /^[0-9]+$/;
const noSpecialNoDigitsRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

// 15+ AGE CHECK
const MIN_AGE = 15;
const validateAge15Plus = (date) => {
  if (!date) return false;
  const dob = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  return age > MIN_AGE || (age === MIN_AGE && m >= 0);
};

const clgActualSaleValidationSchema = (maxConcessionLimit = 999999) =>
  Yup.object().shape({
    // ===================================================
    // PERSONAL INFORMATION
    // ===================================================
    firstName: Yup.string()
      .trim()
      // .required("First name is required")
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only"),

    surName: Yup.string()
      .trim()
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only")
      .nullable(),

    gender: Yup.string().required("Gender is required"),

    aaparNo: Yup.string()
      .nullable()
      .test(
        "aaparCheck",
        "Aapar must be 12 digits and cannot start with 0 or 1",
        (val) => !val || aaparRegex.test(val)
      ),

    dob: Yup.date()
      .required("Date of birth is required")
      .test("ageCheck", "Must be 15 years or above", validateAge15Plus),

    aadharCardNo: Yup.string()
      // .required("Aadhar number is required")
      .matches(/^[0-9]{12}$/, "Aadhar must be 12 digits")
      .matches(aadharRegex, "Invalid Aadhar number"),

    quotaAdmissionReferredBy: Yup.string().nullable(),

    employeeId: Yup.string()
      .nullable()
      .when("quotaAdmissionReferredBy", {
        is: (val) => val === "Staff",
        then: (schema) => schema.required("Employee ID is required for Staff quota"),
      }),

    admissionType: Yup.string().required("Admission type is required"),

    // ===================================================
    // PARENT INFORMATION
    // ===================================================
    fatherName: Yup.string()
      .trim()
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only")
      .nullable(),

    mobileNumber: Yup.string().required("Mobile number is required"),

    email: Yup.string().trim().nullable().matches(emailRegex, "Invalid email format"),

    sector: Yup.string().nullable(),
    occupation: Yup.string().nullable(),

    other: Yup.string()
      .nullable()
      .when("sector", {
        is: (v) => v === "Other",
        then: (s) => s.required("Other field is required when sector is Other"),
      }),

    motherName: Yup.string()
      .trim()
      .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only")
      .nullable(),

    // ===================================================
    // ORIENTATION INFORMATION
    // ===================================================
    city: Yup.string().required("City is required"),
    branchName: Yup.string().required("Branch is required"),
    joiningClass: Yup.string().required("Joining class is required"),
    orientationName: Yup.string().required("Course name is required"),
    studentType: Yup.string().required("Student type is required"),

    academicYear: Yup.string().nullable(),
    orientationStartDate: Yup.string().nullable(),
    orientationEndDate: Yup.string().nullable(),
    orientationFee: Yup.string().nullable(),
    orientationBatch: Yup.string().nullable(),

    // ===================================================
    // ADDRESS INFORMATION
    // ===================================================
    doorNo: Yup.string().nullable().matches(doorNoRegex, "Only letters, numbers and - / # & allowed"),

    streetName: Yup.string()
      .nullable()
      .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
      .max(20, "Maximum 20 characters allowed"),

    landmark: Yup.string()
      .nullable()
      .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
      .max(20, "Maximum 20 characters allowed"),

    area: Yup.string().nullable().matches(areaRegex, "Only letters, numbers and comma allowed"),

    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),

    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    mandal: Yup.string().required("Mandal is required"),
    cityAddress: Yup.string().nullable(),
    gpin: Yup.string().nullable(),

    // ===================================================
    // SIBLING INFORMATION
    // ===================================================
    siblings: Yup.array().of(
      Yup.object().shape({
        fullName: Yup.string()
          .trim()
          .matches(onlyLettersSingleSpace, "Only alphabets allowed, single space only")
          .required("Sibling full name is required"),

        relationType: Yup.string().required("Relation type is required"),
        selectClass: Yup.string().required("Select class is required"),

        schoolName: Yup.string().trim().required("School name is required").max(200, "Too long"),

        gender: Yup.string().required("Gender is required"),
      })
    ),

    // ===================================================
    // CONCESSION INFORMATION
    // ===================================================
    firstYearConcession: Yup.string()
      .nullable()
      .matches(digitsOnlyRegex, "Only digits allowed"),

    secondYearConcession: Yup.string()
      .nullable()
      .matches(digitsOnlyRegex, "Only digits allowed"),

    description: Yup.string()
      .nullable()
      .matches(noSpecialNoDigitsRegex, "Only alphabets allowed, single space only")
      .when(["firstYearConcession", "secondYearConcession"], {
        is: (f, s) => !!f || !!s,
        then: (schema) => schema.required("Description is required"),
      }),

    referredBy: Yup.string().nullable(),

    authorizedBy: Yup.string().nullable(),

    concessionReason: Yup.string()
      .nullable()
      .matches(noSpecialNoDigitsRegex, "Only alphabets allowed, single space only")
      .test(
        "sum-check",
        `Total concession cannot exceed ${maxConcessionLimit}`,
        function () {
          const first = Number(this.parent.firstYearConcession || 0);
          const second = Number(this.parent.secondYearConcession || 0);
          return first + second <= maxConcessionLimit;
        }
      ),

    // ===================================================
    // ACADEMIC INFORMATION (COMMON)
    // ===================================================
    hallTicketNo: Yup.string().nullable(),
    tenthHallTicketNo: Yup.string().nullable(),
    interFirstYearHallTicketNo: Yup.string().nullable(),
    interHallTicketNo: Yup.string().nullable(),

    schoolState: Yup.string().nullable(),
    schoolDistrict: Yup.string().nullable(),
    schoolType: Yup.string().nullable(),
    schoolName: Yup.string().nullable(),

    clgState: Yup.string().nullable(),
    clgDistrict: Yup.string().nullable(),
    clgType: Yup.string().nullable(),
    collegeName: Yup.string().nullable(),

    scoreAppNo: Yup.string().nullable().matches(/^[0-9]+$/, "Score App No must contain digits only"),
    scoreMarks: Yup.string().nullable().matches(/^[0-9]+$/, "Score Marks must contain digits only"),

    // ===================================================
    // DYNAMIC ACADEMIC RULES
    // ===================================================
    // 🔵 Inter 1
    schoolState: Yup.string().when("orientationName", {
      is: "Inter 1",
      then: (s) => s.required("School State is required"),
    }),
    schoolDistrict: Yup.string().when("orientationName", {
      is: "Inter 1",
      then: (s) => s.required("School District is required"),
    }),
    schoolType: Yup.string().when("orientationName", {
      is: "Inter 1",
      then: (s) => s.required("School Type is required"),
    }),
    schoolName: Yup.string().when("orientationName", {
      is: "Inter 1",
      then: (s) => s.required("School Name is required"),
    }),
    hallTicketNo: Yup.string()
      .matches(/^[A-Za-z0-9]+$/, "Hall Ticket must contain letters & digits only")
      .when("orientationName", {
        is: "Inter 1",
        then: (s) => s.required("Hall Ticket No is required"),
      }),

    // 🟢 Inter 2
    tenthHallTicketNo: Yup.string()
      .matches(/^[A-Za-z0-9]+$/, "Only letters & digits allowed")
      .when("orientationName", {
        is: "Inter 2",
        then: (s) => s.required("Tenth Hall Ticket is required"),
      }),

    interFirstYearHallTicketNo: Yup.string()
      .matches(/^[A-Za-z0-9]+$/, "Only letters & digits allowed")
      .when("orientationName", {
        is: "Inter2",
        then: (s) => s.required("Inter 1st Year Hall Ticket is required"),
      }),

    clgState: Yup.string().when("orientationName", {
      is: "Inter2",
      then: (s) => s.required("College State is required"),
    }),
    clgDistrict: Yup.string().when("orientationName", {
      is: "Inter2",
      then: (s) => s.required("College District is required"),
    }),
    clgType: Yup.string().when("orientationName", {
      is: "Inter2",
      then: (s) => s.required("College Type is required"),
    }),

    // 🟠 Long Term / Short Term
    interHallTicketNo: Yup.string()
      .matches(/^[A-Za-z0-9]+$/, "Only letters & digits allowed")
      .when("orientationName", {
        is: (val) => val === "Long Term" || val === "Short Term",
        then: (s) => s.required("Inter Hall Ticket is required"),
      }),

    collegeName: Yup.string().when("orientationName", {
      is: (val) => val === "Long Term" || val === "Short Term",
      then: (s) => s.required("College Name is required"),
    }),
    clgState: Yup.string().when("orientationName", {
      is: (val) => val === "Long Term" || val === "Short Term",
      then: (s) => s.required("College State is required"),
    }),
    clgDistrict: Yup.string().when("orientationName", {
      is: (val) => val === "Long Term" || val === "Short Term",
      then: (s) => s.required("College District is required"),
    }),
    clgType: Yup.string().when("orientationName", {
      is: (val) => val === "Long Term" || val === "Short Term",
      then: (s) => s.required("College Type is required"),
    }),
  });

export default clgActualSaleValidationSchema;
