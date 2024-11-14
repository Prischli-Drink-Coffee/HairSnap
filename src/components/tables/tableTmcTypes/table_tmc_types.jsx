import React, { useState } from "react";
import { Box, Tooltip, VStack } from "@chakra-ui/react";
import MyModal from "../../myModal/my_modal";
import UlForTable from "../forTable/ulForTable/ul_for_table";
import styles from "../forTable/table.module.css";
import Select from "react-select";
import UlToClickTmcType from "./ulToClickTmcTypes/ul_to_click_tmc_type";
import TmcTypeEditForm from "../../forms/tmcTypes/tmc_type_edit_form";
import useWindowDimensions from "../../../hooks/window_dimensions";

const TableTmcTypes = ({ getTmcTypeList, tmcTypeList }) => {
  const [sort, setSort] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState();

  const [tmcTypeId, setTmcTypeId] = useState(-1);
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
        <TmcTypeEditForm
          visibleModal={visibleEditModal}
          setVisibleModal={setVisibleEditModal}
          getTmcTypeList={getTmcTypeList}
          tmcTypeId={tmcTypeId}
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
          {tmcTypeList?.map((tmcType, index) => (
            <tr className={styles.table__tbody_tr} key={tmcType.id}>
              <td className={styles.table__td}>{index + 1}.</td>
              <td className={styles.table__td}>{tmcType.name}</td>
              <td className={styles.table__td}>
                <ul>
                  <Tooltip label='Клик для просмотра' aria-label="Подсказка">
                    <VStack>
                      <Select
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 3 }),
                        }}
                        options={tmcType.properties.map((property) => {
                          return {
                            label: property.name + " " + property.type,
                          };
                        })}
                        placeholder={"Свойства"}
                      />
                    </VStack>
                  </Tooltip>
                </ul>
                {tmcType.type}
              </td>
              <td className={styles.table__td}>
                <UlToClickTmcType
                  tmcTypeId={tmcType.id}
                  setTmcTypeId={setTmcTypeId}
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

export default TableTmcTypes;
