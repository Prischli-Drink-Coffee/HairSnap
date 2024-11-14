import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import styles from "./forTable/table.module.css";
import UlForTable from "./forTable/ulForTable/ul_for_table";
import Pagination from "../pagination/pagination";
import { useFetching } from "../../hooks/useFetching";
import { convertDateString, convertDateToYesterday } from "../../helperFunc/convertDateToYesterday";
import useWindowDimensions from "../../hooks/window_dimensions";
import LogsService from "../../API/services/logs_service";

const TableLogs = () => {
  const [sort, setSort] = useState(false);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsList, setLogsList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCountPurchases, setTotalCountPurchases] = useState(0);
  const { width, height } = useWindowDimensions();

  const [getLogsList, logsListError] = useFetching(async () => {
    await LogsService.getLogs(currentPage, currentPageSize).then((response) => {
      setLogsList(response.data.logs);
      setTotalPages(response.data.totalPages);
      setTotalCountPurchases(response.data.totalItems);
    });
  });

  useEffect(() => {
    getLogsList();
  }, [currentPage, currentPageSize]);

  return (
    <Box
      className={styles.table__Box}
      overflowX={width <= 944 ? "scroll" : "auto"}
      display="block"
      width={width <= 944 ? "100%" : "100%"}
    >
      {logsListError ? (
        <div>{logsListError}</div>
      ) : (
        <table className={styles.table} width={width <= 944 ? "944px" : "100%"}>
          <thead>
            <tr className={styles.table__thead_tr}>
              <td style={{width:'150px'}}>
                <Text fontWeight={'bold'}>
                    Тип сведений
                </Text>
              </td>
              <td style={{width:'60%'}}>
                <Text fontWeight={'bold'}>Сообщение</Text>
              </td>
              <td style={{width:'150px'}}>
                <Text fontWeight={'bold'}>Дата</Text>
              </td>
            </tr>
          </thead>
          <tbody>
            {logsList?.map((log, index) => (
              <tr className={styles.table__tbody_tr} key={log.id}>
                <td className={styles.table__td}>{log.level}</td>
                <td className={styles.table__td}>{log.message}</td>
                <td className={styles.table__td}>
                  {convertDateString(log.datetime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination
        totalCountItem={totalCountPurchases}
        className={styles.table__footer}
        currentPageSize={currentPageSize}
        setCurrentPageSize={setCurrentPageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
};

export default TableLogs;
