import React from "react";
import styles from "../../forTable/ul_to_click.module.css";
import { CiEdit, CiShoppingCart } from "react-icons/ci";
import { HiOutlineArrowsRightLeft } from "react-icons/hi2";
import { MdOutlineContentCut } from "react-icons/md";
import { HStack, Tooltip } from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import { roles } from "../../../header/paths";

const UlToClickMaterial = ({
  warehouseId,
  materialId,
  trim,
  setMaterialId,
  setVisibleEditModal,
  setVisibleCreatePurchaseModal,
  setVisibleCreateTrimModal,
  setVisibleToWarehouse,
  setVisibleWarehouseToWarehouse,
}) => {
  const [cookie, setCookie] = useCookies();

  return (
    <ul className={styles.UlToClick}>
      {cookie.role === roles.ADMIN ||
      cookie.role === roles.WAREHOUSE_RESPONSIBLE ? (
        <li className={`${styles.UlToClick__li} ${styles.UlToClick__li_first}`}>
          <button
            onClick={() => {
              setMaterialId(materialId);
              setVisibleEditModal(true);
            }}
          >
            <Tooltip label='Просмотр/редактирование карточки материала' aria-label="Подсказка">
              <HStack>
                <CiEdit />
              </HStack>
            </Tooltip>
          </button>
        </li>
      ) : (
        <li className={`${styles.UlToClick__li}`} />
      )}
      {trim ? (
        <li className={`${styles.UlToClick__li}`}>
          <button
            onClick={() => {
              setMaterialId(materialId);
              setVisibleCreateTrimModal(true);
            }}
          >
            <Tooltip label='Создание обрезка материала' aria-label="Подсказка">
              <HStack>
                <MdOutlineContentCut />
              </HStack>
            </Tooltip>
          </button>
        </li>
      ) : (
        <li className={`${styles.UlToClick__li}`} />
      )}
      {cookie.role === roles.ADMIN ||
      cookie.role === roles.WAREHOUSE_RESPONSIBLE ? (
        <>
          <li className={styles.UlToClick__li}>
            <button
              onClick={() => {
                setMaterialId(materialId);
                setVisibleCreatePurchaseModal(true);
              }}
            >
              <Tooltip label='Создать закупку' aria-label="Подсказка">
                <HStack>
                  <CiShoppingCart width="16px" height="16px" />
                </HStack>
              </Tooltip>
            </button>
          </li>
          {warehouseId < 0 ? (
            <li className={styles.UlToClick__li}>
              <button
                onClick={() => {
                  setMaterialId(materialId);
                  setVisibleToWarehouse(true);
                }}
              >
                <Tooltip label='Перемещение материала' aria-label="Подсказка">
                  <HStack>
                    <HiOutlineArrowsRightLeft />
                  </HStack>
                </Tooltip>
              </button>
            </li>
          ) : (
            <li className={`${styles.UlToClick__li}`} />
          )}
        </>
      ) : (
        <>
          <li className={`${styles.UlToClick__li}`} />
          <li className={`${styles.UlToClick__li}`} />
        </>
      )}
      {warehouseId > 0 ? (
        <li className={styles.UlToClick__li}>
          <button
            onClick={() => {
              setMaterialId(materialId);
              setVisibleWarehouseToWarehouse(true);
            }}
          >
            Со склада на склад
          </button>
        </li>
      ) : (
        <li className={`${styles.UlToClick__li}`} />
      )}
    </ul>
  );
};

export default UlToClickMaterial;
