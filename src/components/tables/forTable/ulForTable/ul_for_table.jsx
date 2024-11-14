import React from "react";
import { Image } from "@chakra-ui/react";
import chevronUp from "../../../../images/chevron-up.svg";
import noSort from "../../../../images/no-sort.svg";
import styles from "./ul_for_table.module.css";

const UlForTable = ({ sort, setSort, name }) => {
  return (
    <ul className={styles.UlForTable}>
      <li className={`${styles.UlForTable__li_first} ${styles.UlForTable__li}`}>
        {name}
      </li>
      {typeof sort === "undefined" ? null : sort ? (
        <li className={styles.UlForTable__li}>
          <Image
            src={chevronUp}
            w="16px"
            h="16px"
            onClick={() => {
              setSort((prev) => !prev);
            }}
          />
        </li>
      ) : (
        <li className={styles.UlForTable__li}>
          <Image
            src={noSort}
            w="16px"
            h="16px"
            onClick={() => {
              setSort((prev) => !prev);
            }}
          />
        </li>
      )}
    </ul>
  );
};

export default UlForTable;
