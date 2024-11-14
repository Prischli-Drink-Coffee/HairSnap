import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import styles from "../forTable/table.module.css";
import useWindowDimensions from "../../../hooks/window_dimensions";
import UlForTable from "../forTable/ulForTable/ul_for_table";
import UlToClickNotification from "./ulToClickNotification/ul_to_click_notification";

const TableNotifications = ({ notificationList, getNotificationList }) => {
  const [sort, setSort] = useState(false);
  const [notificationId, setNotificationId] = useState(-1);
  const { width, height } = useWindowDimensions();

  const convertToDate = (originalDateString) => {
    const date = new Date(originalDateString);

    return date.toISOString().replace("T", " ").split(".")[0];
  };

  return (
    <Box
      className={styles.table__Box}
      overflowX={width <= 944 ? "scroll" : "auto"}
      display="block"
      width={width <= 944 ? "100%" : "100%"}
    >
      <table className={styles.table} width={width <= 944 ? "944px" : "100%"}>
        <thead>
          <tr className={styles.table__thead_tr}>
            <td className={styles.table__td}>
              <UlForTable name="№" />
            </td>
            <td>
              <UlForTable sort={sort} setSort={setSort} name="Дата" />
            </td>
            <td className={styles.table__td}>
              <UlForTable sort={sort} setSort={setSort} name="Текущий склад" />
            </td>
            <td className={styles.table__td}>
              <UlForTable sort={sort} setSort={setSort} name="Новый склад" />
            </td>
            <td className={styles.table__td}>
              <UlForTable sort={sort} setSort={setSort} name="Материал" />
            </td>
            <td className={styles.table__td}>
              <UlForTable sort={sort} setSort={setSort} name={"Кол-во"} />
            </td>
            <td className={styles.table__td}>
              <UlForTable
                sort={sort}
                setSort={setSort}
                name={"Кол-во на складе"}
              />
            </td>
            <td className={styles.table__td}></td>
          </tr>
        </thead>
        <tbody>
          {notificationList?.map((notification, index) => (
            <tr
              className={styles.table__tbody_tr}
              key={notification.notificationId}
            >
              <td className={styles.table__td}>{index + 1}.</td>
              <td className={styles.table__td}>
                {convertToDate(notification.date)}
              </td>
              <td className={styles.table__td}>
                {notification.currentWarehouseName}
              </td>
              <td className={styles.table__td}>
                {notification.newWarehouseName}
              </td>
              <td className={styles.table__td}>{notification.materialName}</td>
              <td className={styles.table__td}>{notification.count}</td>
              <td className={styles.table__td}>
                {notification.avaliableCount}
              </td>
              <td>
                <UlToClickNotification
                  notificationId={notification.notificationId}
                  getNotificationList={getNotificationList}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default TableNotifications;
