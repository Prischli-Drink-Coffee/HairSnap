import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import styles from "./forTable/table.module.css";
import UserService from "../../API/services/user_service";
import MyModal from "./../myModal/my_modal";
import useWindowDimensions from "./../../hooks/window_dimensions";
import Pagination from "../pagination/pagination";
import UlToClickUser from "./ultoclickuser";
import { useFetching } from "../../hooks/useFetching";
import WarehouseService from "../../API/services/warehouse_service";
import UserEditForm from "../forms/user/edit_user";

const TableUsers = () => {
  const [sort, setSort] = useState(false);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersList, setUsersList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCountUsers, setTotalCountUsers] = useState(0);
  const [visibleEditUserModal, setVisibleEditUserModal] = useState();
  const [userId, setUserId] = useState(-1);
  const { width, height } = useWindowDimensions();
  const [warehouses, setWarehouses] = useState([
    {
      id: 3,
      name: "asdasd",
    },
  ]);
  const [userInfo, setUserInfo] = useState({
    login: "",
    username: "",
    password: "",
    role: "",
    warehouseId: 1,
  });

  const [getUsersList, usersListError] = useFetching(async () => {
    await UserService.getAll(currentPage, currentPageSize).then((response) => {
      setUsersList(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalCountUsers(response.data.totalItems);
    });
  });
  const [getWarehousesList, warehousesListError] = useFetching(async () => {
    const result = await WarehouseService.getWarehouses();
    setWarehouses(result.data);
  });

  useEffect(() => {
    getUsersList();
  }, [currentPage, currentPageSize]);

  useEffect(() => {
    getWarehousesList();
  }, []);
  const findWarehouse = (id) => {
    let found = warehouses.find((item) => item.id == id);
    if (found) return found.name;
    else return "Все склады";
  };
  const getUserInfo = (id) => {
    let found = usersList.find((item) => item.id == id);
    let userData = {
      login: found.login,
      username: found.userName,
      password: "",
      role: found.userRole,
      warehouseId: found.warehouseId,
    };
    setUserInfo(userData);
  };

  return (
    <Box
      className={styles.table__Box}
      overflowX={width <= 944 ? "scroll" : "auto"}
      display="block"
      width={width <= 944 ? "100%" : "100%"}
    >
      <MyModal
        visibleModal={visibleEditUserModal}
        setVisibleModal={setVisibleEditUserModal}
      >
        <UserEditForm
          setVisibleModal={setVisibleEditUserModal}
          purchaseId={userId}
          getPurchaseList={getUsersList}
          userInfo={userInfo}
          warehouses={warehouses}
        />
      </MyModal>
      {usersListError ? (
        <div>{usersListError}</div>
      ) : (
        <table className={styles.table} width={width <= 944 ? "944px" : "100%"}>
          <thead>
            <tr className={styles.table__thead_tr}>
              <td className={styles.table__td}>
                <Text>№</Text>
              </td>
              <td>
                <Text>Имя</Text>
              </td>
              <td className={styles.table__td}>
                <Text>Логин</Text>
              </td>
              <td className={styles.table__td}>
                <Text>Роль</Text>
              </td>
              <td className={styles.table__td}>
                <Text>Склад</Text>
              </td>
              <td className={styles.table__td}></td>
            </tr>
          </thead>
          <tbody>
            {usersList?.map((purchase, index) => (
              <tr className={styles.table__tbody_tr} key={purchase.id}>
                <td className={styles.table__td}>{index + 1}.</td>
                <td className={styles.table__td}>{purchase.userName}</td>
                <td className={styles.table__td}>{purchase.login}</td>
                <td className={styles.table__td}>
                  {purchase.userRole == "ADMIN"
                    ? "Администратор"
                    : purchase.userRole == "WAREHOUSE_RESPONSIBLE"
                    ? "Ответственный по складу"
                    : purchase.userRole == "MASTER"
                    ? "Мастер"
                    : purchase.userRole == "DESIGNER"
                    ? "Дизайнер"
                    : purchase.userRole == "MANAGER"
                    ? "Менеджер"
                    : purchase.userRole}
                </td>
                <td className={styles.table__td}>
                  {findWarehouse(purchase.warehouseId)}
                </td>
                <td className={styles.table__td}>
                  <UlToClickUser
                    setUserId={setUserId}
                    userId={purchase.id}
                    setVisibleEditUserModal={setVisibleEditUserModal}
                    getUserInfo={getUserInfo}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination
        totalCountItem={totalCountUsers}
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

export default TableUsers;
