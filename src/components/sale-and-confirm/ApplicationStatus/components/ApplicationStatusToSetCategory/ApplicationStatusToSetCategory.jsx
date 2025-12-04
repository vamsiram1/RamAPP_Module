// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./ApplicationStatusToSetCategory.module.css";
// import ApplicationStatusHeader from "../ApplicationStatusHeader";
// import ApplicationStatusContent from "../ApplicationStatusContainerForTableAndCard";

// const ApplicationStatus = () => {
//   const navigate = useNavigate();

//   // Get category from localStorage (school or college)
//   // Set to 'school' by default
//   useEffect(() => {
//     // Always set to 'school' on component mount
//     localStorage.setItem('category', 'college');
//   }, []);
  
//   const category = localStorage.getItem('category') || 'school'; // Default to school
  
//   // Log category for debugging (you can remove this later)
//   useEffect(() => {
//     console.log('Current Category:', category);
//   }, [category]);

//   // UI State
//   const [showFilter, setShowFilter] = useState(false);
//   const [showExport, setShowExport] = useState(false);
//   const [activeTab, setActiveTab] = useState("zone");
//   const [selectedCampus, setSelectedCampus] = useState("All Campuses");
//   const [pageIndex, setPageIndex] = useState(0);

//   // Data State - empty array for static display
//   const [data, setData] = useState([]);

//   // Search State
//   const [search, setSearch] = useState("");

//   // Filter State
//   const [studentCategory, setStudentCategory] = useState({
//     all: true,
//     sold: false,
//     confirmed: false,
//     unsold: false,
//     withPro: false,
//     damaged: false,
//     unavailable: false,
//   });

//   // Baseline refs to detect if user has applied any filter changes
//   const initialCampusRef = useRef("All Campuses");
//   const initialStudentCategoryRef = useRef({
//     all: true,
//     sold: false,
//     confirmed: false,
//     unsold: false,
//     withPro: false,
//     damaged: false,
//     unavailable: false,
//   });

//   const [isFilterApplied, setIsFilterApplied] = useState(false);

//   // Handle search change
//   const handleSearchChange = (e) => {
//     setSearch(e.target.value.trim());
//   };

//   // Handle card click navigation
//   const handleCardClick = (item) => {
//     const applicationNo = item?.applicationNo;
//     const displayStatus = item?.displayStatus;
   
//     if (applicationNo) {
//       let route;
//       if (displayStatus === "Sold" || displayStatus === "Confirmed") {
//         route = "confirm";
//       } else {
//         route = "sale";
//       }
//       navigate(`/scopes/application/status/${applicationNo}/${route}`, {
//         state: {
//           initialValues: item,
//         },
//       });
//     }
//   };

//   // Handle navigation to sale page (for school category)
//   const handleNavigateToSalePage = (applicationData) => {
//     navigate('/school-application-sale', {
//       state: { applicationData }
//     });
//   };

//   // Filter data for search results
//   const filteredData = useMemo(() => {
//     let filtered = data;

//     if (search) {
//       filtered = filtered.filter((item) =>
//         String(item.applicationNo ?? "")
//           .toLowerCase()
//           .includes(String(search).toLowerCase())
//       );
//     }

//     // Apply status filters for search results
//     const isAllSelected =
//       studentCategory.all &&
//       !studentCategory.sold &&
//       !studentCategory.confirmed &&
//       !studentCategory.unsold &&
//       !studentCategory.withPro &&
//       !studentCategory.damaged &&
//       !studentCategory.unavailable;
   
//     if (!isAllSelected) {
//       filtered = filtered.filter((item) => {
//         const status = item.displayStatus || item.status;
//         const matches = (
//           studentCategory.all ||
//           (studentCategory.sold && status === "Sold") ||
//           (studentCategory.confirmed && status === "Confirmed") ||
//           (studentCategory.unsold && status === "Unsold") ||
//           (studentCategory.withPro && status === "With PRO") ||
//           (studentCategory.damaged && status === "Damaged") ||
//           (studentCategory.unavailable && status === "Unavailable")
//         );
//         return matches;
//       });
//     }

//     return filtered;
//   }, [data, search, studentCategory]);

//   // Check if filter is applied
//   useEffect(() => {
//     const isCategoryChanged = (a, b) =>
//       a.all !== b.all ||
//       a.sold !== b.sold ||
//       a.confirmed !== b.confirmed ||
//       a.unsold !== b.unsold ||
//       a.withPro !== b.withPro ||
//       a.damaged !== b.damaged ||
//       a.unavailable !== b.unavailable;

//     const applied =
//       selectedCampus !== initialCampusRef.current ||
//       isCategoryChanged(studentCategory, initialStudentCategoryRef.current);

//     setIsFilterApplied(applied);
//   }, [selectedCampus, studentCategory]);

//   // Handle page index changes when filtered data changes
//   useEffect(() => {
//     if (filteredData.length <= pageIndex * 10) {
//       setPageIndex(0);
//     }
//   }, [filteredData, pageIndex]);

