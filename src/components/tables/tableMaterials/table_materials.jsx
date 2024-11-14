import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import styles from "../forTable/table.module.css";
import Pagination from "../../pagination/pagination";
import UlForTable from "../forTable/ulForTable/ul_for_table";
import MyModal from "../../myModal/my_modal";
import MaterialEditForm from "../../forms/material/material_edit_form";
import useWindowDimensions from "../../../hooks/window_dimensions";
import WarehouseToWarehouseNotification from "../../forms/material/warehouse_to_warehouse_notification";
import MaterialToWarehouseNotification from "../../forms/material/material_to_warehouse_notification";
import MaterialTrimCreateForm from "../../forms/material/material_trim_create_form";
import PurchaseCreateForm from "../../forms/purchase/purchase_create_form";
import MaterialService from "../../../API/services/material_service";
import AllWarehouses from "./all_warehouses_count";
import UlToClickMaterial from "./ulToClickMaterial/ul_to_click_material";
import TrMaterialWarehouse from "./trMaterialWarehouse/tr_material_warehouse";

const TableMaterials = ({
  measure,
  totalPages,
  materialList,
  currentPage,
  setCurrentPage,
  currentPageSize,
  setCurrentPageSize,
  totalCountMaterials,
  warehouseId,
  getMaterialList,
}) => {
  const [sort, setSort] = useState(false);
  const [materialId, setMaterialId] = useState(-1);
  const [visibleEditModal, setVisibleEditModal] = useState();
  const [visibleCreateTrimModal, setVisibleCreateTrimModal] = useState();
  const [visibleCreatePurchaseModal, setVisibleCreatePurchaseModal] =
    useState();
  const [visibleToWarehouse, setVisibleToWarehouse] = useState(false);
  const [visibleWarehouseToWarehouse, setVisibleWarehouseToWarehouse] =
    useState(false);
  const { width, height } = useWindowDimensions();
  const getCountAll = async (id) => {
    const result = await MaterialService.getMaterial(id);
    return result.data.name;
  };

  return (
    <Box
      className={styles.table__Box}
      overflowX={width <= 944 ? "scroll" : "auto"}
      display="block"
      width={width <= 944 ? "100%" : "100%"}
    >
      <MyModal
        visibleModal={visibleWarehouseToWarehouse}
        setVisibleModal={setVisibleWarehouseToWarehouse}
      >
        <WarehouseToWarehouseNotification
          materialId={materialId}
          warehouseId={warehouseId}
          setVisibleModal={setVisibleWarehouseToWarehouse}
          getMaterialList={getMaterialList}
          visibleModal={visibleWarehouseToWarehouse}
        />
      </MyModal>
      <MyModal
        visibleModal={visibleEditModal}
        setVisibleModal={setVisibleEditModal}
      >
        <MaterialEditForm
          measure={measure}
          visibleModal={visibleEditModal}
          setVisibleModal={setVisibleEditModal}
          materialId={materialId}
          getMaterialList={getMaterialList}
        />
      </MyModal>
      <MyModal
        visibleModal={visibleCreatePurchaseModal}
        setVisibleModal={setVisibleCreatePurchaseModal}
      >
        <PurchaseCreateForm
          visibleModal={visibleCreatePurchaseModal}
          setVisibleModal={setVisibleCreatePurchaseModal}
          materialId={materialId}
        />
      </MyModal>
      <MyModal
        visibleModal={visibleToWarehouse}
        setVisibleModal={setVisibleToWarehouse}
      >
        <MaterialToWarehouseNotification
          visibleModal={visibleToWarehouse}
          setVisibleModal={setVisibleToWarehouse}
          materialId={materialId}
          getMaterialList={getMaterialList}
        />
      </MyModal>
      <MyModal
        visibleModal={visibleCreateTrimModal}
        setVisibleModal={setVisibleCreateTrimModal}
      >
        <MaterialTrimCreateForm
          visibleModal={visibleCreateTrimModal}
          setVisibleModal={setVisibleCreateTrimModal}
          materialId={materialId}
          getMaterialList={getMaterialList}
        />
      </MyModal>
      <table className={styles.table} width={width <= 944 ? "944px" : "100%"}>
        <thead>
          <tr className={styles.table__thead_tr}>
            <td className={styles.table__td}>
              <UlForTable name="№" />
            </td>
            <td>
              <UlForTable
                sort={sort}
                setSort={setSort}
                name="Название материала"
              />
            </td>
            <td className={styles.table__td}>
              <UlForTable sort={sort} setSort={setSort} name="ТМЦ" />
            </td>
            <td className={styles.table__td}>
              <UlForTable sort={sort} setSort={setSort} name="Тип ТМЦ" />
            </td>
            <td className={styles.table__td}>
              <UlForTable sort={sort} setSort={setSort} name="Поставщики" />
            </td>
            <td className={styles.table__td}>
              <UlForTable sort={sort} setSort={setSort} name="Средняя цена" />
            </td>
            <td className={styles.table__td}>
              <UlForTable
                sort={sort}
                setSort={setSort}
                name={
                  warehouseId === null
                    ? "Кол-во на всех складах"
                    : warehouseId > 0
                    ? "Кол-во на складе"
                    : "Кол-во нераспределенных"
                }
              />
            </td>
            <td className={styles.table__td}></td>
          </tr>
        </thead>
        <tbody>
          {warehouseId === null
            ? materialList?.map((warehouse, index) => {
                return warehouse?.materials?.map((material, index) => {
                  if (index === 0) {
                    return (
                      <TrMaterialWarehouse
                        key={`${material.id} ${warehouse.warehouse}`}
                        warehouseId={warehouseId}
                        material={material}
                        warehouse={warehouse}
                        index={index}
                        setMaterialId={setMaterialId}
                        setVisibleEditModal={setVisibleEditModal}
                        setVisibleCreatePurchaseModal={
                          setVisibleCreatePurchaseModal
                        }
                        setVisibleCreateTrimModal={setVisibleCreateTrimModal}
                        setVisibleToWarehouse={setVisibleToWarehouse}
                        setVisibleWarehouseToWarehouse={
                          setVisibleWarehouseToWarehouse
                        }
                      />
                    );
                  }
                  return (
                    <tr
                      className={styles.table__tbody_tr}
                      key={`${material.id} ${warehouse.warehouse}`}
                    >
                      <td className={styles.table__td}>{index + 1}.</td>
                      <td className={styles.table__td}>{material.name}</td>
                      <td className={styles.table__td}>{material.tmcName}</td>
                      <td className={styles.table__td}>
                        {material.tmcTypeName}
                      </td>
                      <td className={styles.table__td}>
                        {material.supplierNames}
                      </td>
                      <td className={styles.table__td}>
                        {material.averagePrice}
                      </td>
                      <td className={styles.table__td}>
                        {warehouseId == null ? (
                          <AllWarehouses materialId={material.id} />
                        ) : (
                          material.count
                        )}
                      </td>
                      <td>
                        <UlToClickMaterial
                          warehouseId={warehouseId}
                          materialId={material.id}
                          trim={material.trim}
                          setMaterialId={setMaterialId}
                          setVisibleEditModal={setVisibleEditModal}
                          setVisibleCreatePurchaseModal={
                            setVisibleCreatePurchaseModal
                          }
                          setVisibleCreateTrimModal={setVisibleCreateTrimModal}
                          setVisibleToWarehouse={setVisibleToWarehouse}
                          setVisibleWarehouseToWarehouse={
                            setVisibleWarehouseToWarehouse
                          }
                        />
                      </td>
                    </tr>
                  );
                });
              })
            : materialList?.map((material, index) => (
                <tr className={styles.table__tbody_tr} key={material.id}>
                  <td className={styles.table__td}>{index + 1}.</td>
                  <td className={styles.table__td}>{material.name}</td>
                  <td className={styles.table__td}>{material.tmcName}</td>
                  <td className={styles.table__td}>{material.tmcTypeName}</td>
                  <td className={styles.table__td}>{material.supplierNames}</td>
                  <td className={styles.table__td}>{material.averagePrice}</td>
                  <td className={styles.table__td}>
                    {warehouseId === null ? (
                      <AllWarehouses materialId={material.id} />
                    ) : (
                      material.count
                    )}
                  </td>
                  <td>
                    <UlToClickMaterial
                      warehouseId={warehouseId}
                      materialId={material.id}
                      trim={material.trim}
                      setMaterialId={setMaterialId}
                      setVisibleEditModal={setVisibleEditModal}
                      setVisibleCreatePurchaseModal={
                        setVisibleCreatePurchaseModal
                      }
                      setVisibleCreateTrimModal={setVisibleCreateTrimModal}
                      setVisibleToWarehouse={setVisibleToWarehouse}
                      setVisibleWarehouseToWarehouse={
                        setVisibleWarehouseToWarehouse
                      }
                    />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      <Pagination
        totalCountItem={totalCountMaterials}
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

export default TableMaterials;
