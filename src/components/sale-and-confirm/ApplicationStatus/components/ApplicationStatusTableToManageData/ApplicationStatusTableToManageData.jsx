import { useState, useMemo, useEffect } from 'react';
import ApplicationStatusTable from '../ApplicationStatusTableForData/ApplicationStatusTableForData';
import styles from '../../../../../widgets/ApplicationStatusDataTable/ApplicationStatusDataTable.module.css';
import './ApplicationStatusTableToManageData.module.css';
import { useApplicationStatusData } from '../../../../../hooks/application-status-apis/ApplicationStatusApis';
 
// // Normalize status to a standard key
// const normalizeStatus = (status) => {
//     if (!status) return '';
//     const normalized = status.toLowerCase().trim();
 
//     // Map all variations to standard keys
//     switch (normalized) {
//         case 'sold':
//         case 'not confirmed':
//             return 'sold';
//         case 'with pro':
//         case 'withpro':
//         case 'with_pro':
//         case 'available':
//             return 'withpro';
//         case 'damaged':
//         case 'broken':
//             return 'damaged';
//         case 'unavailable':
//             return 'unavailable';
//         case 'fast sale':
//         case 'fastsale':
//         case 'fast_sale':
//         case 'fast sold':
//         case 'fastsold':
//         case 'fast_sold':
//             return 'fastsold';
//         case 'payment pending':
//         case 'payment_pending':
//         case 'paymentpending':
//             return 'paymentpending';
//         case 'confirmed':
//         case 'approved':
//             return 'confirmed';
//         default:
//             return normalized;
//     }
// };
 
// // Status mapping configuration
// const statusConfig = {
//     sold: {
//         cssClass: styles.sold,
//         displayStatus: 'Sold'
//     },
//     withpro: {
//         cssClass: styles.withpro,
//         displayStatus: 'With PRO'
//     },
//     fastsold: {
//         cssClass: styles.fastsold,
//         displayStatus: 'Fast Sold'
//     },
//     confirmed: {
//         cssClass: styles.confirmed,
//         displayStatus: 'Confirmed'
//     },
//     unavailable: {
//         cssClass: styles.unavailable || '',
//         displayStatus: 'Unavailable'
//     },
//     damaged: {
//         cssClass: styles.damaged || '',
//         displayStatus: 'Damaged'
//     },
//     paymentpending: {
//         cssClass: styles.paymentpending || '',
//         displayStatus: 'Payment Pending'
//     }
// };
 
// // Function to get status badge CSS class
// const getStatusBadgeClass = (status) => {
//     const normalized = normalizeStatus(status);
//     return statusConfig[normalized]?.cssClass || '';
// };
 
// // Function to map status to displayStatus for SearchResultCardWithStatus
// const mapStatusToDisplayStatus = (status) => {
//     const normalized = normalizeStatus(status);
//     return statusConfig[normalized]?.displayStatus || status;
// };
 
// // Function to format date as "14,August 2025"
// const formatDate = (date) => {
//     if (!date) return '';
//     const dateObj = typeof date === 'string' ? new Date(date) : date;
//     if (isNaN(dateObj.getTime())) return '';
 
//     const day = dateObj.getDate();
//     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'];
//     const month = monthNames[dateObj.getMonth()];
//     const year = dateObj.getFullYear();
 
//     return `${day},${month} ${year}`;
// };
 
// const ApplicationStatusTableToManageData = ({
//     studentCategory,
//     selectedCampus,
//     pageIndex: externalPageIndex,
//     setPageIndex: externalSetPageIndex,
//     onDataChange,
//     category = 'school',
//     setSearch,
//     navigate,
//     handleNavigateToSalePage,
//     employeeCampusId = null // No default - must be provided from login/session
// }) => {
//     const [internalPageIndex, setInternalPageIndex] = useState(0);
 
//     // Use external pageIndex if provided, otherwise use internal state
//     const pageIndex = externalPageIndex !== undefined ? externalPageIndex : internalPageIndex;
//     const setPageIndex = externalSetPageIndex || setInternalPageIndex;
 
