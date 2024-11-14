import React from "react";
import { Image, Tooltip } from "@chakra-ui/react";
import edit from "./../../images/edit.svg";
import styles from "./forTable/ul_to_click.module.css";

const UlToClickUser = ({
  userId,
  setUserId,
  setVisibleEditUserModal,
  getUserInfo
}) => {
  return (
    <ul className={styles.UlToClick}>
      <li className={`${styles.UlToClick__li} ${styles.UlToClick__li_first}`}>
        <Tooltip label='Смена пароля' aria-label="Подсказка">
          <Image
            className={styles.UlToClick__Icon}
            src={edit}
            w="16px"
            h="16px"
            onClick={() => {
              setUserId(userId);
              setVisibleEditUserModal(true);
              getUserInfo(userId)
            }}
          />
        </Tooltip>
      </li>
    </ul>
  );
};

export default UlToClickUser;