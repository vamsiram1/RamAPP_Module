import React from 'react';
import styles from './ApplicationStatusToSetCategory/ApplicationStatusToSetCategory.module.css';
import ApplicationStatusTableToManageData from './ApplicationStatusTableToManageData/ApplicationStatusTableToManageData';
import SearchResultCardWithStatus from '../../SearchResultCardWithStatus/SearchResultCardWithStatus';

const ApplicationStatusContent = ({
  search,
  filteredData,
  pageIndex,
  setPageIndex,
  handleCardClick,
  setData,
  studentCategory,
  selectedCampus,
  category,
  setSearch,
  navigate,
  handleNavigateToSalePage,
  employeeCampusId
}) => {
  // If there's a search query with at least 3 characters, show search results
  if (search && search.length >= 3) {
    return filteredData.length === 0 ? (
      <p className={styles["application-status__no-results"]}>
        No results found for "{search}"
      </p>
    ) : (
      <SearchResultCardWithStatus
        data={filteredData}
        maxResults={5}
        onCardClick={handleCardClick}
        category={category}
      />
    );
  }

  // Always show the table when there's no search, pass filters to it
    return (
    <ApplicationStatusTableToManageData 
      studentCategory={studentCategory}
      selectedCampus={selectedCampus}
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}
      onDataChange={setData}
      category={category}
      setSearch={setSearch}
      navigate={navigate}
      handleNavigateToSalePage={handleNavigateToSalePage}
      employeeCampusId={employeeCampusId}
    />
  );
};

export default ApplicationStatusContent;
