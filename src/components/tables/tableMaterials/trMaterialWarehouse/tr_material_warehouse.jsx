import React from "react";
import styles from "../../forTable/table.module.css";
import AllWarehouses from "../all_warehouses_count";
import UlToClickMaterial from "../ulToClickMaterial/ul_to_click_material";

const TrMaterialWarehouse = ({
  warehouse,
  index,
  material,
  warehouseId,
  setMaterialId,
  setVisibleEditModal,
  setVisibleCreatePurchaseModal,
  setVisibleCreateTrimModal,
  setVisibleToWarehouse,
  setVisibleWarehouseToWarehouse,
}) => {
  return (
    <>
      <tr className={styles.table__tbody_tr}>
        <td>{warehouse.warehouse}</td>
      </tr>
      <tr className={styles.table__tbody_tr}>
        <td className={styles.table__td}>{index + 1}.</td>
        <td className={styles.table__td}>{material.name}</td>
        <td className={styles.table__td}>{material.tmcName}</td>
        <td className={styles.table__td}>{material.tmcTypeName}</td>
        <td className={styles.table__td}>{material.supplierNames}</td>
        <td className={styles.table__td}>{material.averagePrice}</td>
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
            setVisibleCreatePurchaseModal={setVisibleCreatePurchaseModal}
            setVisibleCreateTrimModal={setVisibleCreateTrimModal}
            setVisibleToWarehouse={setVisibleToWarehouse}
            setVisibleWarehouseToWarehouse={setVisibleWarehouseToWarehouse}
          />
        </td>
      </tr>
    </>
  );
};

export default TrMaterialWarehouse;
