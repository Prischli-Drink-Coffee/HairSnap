import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import MyModal from "../../myModal/my_modal";
import UlForTable from "../forTable/ulForTable/ul_for_table";
import styles from "../forTable/table.module.css";
import UlToClickWarehouse from "./ulToClickWarehouses/ul_to_click_warehouse";
import useWindowDimensions from "../../../hooks/window_dimensions";
import WarehouseEditForm from "../../forms/warehouse/warehouse_edit_form";

const TableWarehouses = ({ getWarehouseList, warehouseList }) => {
  const [sort, setSort] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState();

  const [warehouseId, setWarehouseId] = useState(-1);
  const { width, height } = useWindowDimensions();
  return (
    <Box
      className={styles.table__Box}
      overflowX={width <= 944 ? "scroll" : "auto"}
      display="block"
      width={width <= 944 ? "100%" : "100%"}
    >
      <MyModal
        visibleModal={visibleEditModal}
        setVisibleModal={setVisibleEditModal}
      >
        <WarehouseEditForm
          setVisibleModal={setVisibleEditModal}
          getWarehouseList={getWarehouseList}
          warehouseId={warehouseId}
        />
      </MyModal>
      <table className={styles.table} width={width <= 944 ? "944px" : "100%"}>
        <thead>
          <tr className={styles.table__thead_tr}>
            <td className={styles.table__td}>
              <UlForTable name="№" />
            </td>
            <td>
              <UlForTable sort={sort} setSort={setSort} name="Название" />
            </td>
            <td className={styles.table__td}></td>
          </tr>
        </thead>
        <tbody>
          {warehouseList?.map((warehouse, index) => (
            <tr className={styles.table__tbody_tr} key={warehouse.id}>
              <td className={styles.table__td}>{index + 1}.</td>
              <td className={styles.table__td}>{warehouse.name}</td>
              <td className={styles.table__td}>
                <UlToClickWarehouse
                  warehouseId={warehouse.id}
                  setWarehouseId={setWarehouseId}
                  setVisibleEditModal={setVisibleEditModal}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default TableWarehouses;