//     // Fetch data from API - using empId parameter name
//     // If employeeCampusId is null/undefined, empId will be null and API won't be called
//     const empId = employeeCampusId; // Map prop name to API parameter name
//     const { data: apiData, loading, error } = useApplicationStatusData(empId);
 
//     // Default columns with custom status cell renderer
//     const columns = [
//         { accessorKey: "applicationNo", header: "Application No" },
//         { accessorKey: "pro", header: "PRO" },
//         { accessorKey: "campus", header: "Campus" },
//         { accessorKey: "dgm", header: "DGM" },
//         { accessorKey: "zone", header: "Zone" },
//         {
//             accessorKey: "date",
//             header: "Date",
//             cell: ({ getValue }) => {
//                 const date = getValue();
//                 return formatDate(date);
//             }
//         },
//         {
//             accessorKey: "status",
//             header: "Status",
//             cell: ({ getValue }) => {
//                 const status = getValue();
//                 const badgeClass = getStatusBadgeClass(status);
//                 return (
//                     <span className={`${styles.Application_Status_Table_status_badge} ${badgeClass}`}>
//                         {status}
//                     </span>
//                 );
//             }
//         },
//     ];
 
//     // Data from API - converted to state so checkbox selection can be updated
//     const [allData, setAllData] = useState([]);
 
//     // Update allData when API data is fetched - only use backend data, no hardcoded values
//     useEffect(() => {
//         if (apiData && apiData.length > 0) {
//             // Initialize with isSelected: false for each item
//             // Only use data that has applicationNo (required field)
//             const dataWithSelection = apiData
//                 .filter(item => {
//                     const hasAppNo = item.applicationNo && item.applicationNo.trim() !== '';
//                     return hasAppNo;
//                 })
//                 .map(item => ({
//                     ...item,
//                     isSelected: false
//                 }));
//             setAllData(dataWithSelection);
//         } else if (!loading && !error) {
//             // If no data and not loading, set empty array
//             setAllData([]);
//         }
//     }, [apiData, loading, error]);
 
//     // Extract unique campuses from API data for dynamic campus filter
//     const availableCampuses = useMemo(() => {
//         const campuses = new Set(['All Campuses']);
//         allData.forEach(item => {
//             if (item.campus && item.campus.trim() !== '') {
//                 campuses.add(item.campus);
//             }
//         });
//         return Array.from(campuses);
//     }, [allData]);
 
//     // Apply filters to data
//     const data = useMemo(() => {
//         let filtered = [...allData];
 
//         // Apply campus filter
//         if (selectedCampus && selectedCampus !== "All Campuses") {
//             filtered = filtered.filter(item =>
//                 item.campus === selectedCampus
//             );
//         }
 
//         // Apply status filter
//         if (studentCategory) {
//             const isAllSelected =
//                 studentCategory.all &&
//                 !studentCategory.sold &&
//                 !studentCategory.confirmed &&
//                 !studentCategory.unsold &&
//                 !studentCategory.withPro &&
//                 !studentCategory.damaged &&
//                 !studentCategory.unavailable;
 
//             if (!isAllSelected) {
//                 filtered = filtered.filter((item) => {
//                     // Use normalizeStatus function to properly normalize status values
//                     const normalizedStatus = normalizeStatus(item.status);
 
//                     // Map status values to match filter categories
//                     let matches = false;
 
//                     // Sold filter: "Sold" status
//                     if (studentCategory.sold && normalizedStatus === "sold") {
//                         matches = true;
//                     }
 
//                     // Confirmed filter: "Confirmed" status
//                     if (studentCategory.confirmed && normalizedStatus === "confirmed") {
//                         matches = true;
//                     }
 
//                     // Fast Sold filter (unsold filter maps to Fast Sold)
//                     if (studentCategory.unsold && normalizedStatus === "fastsold") {
//                         matches = true;
//                     }
 
//                     // With PRO filter: "With PRO", "Available" statuses
//                     if (studentCategory.withPro && normalizedStatus === "withpro") {
//                         matches = true;
//                     }
 
