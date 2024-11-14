import React from "react";
import { Image, Input, Text } from "@chakra-ui/react";
import styles from "./pagination.module.css";
import chevron_left_pagination from "../../images/chevron-left-pagination.svg";
import chevron_right_pagination from "../../images/chevron-right-pagination.svg";
import { usePagination } from "../../hooks/usePagination";

const Pagination = ({
  className,
  currentPage,
  setCurrentPage,
  totalPages,
  currentPageSize,
  setCurrentPageSize,
  totalCountItem,
}) => {
  const PaginationPages = usePagination(totalPages, currentPage);

  let pageSize =
    currentPageSize === ""
      ? 5
      : currentPageSize > totalCountItem
      ? totalCountItem
      : currentPageSize;

  const pageSizeСhangeability = (value) => {
    const validated = value.match(/^(\d*$)/);
    const currentMaterialCount = currentPage * pageSize;
    const pageNumberByTotalCount = Math.floor(totalCountItem / value);
    const pageNumberСalculable = Math.floor(currentMaterialCount / value);
    if ((validated && value[0] !== "0") || value === "") {
      setCurrentPageSize(value);
      setCurrentPage(
        currentMaterialCount > totalCountItem
          ? isFinite(pageNumberByTotalCount) && pageNumberByTotalCount !== 0
            ? pageNumberByTotalCount
            : 1
          : isFinite(pageNumberСalculable) && pageNumberСalculable !== 0
          ? pageNumberСalculable
          : 1,
      );
    }
  };
  return (
    <div className={`${className} ${styles.Pagination}`}>
      <Text fontSize={[13, 14]}>
        Показано {(currentPage - 1) * pageSize + 1} –{" "}
        {currentPage * pageSize > totalCountItem
          ? totalCountItem
          : currentPage * pageSize}{" "}
        из {totalCountItem}
      </Text>
      <div className={styles.Pagination__buttons}>
        <button
          className={styles.Pagination__button}
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage(1);
          }}
        >
          <Image src={chevron_left_pagination} />
        </button>
        {PaginationPages.map((page) => (
          <button
            className={styles.Pagination__button}
            disabled={page === currentPage}
            key={page}
            onClick={() => {
              setCurrentPage(page);
            }}
          >
            {page}
          </button>
        ))}
        <button
          className={styles.Pagination__button}
          disabled={currentPage === totalPages}
          onClick={() => {
            setCurrentPage(totalPages);
          }}
        >
          <Image src={chevron_right_pagination} />
        </button>
      </div>
      <div className={styles.Pagination__display_change}>
        <Text
          fontSize={[13, 14]}
          pr={15}
          whiteSpace="nowrap"
          className={styles.Pagination__display_change_text}
        >
          Показывать на странице:
        </Text>
        <Input
          borderColor="main_yellow"
          focusBorderColor="main_yellow"
          _hover={{ borderColor: "main_yellow" }}
          value={currentPageSize}
          onChange={(event) => pageSizeСhangeability(event.target.value)}
          height={8}
          width="60px"
        />
      </div>
    </div>
  );
};

export default Pagination;
