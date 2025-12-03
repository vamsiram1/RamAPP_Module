import { Routes, Route } from "react-router-dom";
import GenericNavTabs from "../../widgets/GenericNavTab/GenericNavTabs";
import ApplicationStatus from "../../components/ApplicationStatus/components/ApplicationStatusToSetCategory/ApplicationStatusToSetCategory";
import styles from "./MainContainer.module.css";

const MainContainer = () => {
    // Define tabs for navigation
    
    return (
        <Routes>
          <Route path="/college-application-sale" element={<CollegeSaleForm />} />
          <Route path="/college-application-fast-sale" element={<CollegeFastSale />} />
          <Route path="/college-application-confirmation" element={<CollegeSaleConfirmationContainer />} />
          <Route path="/school-application-sale" element={<SchoolSale />} />
          <Route path="/school-application-confirmation" element={<SchoolSaleConfirmationContainer />} />
          <Route path="/damaged-form" element={<DamagedForm />} />
          <Route path="*" element={<MainContainer />} />
        </Routes>
    );
};

export default MainContainer;

