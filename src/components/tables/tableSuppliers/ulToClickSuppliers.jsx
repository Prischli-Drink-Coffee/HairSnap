import React from "react";
import { Image } from "@chakra-ui/react";
import edit from "../../../images/edit.svg";
import styles from "../forTable/ul_to_click.module.css";

const UlToClickSuppliers = ({
  supplierId,
  setSupplierId,
  setVisibleEditSupplierModal,
}) => {
  return (
    <ul className={styles.UlToClick}>
      <li className={`${styles.UlToClick__li} ${styles.UlToClick__li_first}`}>
        <Image
          className={styles.UlToClick__Icon}
          src={edit}
          w="16px"
          h="16px"
          onClick={() => {
            setSupplierId(supplierId);
            setVisibleEditSupplierModal(true);
          }}
        />
      </li>
    </ul>
  );
};

export default UlToClickSuppliers;