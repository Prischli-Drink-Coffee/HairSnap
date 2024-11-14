import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Tooltip, VStack } from "@chakra-ui/react";
import MyModal from "../../myModal/my_modal";
import UlForTable from "../forTable/ulForTable/ul_for_table";
import styles from "../forTable/table.module.css";
import useWindowDimensions from "../../../hooks/window_dimensions";
import UlToClickWriteoff from "./ulToClickWriteoffs/ul_to_click_writeoff";
import { convertDateString } from "../../../helperFunc/convertDateToYesterday";
import WriteoffConfirmForm from "../../forms/writeOff/writeoff_confirm_form";
import { useCookies } from "react-cookie";
import { useFetching } from "../../../hooks/useFetching";
import WriteOffService from "../../../API/services/writeoff_service";
import WriteoffCreateForm from "../../forms/writeOff/writeoff_create_form";
import Pagination from "../../pagination/pagination";

const TableWriteoffs = () => {
  const [cookie, setCookie] = useCookies();
  const [sort, setSort] = useState(false);
  const [visibleConfirmModal, setVisibleConfirmModal] = useState();
  const [writeOffId, setWriteOffId] = useState(-1);
  const { width, height } = useWindowDimensions();
  const [visibleCreateModal, setVisibleCreateModal] = useState();
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCountUsers, setTotalCountUsers] = useState(0);
  const [writeoffList, setWriteoffList] = useState([
    {
      id: 1,
      reason: "string",
      user: {
        id: 1,
        login: "admin@mail.ru",
        userName: "admin",
        userRole: "ADMIN",
        warehouseId: -1,
      },
      dateOfConfirmation: "2024-02-02T15:48:57.743491Z",
      supplier: {
        id: 2,
        name: "Annne",
        brand: "Luts",
        website: "pie.org",
        address: "улица",
        email: "anl@mail.ru",
        phone: "12345",
        comment: null,
        supplierType: "LEGAL_ENTITY",
        staff: [],
        deliveryPlaces: [
          {
            id: 1,
            address: "Ульяновск 12 сентября дом 36",
            comment: null,
          },
        ],
        client: true,
        inn: "string",
        ksch: "string",
        psch: "string",
        kpp: "string",
        bic: "string",
      },
      comment: null,
      materials: [
        {
          id: 2,
          name: "string",
          comment: null,
          tmcName: "string",
          tmcTypeName: "string",
          supplierNames: "string",
          count: 890,
          show: true,
          trim: false,
        },
      ],
      totalPrice: 101400000,
    },
  ]);

  const [getWriteOffList, warehouseListError] = useFetching(async () => {
    const response = await WriteOffService.getWriteoffs(
      currentPage,
      currentPageSize,
    );
    setWriteoffList(response.data.writeOffs);
    setTotalPages(response.data.totalPages);
    setTotalCountUsers(response.data.totalItems);
  });

  useEffect(() => {
    getWriteOffList();
  }, [currentPage, currentPageSize]);
  return (
    <VStack width="100%">
      <HStack color={"black"} width="100%">
        <HStack color={"black"} width="100%">
          <Tooltip
            label="Для создания списания выберите нужный материал, склад и клиента(если материал продан)"
            aria-label="Подсказка"
          >
            <Button
              variant="menu_yellow"
              onClick={() => setVisibleCreateModal(true)}
            >
              Создать списание
            </Button>
          </Tooltip>
        </HStack>
      </HStack>
      <Box
        className={styles.table__Box}
        overflowX={width <= 944 ? "scroll" : "auto"}
        display="block"
        width={width <= 944 ? "100%" : "100%"}
      >
        <MyModal
          visibleModal={visibleCreateModal}
          setVisibleModal={setVisibleCreateModal}
        >
          <WriteoffCreateForm
            visibleModal={visibleCreateModal}
            setVisibleModal={setVisibleCreateModal}
            getWriteOffList={getWriteOffList}
          />
        </MyModal>
        <MyModal
          visibleModal={visibleConfirmModal}
          setVisibleModal={setVisibleConfirmModal}
        >
          <WriteoffConfirmForm
            setVisibleModal={setVisibleConfirmModal}
            getWriteOffList={getWriteOffList}
            writeOffId={writeOffId}
          />
        </MyModal>
        <table className={styles.table} width={width <= 944 ? "944px" : "100%"}>
          <thead>
            <tr className={styles.table__thead_tr}>
              <td className={styles.table__td}>
                <UlForTable name="№" />
              </td>
              <td>
                <UlForTable sort={sort} setSort={setSort} name="Причина" />
              </td>
              <td>
                <UlForTable sort={sort} setSort={setSort} name="Материалы" />
              </td>
              <td>
                <UlForTable sort={sort} setSort={setSort} name="Сумма" />
              </td>
              <td>
                <UlForTable sort={sort} setSort={setSort} name="Клиент" />
              </td>
              <td>
                <UlForTable sort={sort} setSort={setSort} name="Оформил" />
              </td>
              <td>
                <UlForTable
                  sort={sort}
                  setSort={setSort}
                  name="Дата подтверждения"
                />
              </td>
              <td className={styles.table__td}></td>
            </tr>
          </thead>
          <tbody>
            {writeoffList?.map((writeoff, index) => (
              <tr className={styles.table__tbody_tr} key={writeoff.id}>
                <td className={styles.table__td}>{writeoff.id}.</td>
                <td className={styles.table__td}>{writeoff.reason}</td>
                <td className={styles.table__td} style={{ minWidth: "300px" }}>
                  {writeoff.materials.map(
                    (material) =>
                      `|${material.name} ${material.tmcName} ${material.tmcTypeName} кол-во ${material.count} |`,
                  )}
                </td>
                <td className={styles.table__td}>{writeoff.totalPrice}</td>
                <td className={styles.table__td}>
                  {writeoff.supplier ? writeoff.supplier.name : ""}
                </td>
                <td className={styles.table__td}>{writeoff.user.userName}</td>
                <td className={styles.table__td}>
                  {writeoff.dateOfConfirmation === null
                    ? "Не подтверждено"
                    : convertDateString(writeoff.dateOfConfirmation)}
                </td>
                <td className={styles.table__td}>
                  {writeoff.dateOfConfirmation === null &&
                  (cookie.warehouseId === writeoff.user.warehouseId ||
                    cookie.role === "ADMIN") ? (
                    <UlToClickWriteoff
                      writeoffId={writeoff.id}
                      setWriteOffId={setWriteOffId}
                      setVisibleConfirmModal={setVisibleConfirmModal}
                    />
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </VStack>
  );
};

export default TableWriteoffs;
