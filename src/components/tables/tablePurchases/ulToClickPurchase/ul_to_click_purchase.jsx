import React from "react";
import { Image, Tooltip } from "@chakra-ui/react";
import edit from "../../../../images/edit.svg";
import styles from "../../forTable/ul_to_click.module.css";

const UlToClickPurchase = ({
  purchaseId,
  setPurchaseId,
  setVisibleEditPurchaseModal,
}) => {
  return (
    <ul className={styles.UlToClick}>
      <li className={`${styles.UlToClick__li} ${styles.UlToClick__li_first}`}>
        <Tooltip label='Редактирование данных закупки' aria-label="Подсказка">
          <Image
            className={styles.UlToClick__Icon}
            src={edit}
            w="16px"
            h="16px"
            onClick={() => {
              setPurchaseId(purchaseId);
              setVisibleEditPurchaseModal(true);
            }}
          />
        </Tooltip>
      </li>
    </ul>
  );
};

export default UlToClickPurchase;