//                     // Damaged filter: "Damaged" status
//                     if (studentCategory.damaged && normalizedStatus === "damaged") {
//                         matches = true;
//                     }
 
//                     // Unavailable filter: "Unavailable" status
//                     if (studentCategory.unavailable && normalizedStatus === "unavailable") {
//                         matches = true;
//                     }
 
//                     return matches;
//                 });
//             }
//         }
 
//         return filtered;
//     }, [allData, studentCategory, selectedCampus]);
 
//     // Notify parent component when data changes (for search functionality)
//     useEffect(() => {
//         if (onDataChange) {
//             // Map data to include displayStatus for SearchResultCardWithStatus
//             const dataWithDisplayStatus = data.map(item => ({
//                 ...item,
//                 displayStatus: mapStatusToDisplayStatus(item.status)
//             }));
//             onDataChange(dataWithDisplayStatus);
//         }
//     }, [data, onDataChange]);
 
//     const handleSelectRow = (row, checked) => {
//         // Update the isSelected property of the row in allData
//         setAllData(prevData =>
//             prevData.map(item =>
//                 item.applicationNo === row.applicationNo
//                     ? { ...item, isSelected: checked }
//                     : item
//             )
//         );
//     };
 
//     const handleNavigateToSale = (row) => {
//         // Check category and handle accordingly
//         const normalizedCategory = category?.toLowerCase()?.trim();
//         const normalizedStatus = normalizeStatus(row?.status);
 
//         // Special handling for Fast Sold status when category is college
//         if (normalizedCategory === 'college' && normalizedStatus === 'fastsold') {
//             // Navigate to CollegeSaleForm for Fast Sold completion via SaleFormRouter
//             if (navigate && row?.applicationNo) {
//                 navigate(`/scopes/application/status/${row.applicationNo}/college-sale`, {
//                     state: { applicationData: row }
//                 });
//             }
//         } else if (normalizedCategory === 'college') {
//             // For college (other statuses): navigate to college sale via SaleFormRouter
//             if (navigate && row?.applicationNo) {
//                 navigate(`/scopes/application/status/${row.applicationNo}/college-sale`, {
//                     state: { applicationData: row }
//                 });
//             }
//         } else {
//             // For school: navigate to school sale page via SaleFormRouter
//             if (navigate && row?.applicationNo) {
//                 navigate(`/scopes/application/status/${row.applicationNo}/school-sale`, {
//                     state: { applicationData: row }
//                 });
//             } else if (handleNavigateToSalePage) {
//                 handleNavigateToSalePage(row);
//             }
//         }
//     };
 
//     const handleNavigateToConfirmation = (row) => {
//         // Check category and handle accordingly
//         const normalizedCategory = category?.toLowerCase()?.trim();
       
//         if (normalizedCategory === 'college') {
//             // For college: navigate to college confirmation via SaleFormRouter
//             if (navigate && row?.applicationNo) {
//                 navigate(`/scopes/application/status/${row.applicationNo}/college-confirmation`, {
//                     state: { applicationData: row }
//                 });
//             }
//         } else {
//             // For school: navigate to school confirmation via SaleFormRouter
//             if (navigate && row?.applicationNo) {
//                 navigate(`/scopes/application/status/${row.applicationNo}/school-confirmation`, {
//                     state: { applicationData: row }
//                 });
//             }
//         }
//     };
 
//     const handleNavigateToDamage = (row) => {
//         // Navigate to damaged form for both college and school
//         if (navigate && row?.applicationNo) {
//             navigate('/scopes/application/damage', {
//                 state: { applicationData: row }
//             });
//         }
//     };
 
//     // Show loading state
//     if (loading) {
//         return (
//             <div style={{ padding: '20px', textAlign: 'center' }}>
//                 Loading application status data...
//             </div>
//         );
//     }
 
//     // Show error state
//     if (error) {
//         const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
//         const errorMessage = isTimeout
//             ? 'Request timeout - The server is taking too long to respond. This may indicate a backend performance issue or large dataset.'
//             : (error.message || error.response?.data?.message || 'Unknown error');
       
