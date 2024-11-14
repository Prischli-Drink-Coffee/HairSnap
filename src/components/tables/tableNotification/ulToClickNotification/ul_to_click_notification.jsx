import React from "react";
import styles from "../../forTable/ul_to_click.module.css";
import { Image } from "@chakra-ui/react";
import remove from "../../../../images/delete.svg";
import NotificationService from "../../../../API/services/notification_service";

const UlToClickNotification = ({ notificationId, getNotificationList }) => {
  const confirmNotification = async () => {
    await NotificationService.confirmNotification(notificationId);
    getNotificationList();
  };

  const deleteNotification = async () => {
    await NotificationService.deleteNotification(notificationId);
    getNotificationList();
  };

  return (
    <ul className={styles.UlToClick}>
      <li className={`${styles.UlToClick__li} ${styles.UlToClick__li_first}`}>
        <button
          onClick={() => {
            confirmNotification();
          }}
        >
          Подтвердить
        </button>
      </li>
      <li className={`${styles.UlToClick__li} ${styles.UlToClick__li_first}`}>
        <Image
          className={styles.UlToClick__Icon}
          src={remove}
          w="16px"
          h="16px"
          onClick={() => {
            deleteNotification();
          }}
        />
      </li>
    </ul>
  );
};

export default UlToClickNotification;
