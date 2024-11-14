import React from "react";
import styles from "../../forTable/ul_to_click.module.css";
import { GiConfirmed } from "react-icons/gi";

const UlToClickWriteoff = ({
  writeoffId,
  setWriteOffId,
  setVisibleConfirmModal,
}) => {
  return (
    <ul className={styles.UlToClick}>
      <li className={`${styles.UlToClick__li} ${styles.UlToClick__li_first}`}>
        <button
          onClick={() => {
            setWriteOffId(writeoffId);
            setVisibleConfirmModal(true);
          }}
        >
          <GiConfirmed />
        </button>
      </li>
    </ul>
  );
};

export default UlToClickWriteoff;
