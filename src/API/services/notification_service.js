import { Instance } from "../instance";
import { notificationsUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class NotificationService {
  static getNotifications() {
    return Instance.get(`${notificationsUrl}`, {
      headers: { Authorization: getToken() },
    });
  }

  static createNotification(transfer) {
    return Instance.post(`${notificationsUrl}`, transfer, {
      headers: { Authorization: getToken() },
    });
  }

  static confirmNotification(notificationId) {
    return Instance.post(`${notificationsUrl}/${notificationId}`, null, {
      headers: { Authorization: getToken() },
    });
  }

  static deleteNotification(notificationId) {
    return Instance.delete(`${notificationsUrl}/${notificationId}`, {
      headers: { Authorization: getToken() },
    });
  }
}
