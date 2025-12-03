import React from "react";
import ApplicationStatusDataTable from "../../../../../widgets/ApplicationStatusDataTable/ApplicationStatusDataTable";
import styles from "./ApplicationStatusTableForData.module.css";

const ApplicationStatusTable = ({
  columns,
  data,
  onSelectRow,
  onNavigateToSale,
  onNavigateToConfirmation,
  onNavigateToDamage,
  pageIndex,
  setPageIndex,
  pageSize = 10,
  totalData,
  onUpdate,
  fieldMapping,
  formComponent,
}) => {
  return (
    <div className={styles.Application_Status_Table_application_status_table}>
      <ApplicationStatusDataTable
        columns={columns}
        data={data}
        onSelectRow={onSelectRow}
        onNavigateToSale={onNavigateToSale}
        onNavigateToConfirmation={onNavigateToConfirmation}
        onNavigateToDamage={onNavigateToDamage}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        totalData={totalData}
        onUpdate={onUpdate}
        fieldMapping={fieldMapping}
        formComponent={formComponent}
      />
    </div>
  );
};

export default ApplicationStatusTable;