//   // Handle click outside to close panels
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const exportPanel = document.querySelector(`[class*="exportContainer"]`);
//       const filterPanel = document.querySelector(`[class*="filter_panel"]`);
//       const filterButton = event.target.closest(
//         `[class*="application-status__filter-btn"]`
//       );
//       const exportButton = event.target.closest(
//         `[class*="application-status__export-btn"]`
//       );
//       if (
//         showExport &&
//         exportPanel &&
//         !exportPanel.contains(event.target) &&
//         !exportButton
//       ) {
//         setShowExport(false);
//       }
//       if (
//         showFilter &&
//         filterPanel &&
//         !filterPanel.contains(event.target) &&
//         !filterButton
//       ) {
//         setShowFilter(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showExport, showFilter]);

//   return (
//     <div className={styles["application-status"]}>
//       <div className={styles["application-status__card"]}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
//           <div>
//             <h2 className={styles["application-status__title"]}>Application Status</h2>
//             <p className={styles["application-status__subtitle"]}>
//               Sale and confirm or view the status of all applications.
//             </p>
//           </div>
//           <div style={{ 
//             padding: '8px 16px', 
//             backgroundColor: category === 'college' ? '#E0EEFF' : '#FFF1C2',
//             color: category === 'college' ? '#0C1BA3' : '#7A6000',
//             borderRadius: '8px',
//             fontSize: '14px',
//             fontWeight: '500'
//           }}>
//             Category: <strong>{category.toUpperCase()}</strong>
//           </div>
//         </div>
        
//         <ApplicationStatusHeader
//           search={search}
//           handleSearchChange={handleSearchChange}
//           showFilter={showFilter}
//           setShowFilter={setShowFilter}
//           showExport={showExport}
//           setShowExport={setShowExport}
//           isFilterApplied={isFilterApplied}
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           selectedCampus={selectedCampus}
//           setSelectedCampus={setSelectedCampus}
//           studentCategory={studentCategory}
//           setStudentCategory={setStudentCategory}
//           data={data}
//         />
     
//         <ApplicationStatusContent
//           search={search}
//           filteredData={filteredData}
//           pageIndex={pageIndex}
//           setPageIndex={setPageIndex}
//           handleCardClick={handleCardClick}
//           setData={setData}
//           studentCategory={studentCategory}
//           selectedCampus={selectedCampus}
//           category={category}
//           setSearch={setSearch}
//           navigate={navigate}
//           handleNavigateToSalePage={handleNavigateToSalePage}
//           employeeCampusId={4700} // TODO: Replace with actual employeeCampusId from login/session (e.g., localStorage.getItem('employeeCampusId') or from auth context)
//         />
//       </div>
//     </div>
//   );
// };

// export default ApplicationStatus;





import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ApplicationStatusToSetCategory.module.css";
import ApplicationStatusHeader from "../ApplicationStatusHeader";
import ApplicationStatusContent from "../ApplicationStatusContainerForTableAndCard";
 