//         return (
//             <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
//                 <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
//                     Error loading application status data
//                 </div>
//                 <div style={{ fontSize: '14px', marginTop: '10px', marginBottom: '10px' }}>
//                     {errorMessage}
//                 </div>
//                 {isTimeout && (
//                     <div style={{ fontSize: '12px', marginTop: '10px', color: '#666', fontStyle: 'italic' }}>
//                         Please contact the backend team to optimize the database query for employeeCampusId: {employeeCampusId}
//                     </div>
//                 )}
//                 <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
//                     Check browser console for technical details
//                 </div>
//             </div>
//         );
//     }
 
//     // Show message if no data
//     if (!loading && !error && allData.length === 0) {
//         return (
//             <div style={{ padding: '20px', textAlign: 'center' }}>
//                 <div>No application data found</div>
//                 <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
//                     Check browser console for API response details
//                 </div>
//             </div>
//         );
//     }
 
//     return (
//         <div>
//             <div>
//                 <ApplicationStatusTable
//                     columns={columns}
//                     data={data}
//                     onSelectRow={handleSelectRow}
//                     onNavigateToSale={handleNavigateToSale}
//                     onNavigateToConfirmation={handleNavigateToConfirmation}
//                     onNavigateToDamage={handleNavigateToDamage}
//                     pageIndex={pageIndex}
//                     setPageIndex={setPageIndex}
//                     totalData={data.length}
//                 />
//             </div>
//         </div>
//     );
 
// };
 
// export default ApplicationStatusTableToManageData;
 





















// Normalize status to a standard key
const normalizeStatus = (status) => {
    if (!status) return '';
    const normalized = status.toLowerCase().trim();

    // Map all variations to standard keys
    switch (normalized) {
        case 'sold':
        case 'not confirmed':
            return 'sold';
        case 'with pro':
        case 'withpro':
        case 'with_pro':
        case 'available':
            return 'withpro';
        case 'damaged':
        case 'broken':
            return 'damaged';
        case 'unavailable':
            return 'unavailable';
        case 'fast sale':
        case 'fastsale':
        case 'fast_sale':
        case 'fast sold':
        case 'fastsold':
        case 'fast_sold':
            return 'fastsold';
        case 'payment pending':
        case 'payment_pending':
        case 'paymentpending':
            return 'paymentpending';
        case 'confirmed':
        case 'approved':
            return 'confirmed';
        default:
            return normalized;
    }
};

// Status mapping configuration
const statusConfig = {
    sold: {
        cssClass: styles.sold,
        displayStatus: 'Sold'
    },
    withpro: {
        cssClass: styles.withpro,
        displayStatus: 'With PRO'
    },
    fastsold: {
        cssClass: styles.fastsold,
        displayStatus: 'Fast Sold'
    },
    confirmed: {
        cssClass: styles.confirmed,
        displayStatus: 'Confirmed'
    },
    unavailable: {
        cssClass: styles.unavailable || '',
        displayStatus: 'Unavailable'
    },
    damaged: {
        cssClass: styles.damaged || '',
        displayStatus: 'Damaged'
    },
    paymentpending: {
        cssClass: styles.paymentpending || '',
        displayStatus: 'Payment Pending'
    }
};

// Function to get status badge CSS class
const getStatusBadgeClass = (status) => {
    const normalized = normalizeStatus(status);
    return statusConfig[normalized]?.cssClass || '';
};

// Function to map status to displayStatus for SearchResultCardWithStatus
const mapStatusToDisplayStatus = (status) => {
    const normalized = normalizeStatus(status);
    return statusConfig[normalized]?.displayStatus || status;
};

