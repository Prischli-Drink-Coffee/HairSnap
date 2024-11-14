import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import MyModal from "../../myModal/my_modal";
import UlForTable from "../forTable/ulForTable/ul_for_table";
import styles from "../forTable/table.module.css";
import UlToClickTmc from "./ulToClickTmcs/ul_to_click_tmcs";
import Select from "react-select";
import TmcEditForm from "../../forms/tmc/tmc_edit_form";
import useWindowDimensions from "../../../hooks/window_dimensions";

const TableTmcs = ({ getTmcList, tmcList }) => {
  const [sort, setSort] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState();
  const { width, height } = useWindowDimensions();
  const [tmcId, setTmcId] = useState(-1);

  return (
    <Box
      overflowX={width <= 944 ? "scroll" : "auto"}
      className={styles.table__Box}
      display="block"
      width={width <= 944 ? "100%" : "100%"}
    >
      <MyModal
        visibleModal={visibleEditModal}
        setVisibleModal={setVisibleEditModal}
      >
        <TmcEditForm
          visibleModal={visibleEditModal}
          setVisibleModal={setVisibleEditModal}
          getTmcList={getTmcList}
          tmcId={tmcId}
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
              <UlForTable sort={sort} setSort={setSort} name="Свойства" />
            </td>
            <td className={styles.table__td}></td>
          </tr>
        </thead>
        <tbody>
          {tmcList?.map((tmc, index) => (
            <tr className={styles.table__tbody_tr} key={tmc.id}>
              <td className={styles.table__td}>{index + 1}.</td>
              <td className={styles.table__td}>{tmc.name}</td>
              <td className={styles.table__td}>
                <ul>
                  <Select
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 3 }) }}
                    options={tmc.properties.map((property) => {
                      return {
                        label: property.name + " " + property.type,
                      };
                    })}
                    placeholder={"Свойства"}
                  />
                </ul>
                {tmc.type}
              </td>
              <td className={styles.table__td}>
                <UlToClickTmc
                  tmcId={tmc.id}
                  setTmcId={setTmcId}
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

export default TableTmcs;
