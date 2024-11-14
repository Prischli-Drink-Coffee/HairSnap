import { Instance } from "../instance";
import { deliveryPlacesUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class DeliveryPlaceService {
  static getDeliveryPlaces() {
    return Instance.get(deliveryPlacesUrl, {
      headers: { Authorization: getToken() },
    });
  }
  static getDeliveryPlace(deliveryPlaceId) {
    return Instance.get(`${deliveryPlacesUrl}/${deliveryPlaceId}`, {
      headers: { Authorization: getToken() },
    });
  }

  static updateDeliveryPlace(deliveryPlaceId, deliveryPlace) {
    return Instance.put(
      `${deliveryPlacesUrl}/${deliveryPlaceId}`,
      deliveryPlace,
      {
        headers: { Authorization: getToken() },
      },
    );
  }

  static createDeliveryPlace(deliveryPlace) {
    return Instance.post(deliveryPlacesUrl, deliveryPlace, {
      headers: { Authorization: getToken() },
    });
  }
}
