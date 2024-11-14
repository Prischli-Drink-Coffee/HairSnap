import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import styles from "../forTable/table.module.css";
import UlForTable from "../forTable/ulForTable/ul_for_table";
import MyModal from "../../myModal/my_modal";
import UlToClickDeliveryMethod from "./ulToClickDeliveryMethod/ul_to_click_delivery_method";
import DeliveryMethodEditForm from "../../forms/deliveryMethod/delivery_method_edit_form";
import useWindowDimensions from "../../../hooks/window_dimensions";

const TableDeliveryMethods = ({
  getDeliveryMethodList,
  deliveryMethodList,
}) => {
  const [sort, setSort] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState();

  const [deliveryMethodId, setDeliveryMethodId] = useState(-1);
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
        <DeliveryMethodEditForm
          visibleModal={visibleEditModal}
          setVisibleModal={setVisibleEditModal}
          deliveryMethodId={deliveryMethodId}
          getDeliveryMethodList={getDeliveryMethodList}
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
          {deliveryMethodList?.map((deliveryMethod, index) => (
            <tr className={styles.table__tbody_tr} key={deliveryMethod.id}>
              <td className={styles.table__td}>{index + 1}.</td>
              <td className={styles.table__td}>{deliveryMethod.name}</td>
              <td className={styles.table__td}>
                <UlToClickDeliveryMethod
                  deliveryMethodId={deliveryMethod.id}
                  setDeliveryMethodId={setDeliveryMethodId}
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

export default TableDeliveryMethods;
