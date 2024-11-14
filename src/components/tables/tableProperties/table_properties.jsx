import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import MyModal from "../../myModal/my_modal";
import UlForTable from "../forTable/ulForTable/ul_for_table";
import styles from "../forTable/table.module.css";
import UlToClickProperty from "./ulToClickProperties/ul_to_click_property";
import PropertyEditForm from "../../forms/property/property_edit_form";
import useWindowDimensions from "../../../hooks/window_dimensions";
import {
  optionMeasureList,
  optionTypeList,
} from "../../forms/property/optionTypeList";

const TableProperties = ({ getPropertyList, propertyList }) => {
  const [sort, setSort] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState();

  const [propertyId, setPropertyId] = useState(-1);
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
        <PropertyEditForm
          setVisibleModal={setVisibleEditModal}
          getPropertyList={getPropertyList}
          propertyId={propertyId}
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
            <td className={styles.table__td}>
              <UlForTable sort={sort} setSort={setSort} name="Тип" />
            </td>{" "}
            <td className={styles.table__td}>
              <UlForTable
                sort={sort}
                setSort={setSort}
                name="Единица измерения"
              />
            </td>
            <td className={styles.table__td}></td>
          </tr>
        </thead>
        <tbody>
          {propertyList?.map((property, index) => (
            <tr className={styles.table__tbody_tr} key={property.id}>
              <td className={styles.table__td}>{index + 1}.</td>
              <td className={styles.table__td}>{property.name}</td>
              <td className={styles.table__td}>
                {
                  optionTypeList.find((type) => type.value === property.type)
                    .label
                }
              </td>
              <td className={styles.table__td}>
                {
                  optionMeasureList.find(
                    (measure) => measure.value === property.measure,
                  ).label
                }
              </td>
              <td className={styles.table__td}>
                <UlToClickProperty
                  propertyId={property.id}
                  setPropertyId={setPropertyId}
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

export default TableProperties;
