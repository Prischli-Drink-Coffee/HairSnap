import React from "react";
import { Image, Tooltip } from "@chakra-ui/react";
import edit from "../../../../images/edit.svg";
import styles from "../../forTable/ul_to_click.module.css";

const UlToClickProperty = ({
  propertyId,
  setPropertyId,
  setVisibleEditModal,
}) => {
  return (
    <ul className={styles.UlToClick}>
      <li className={`${styles.UlToClick__li} ${styles.UlToClick__li_first}`}>
        <Tooltip label='Редактировать свойство' aria-label="Подсказка">
          <Image
            className={styles.UlToClick__Icon}
            src={edit}
            w="16px"
            h="16px"
            onClick={() => {
              setPropertyId(propertyId);
              setVisibleEditModal(true);
            }}
          />
        </Tooltip>
      </li>
    </ul>
  );
};

export default UlToClickProperty;
