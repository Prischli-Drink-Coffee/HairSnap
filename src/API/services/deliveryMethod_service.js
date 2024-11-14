import { Instance } from "../instance";
import { deliveryMethodsUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class DeliveryMethodService {
  static getDeliveryMethods() {
    return Instance.get(deliveryMethodsUrl, {
      headers: { Authorization: getToken() },
    });
  }
  static getDeliveryMethod(deliveryMethodId) {
    return Instance.get(`${deliveryMethodsUrl}/${deliveryMethodId}`, {
      headers: { Authorization: getToken() },
    });
  }

  static updateDeliveryMethod(deliveryMethodId, deliveryMethod) {
    return Instance.put(
      `${deliveryMethodsUrl}/${deliveryMethodId}`,
      deliveryMethod,
      {
        headers: { Authorization: getToken() },
      },
    );
  }

  static createDeliveryMethod(deliveryMethod) {
    return Instance.post(deliveryMethodsUrl, deliveryMethod, {
      headers: { Authorization: getToken() },
    });
  }
}
