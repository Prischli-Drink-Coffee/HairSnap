import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import styles from "../forTable/table.module.css";
import UlForTable from "../forTable/ulForTable/ul_for_table";
import MyModal from "../../myModal/my_modal";
import DeliveryPlaceEditForm from "../../forms/deliveryPlaces/delivery_place_edit_form";
import UlToClickDeliveryPlace from "./ulToClickDeliveryPlaces/ul_to_click_delivery_place";
import useWindowDimensions from "../../../hooks/window_dimensions";

const TableDeliveryPlaces = ({ getDeliveryPlaceList, deliveryPlaceList }) => {
  const [sort, setSort] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState();

  const [deliveryPlaceId, setDeliveryPlaceId] = useState(-1);
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
        <DeliveryPlaceEditForm
          setVisibleModal={setVisibleEditModal}
          deliveryPlaceId={deliveryPlaceId}
          getDeliveryPlaceList={getDeliveryPlaceList}
        />
      </MyModal>
      <table className={styles.table} width={width <= 944 ? "944px" : "100%"}>
        <thead>
          <tr className={styles.table__thead_tr}>
            <td className={styles.table__td}>
              <UlForTable name="№" />
            </td>
            <td>
              <UlForTable sort={sort} setSort={setSort} name="Адрес" />
            </td>
            <td>
              <UlForTable sort={sort} setSort={setSort} name="Комментарий" />
            </td>
            <td className={styles.table__td}></td>
          </tr>
        </thead>
        <tbody>
          {deliveryPlaceList?.map((deliveryPlace, index) => (
            <tr className={styles.table__tbody_tr} key={deliveryPlace.id}>
              <td className={styles.table__td}>{index + 1}.</td>
              <td className={styles.table__td}>{deliveryPlace.address}</td>
              <td className={styles.table__td}>{deliveryPlace.comment}</td>
              <td className={styles.table__td}>
                <UlToClickDeliveryPlace
                  deliveryPlaceId={deliveryPlace.id}
                  setDeliveryPlaceId={setDeliveryPlaceId}
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

export default TableDeliveryPlaces;