// Function to format date as "14,August 2025"
const formatDate = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';

    const day = dateObj.getDate();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${day},${month} ${year}`;
};

const ApplicationStatusTableToManageData = ({
    studentCategory,
    selectedCampus,
    pageIndex: externalPageIndex,
    setPageIndex: externalSetPageIndex,
    onDataChange,
    category = 'school',
    setSearch,
    navigate,
    handleNavigateToSalePage,
    employeeCampusId = 4004 // Default to 4004, will be replaced with login data later
}) => {
    const [internalPageIndex, setInternalPageIndex] = useState(0);

    // Use external pageIndex if provided, otherwise use internal state
    const pageIndex = externalPageIndex !== undefined ? externalPageIndex : internalPageIndex;
    const setPageIndex = externalSetPageIndex || setInternalPageIndex;

    // Fetch data from API - using empId parameter name
    const empId = employeeCampusId; // Map prop name to API parameter name
    const { data: apiData, loading, error } = useApplicationStatusData(empId);

    // Default columns with custom status cell renderer
    const columns = [
        { accessorKey: "applicationNo", header: "Application No" },
        { accessorKey: "pro", header: "PRO" },
        { accessorKey: "campus", header: "Campus" },
        { accessorKey: "dgm", header: "DGM" },
        { accessorKey: "zone", header: "Zone" },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ getValue }) => {
                const date = getValue();
                return formatDate(date);
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const status = getValue();
                const badgeClass = getStatusBadgeClass(status);
                // Convert to Upper Camel Case (Title Case)
                const upperCamelCaseStatus = status 
                    ? status.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ')
                    : '';
                return (
                    <span className={`${styles.Application_Status_Table_status_badge} ${badgeClass}`}>
                        {upperCamelCaseStatus}
                    </span>
                );
            }
        },
    ];

    // Data from API - converted to state so checkbox selection can be updated
    const [allData, setAllData] = useState([]);

    // Update allData when API data is fetched - only use backend data, no hardcoded values
    useEffect(() => {
        if (apiData && apiData.length > 0) {
            // Initialize with isSelected: false for each item
            // Only use data that has applicationNo (required field)
            const dataWithSelection = apiData
                .filter(item => {
                    const hasAppNo = item.applicationNo && item.applicationNo.trim() !== '';
                    return hasAppNo;
                })
                .map(item => ({
                    ...item,
                    isSelected: false
                }));
            setAllData(dataWithSelection);
        } else if (!loading && !error) {
            // If no data and not loading, set empty array
            setAllData([]);
        }
    }, [apiData, loading, error]);

    // Extract unique campuses from API data for dynamic campus filter
    const availableCampuses = useMemo(() => {
        const campuses = new Set(['All Campuses']);
        allData.forEach(item => {
            if (item.campus && item.campus.trim() !== '') {
                campuses.add(item.campus);
            }
        });
        return Array.from(campuses);
    }, [allData]);

    // Apply filters to data
    const data = useMemo(() => {
        let filtered = [...allData];

        // Apply campus filter
        if (selectedCampus && selectedCampus !== "All Campuses") {
            filtered = filtered.filter(item =>
                item.campus === selectedCampus
            );
        }

        // Apply status filter
        if (studentCategory) {
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
                    // Use normalizeStatus function to properly normalize status values
                    const normalizedStatus = normalizeStatus(item.status);

                    // Map status values to match filter categories
                    let matches = false;

                    // Sold filter: "Sold" status
                    if (studentCategory.sold && normalizedStatus === "sold") {
                        matches = true;
                    }

                    // Confirmed filter: "Confirmed" status
                    if (studentCategory.confirmed && normalizedStatus === "confirmed") {
                        matches = true;
                    }

                    // Fast Sold filter (unsold filter maps to Fast Sold)
                    if (studentCategory.unsold && normalizedStatus === "fastsold") {
                        matches = true;
                    }

                    // With PRO filter: "With PRO", "Available" statuses
                    if (studentCategory.withPro && normalizedStatus === "withpro") {
                        matches = true;
                    }

                    // Damaged filter: "Damaged" status
                    if (studentCategory.damaged && normalizedStatus === "damaged") {
                        matches = true;
                    }

                    // Unavailable filter: "Unavailable" status
                    if (studentCategory.unavailable && normalizedStatus === "unavailable") {
                        matches = true;
                    }

                    return matches;
                });
            }
        }

        return filtered;
    }, [allData, studentCategory, selectedCampus]);

    // Notify parent component when data changes (for search functionality)
    useEffect(() => {
        if (onDataChange) {
            // Map data to include displayStatus for SearchResultCardWithStatus
            const dataWithDisplayStatus = data.map(item => ({
                ...item,
                displayStatus: mapStatusToDisplayStatus(item.status)
            }));
            onDataChange(dataWithDisplayStatus);
        }
    }, [data, onDataChange]);

    const handleSelectRow = (row, checked) => {
        // Update the isSelected property of the row in allData
        setAllData(prevData =>
            prevData.map(item =>
                item.applicationNo === row.applicationNo
                    ? { ...item, isSelected: checked }
                    : item
            )
        );
    };

    const handleNavigateToSale = (row) => {
        // Check category and handle accordingly
        const normalizedCategory = category?.toLowerCase()?.trim();
        const normalizedStatus = normalizeStatus(row?.status);

        // Special handling for Fast Sold status when category is college
        if (normalizedCategory === 'college' && normalizedStatus === 'fastsold') {
            // Navigate to CollegeSaleForm for Fast Sold completion via SaleFormRouter
            if (navigate && row?.applicationNo) {
                navigate(`/scopes/application/status/${row.applicationNo}/college-sale`, {
                    state: { applicationData: row }
                });
            }
        } else if (normalizedCategory === 'college') {
            // For college "To Sold" (With Pro status): show search card for this application
            if (setSearch && row?.applicationNo) {
                setSearch(row.applicationNo);
            }
        } else {
            // For school: navigate to school sale page via SaleFormRouter
            if (navigate && row?.applicationNo) {
                navigate(`/scopes/application/status/${row.applicationNo}/school-sale`, {
                    state: { applicationData: row }
                });
            } else if (handleNavigateToSalePage) {
                handleNavigateToSalePage(row);
            }
        }
    };

    const handleNavigateToConfirmation = (row) => {
        // Check category and handle accordingly
        const normalizedCategory = category?.toLowerCase()?.trim();
       
        if (normalizedCategory === 'college') {
            // For college: navigate to college confirmation via SaleFormRouter
            if (navigate && row?.applicationNo) {
                navigate(`/scopes/application/status/${row.applicationNo}/college-confirmation`, {
                    state: { applicationData: row }
                });
            }
        } else {
            // For school: navigate to school confirmation via SaleFormRouter
            if (navigate && row?.applicationNo) {
                navigate(`/scopes/application/status/${row.applicationNo}/school-confirmation`, {
                    state: { applicationData: row }
                });
            }
        }
    };

    const handleNavigateToDamage = (row) => {
        // Navigate to damaged form for both college and school
        if (navigate && row?.applicationNo) {
            navigate('/scopes/application/damage', {
                state: { applicationData: row }
            });
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                Loading application status data...
            </div>
        );
    }

    // Show error state
    if (error) {
        const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
        const errorMessage = isTimeout
            ? 'Request timeout - The server is taking too long to respond. This may indicate a backend performance issue or large dataset.'
            : (error.message || error.response?.data?.message || 'Unknown error');
       
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Error loading application status data
                </div>
                <div style={{ fontSize: '14px', marginTop: '10px', marginBottom: '10px' }}>
                    {errorMessage}
                </div>
                {isTimeout && (
                    <div style={{ fontSize: '12px', marginTop: '10px', color: '#666', fontStyle: 'italic' }}>
                        Please contact the backend team to optimize the database query for employeeCampusId: {employeeCampusId}
                    </div>
                )}
                <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
                    Check browser console for technical details
                </div>
            </div>
        );
    }

    // Show message if no data
    if (!loading && !error && allData.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div>No application data found</div>
                <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
                    Check browser console for API response details
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <ApplicationStatusTable
                    columns={columns}
                    data={data}
                    onSelectRow={handleSelectRow}
                    onNavigateToSale={handleNavigateToSale}
                    onNavigateToConfirmation={handleNavigateToConfirmation}
                    onNavigateToDamage={handleNavigateToDamage}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    totalData={data.length}
                />
            </div>
        </div>
    );

};

export default ApplicationStatusTableToManageData;