const ApplicationStatus = () => {
  const navigate = useNavigate();
 
  // Get category from localStorage (school or college)
  // Set to 'school' by default
  useEffect(() => {
    // Always set to 'school' on component mount
    // localStorage.setItem('category', 'colege');
  }, []);
 
  const category = localStorage.getItem('category') || 'school'; // Default to school
 
  // Log category for debugging (you can remove this later)
  useEffect(() => {
    console.log('Current Category:', category);
  }, [category]);
 
  // UI State
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState("zone");
  const [selectedCampus, setSelectedCampus] = useState("All Campuses");
  const [pageIndex, setPageIndex] = useState(0);
 
  // Data State - empty array for static display
  const [data, setData] = useState([]);
 
  // Search State
  const [search, setSearch] = useState("");
 
  // Filter State
  const [studentCategory, setStudentCategory] = useState({
    all: true,
    sold: false,
    confirmed: false,
    unsold: false,
    withPro: false,
    damaged: false,
    unavailable: false,
  });
 
  // Baseline refs to detect if user has applied any filter changes
  const initialCampusRef = useRef("All Campuses");
  const initialStudentCategoryRef = useRef({
    all: true,
    sold: false,
    confirmed: false,
    unsold: false,
    withPro: false,
    damaged: false,
    unavailable: false,
  });
 
  const [isFilterApplied, setIsFilterApplied] = useState(false);
 
  // Handle search change
  const handleSearchChange = (e) => {
    setSearch(e.target.value.trim());
  };
 
  // Handle card click navigation
  const handleCardClick = (item) => {
    const applicationNo = item?.applicationNo;
    const displayStatus = item?.displayStatus;
   
    if (applicationNo) {
      let route;
      if (displayStatus === "Sold" || displayStatus === "Confirmed") {
        route = "confirm";
      } else {
        route = "sale";
      }
      navigate(`/scopes/application/status/${applicationNo}/${route}`, {
        state: {
          initialValues: item,
        },
      });
    }
  };
 
  // Handle navigation to sale page (for school category)
  const handleNavigateToSalePage = (applicationData) => {
    navigate('/scopes/application/status/school-application-sale', {
      state: { applicationData }
    });
  };
 
  // Filter data for search results
  const filteredData = useMemo(() => {
    let filtered = data;
 
    if (search) {
      filtered = filtered.filter((item) =>
        String(item.applicationNo ?? "")
          .toLowerCase()
          .includes(String(search).toLowerCase())
      );
    }
 
    // Apply status filters for search results
    const isAllSelected =
      studentCategory.all &&
      !studentCategory.sold &&
      !studentCategory.confirmed &&
      !studentCategory.unsold &&
      !studentCategory.withPro &&
      !studentCategory.damaged &&
      !studentCategory.unavailable;
   
    if (!isAllSelected) {
      filtered = filtered.filter((item) => {
        const status = item.displayStatus || item.status;
        const matches = (
          studentCategory.all ||
          (studentCategory.sold && status === "Sold") ||
          (studentCategory.confirmed && status === "Confirmed") ||
          (studentCategory.unsold && status === "Unsold") ||
          (studentCategory.withPro && status === "With PRO") ||
          (studentCategory.damaged && status === "Damaged") ||
          (studentCategory.unavailable && status === "Unavailable")
        );
        return matches;
      });
    }
 
    return filtered;
  }, [data, search, studentCategory]);
 
  // Check if filter is applied
  useEffect(() => {
    const isCategoryChanged = (a, b) =>
      a.all !== b.all ||
      a.sold !== b.sold ||
      a.confirmed !== b.confirmed ||
      a.unsold !== b.unsold ||
      a.withPro !== b.withPro ||
      a.damaged !== b.damaged ||
      a.unavailable !== b.unavailable;
 
    const applied =
      selectedCampus !== initialCampusRef.current ||
      isCategoryChanged(studentCategory, initialStudentCategoryRef.current);
 
    setIsFilterApplied(applied);
  }, [selectedCampus, studentCategory]);
 
  // Handle page index changes when filtered data changes
  useEffect(() => {
    if (filteredData.length <= pageIndex * 10) {
      setPageIndex(0);
    }
  }, [filteredData, pageIndex]);
 
  // Handle click outside to close panels
  useEffect(() => {
    const handleClickOutside = (event) => {
      const exportPanel = document.querySelector(`[class*="exportContainer"]`);
      const filterPanel = document.querySelector(`[class*="filter_panel"]`);
      const filterButton = event.target.closest(
        `[class*="application-status__filter-btn"]`
      );
      const exportButton = event.target.closest(
        `[class*="application-status__export-btn"]`
      );
      if (
        showExport &&
        exportPanel &&
        !exportPanel.contains(event.target) &&
        !exportButton
      ) {
        setShowExport(false);
      }
      if (
        showFilter &&
        filterPanel &&
        !filterPanel.contains(event.target) &&
        !filterButton
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExport, showFilter]);
 
  return (
    <div className={styles["application-status"]}>
      <div className={`${styles["application-status__card"]} ${
        data && data.length > 0 
          ? styles["application-status__card--with-data"] 
          : styles["application-status__card--no-data"]
      }`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h2 className={styles["application-status__title"]}>Application Status</h2>
            <p className={styles["application-status__subtitle"]}>
              Sale and confirm or view the status of all applications.
            </p>
          </div>
          <div style={{
            padding: '8px 16px',
            backgroundColor: category === 'college' ? '#E0EEFF' : '#FFF1C2',
            color: category === 'college' ? '#0C1BA3' : '#7A6000',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Category: <strong>{category.toUpperCase()}</strong>
          </div>
        </div>
       
        <ApplicationStatusHeader
          search={search}
          handleSearchChange={handleSearchChange}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          showExport={showExport}
          setShowExport={setShowExport}
          isFilterApplied={isFilterApplied}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
          studentCategory={studentCategory}
          setStudentCategory={setStudentCategory}
          data={data}
        />
     
        <ApplicationStatusContent
          search={search}
          filteredData={filteredData}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          handleCardClick={handleCardClick}
          setData={setData}
          studentCategory={studentCategory}
          selectedCampus={selectedCampus}
          category={category}
          setSearch={setSearch}
          navigate={navigate}
          handleNavigateToSalePage={handleNavigateToSalePage}
          employeeCampusId={(() => {
            // Try to get empId from localStorage (check common keys)
            const empId = localStorage.getItem('empId') ||
                         localStorage.getItem('employeeId') ||
                         localStorage.getItem('employeeCampusId') ||
                         localStorage.getItem('userId') ||
                         null;
            return empId ? Number(empId) : null; // Convert to number if found, otherwise null
          })()}
        />
      </div>
    </div>
  );
};
 
export default ApplicationStatus;



