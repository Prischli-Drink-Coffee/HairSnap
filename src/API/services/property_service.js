import { Instance } from "../instance";
import { propertiesUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class PropertyService {
  static getProperties() {
    return Instance.get(propertiesUrl, {
      headers: { Authorization: getToken() },
    });
  }

  static getProperty(propertyId) {
    return Instance.get(`${propertiesUrl}/${propertyId}`, {
      headers: { Authorization: getToken() },
    });
  }

  static updateProperty(propertyId, property) {
    return Instance.put(`${propertiesUrl}/${propertyId}`, property, {
      headers: { Authorization: getToken() },
    });
  }

  static createProperty(property) {
    return Instance.post(propertiesUrl, property, {
      headers: { Authorization: getToken() },
    });
  }
}
