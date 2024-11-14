import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import styles from "../forTable/table.module.css";
import Pagination from "../../pagination/pagination";
import PurchaseService from "../../../API/services/purchase_service";
import UrForTable from "../forTable/ulForTable/ul_for_table";
import UlToClickPurchase from "./ulToClickPurchase/ul_to_click_purchase";
import { useFetching } from "../../../hooks/useFetching";
import MyModal from "../../myModal/my_modal";
import PurchaseEditForm from "../../forms/purchase/purchase_edit_form";
import { convertDateToYesterday } from "../../../helperFunc/convertDateToYesterday";
import useWindowDimensions from "../../../hooks/window_dimensions";

const TablePurchases = () => {
  const [sort, setSort] = useState(false);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [purchaseList, setPurchaseList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCountPurchases, setTotalCountPurchases] = useState(0);
  const [visibleEditPurchaseModal, setVisibleEditPurchaseModal] = useState();
  const [purchaseId, setPurchaseId] = useState(-1);
  const { width, height } = useWindowDimensions();

  const [getPurchaseList, purchaseListError] = useFetching(async () => {
    await PurchaseService.getPurchases(currentPage, currentPageSize).then(
      (response) => {
        setPurchaseList(response.data.purchases);
        setTotalPages(response.data.totalPages);
        setTotalCountPurchases(response.data.totalItems);
      },
    );
  });

  useEffect(() => {
    getPurchaseList();
  }, [currentPage, currentPageSize]);

  return (
    <Box
      className={styles.table__Box}
      overflowX={width <= 944 ? "scroll" : "auto"}
      display="block"
      width={width <= 944 ? "100%" : "100%"}
    >
      <MyModal
        visibleModal={visibleEditPurchaseModal}
        setVisibleModal={setVisibleEditPurchaseModal}
      >
        <PurchaseEditForm
          setVisibleModal={setVisibleEditPurchaseModal}
          purchaseId={purchaseId}
          getPurchaseList={getPurchaseList}
        />
      </MyModal>
      {purchaseListError ? (
        <div>{purchaseListError}</div>
      ) : (
        <table className={styles.table} width={width <= 944 ? "944px" : "100%"}>
          <thead>
            <tr className={styles.table__thead_tr}>
              <td className={styles.table__td}>
                <UrForTable name="№" />
              </td>
              <td>
                <UrForTable
                  sort={sort}
                  setSort={setSort}
                  name="Название материала"
                />
              </td>
              <td className={styles.table__td}>
                <UrForTable
                  sort={sort}
                  setSort={setSort}
                  name="Артикул"
                />
              </td>
              <td className={styles.table__td}>
                <UrForTable sort={sort} setSort={setSort} name="Кол-во" />
              </td>
              <td className={styles.table__td}>
                <UrForTable sort={sort} setSort={setSort} name={"Цена"} />
              </td>
              <td className={styles.table__td}>
                <UrForTable sort={sort} setSort={setSort} name={"Поставщик"} />
              </td>
              <td className={styles.table__td}>
                <UrForTable sort={sort} setSort={setSort} name={"Дата"} />
              </td>
              <td className={styles.table__td}></td>
            </tr>
          </thead>
          <tbody>
            {purchaseList?.map((purchase, index) => (
              <tr className={styles.table__tbody_tr} key={purchase.id}>
                <td className={styles.table__td}>{index + 1}.</td>
                <td className={styles.table__td}>{purchase.materialName}</td>
                <td className={styles.table__td}>{purchase.articleNumber}</td>
                <td className={styles.table__td}>{purchase.count}</td>
                <td className={styles.table__td}>{purchase.price}</td>
                <td className={styles.table__td}>{purchase.supplier?.name}</td>
                <td className={styles.table__td}>
                  {convertDateToYesterday(purchase.dateTime)}
                </td>
                <td className={styles.table__td}>
                  <UlToClickPurchase
                    purchaseId={purchase.id}
                    setPurchaseId={setPurchaseId}
                    setVisibleEditPurchaseModal={setVisibleEditPurchaseModal}
                  />
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

export default TablePurchases;
