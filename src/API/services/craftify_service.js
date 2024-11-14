import { Instance } from "../instance";
import { craftifyUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class CraftifyService {
  static getCraftifies() {
    return Instance.get(craftifyUrl, {
      headers: { Authorization: getToken() },
    });
  }
  static getCraftify(craftifyId) {
    return Instance.get(`${craftifyUrl}/${craftifyId}`, {
      headers: { Authorization: getToken() },
    });
  }

  static updateCraftify(craftifyId, craftify) {
    return Instance.put(`${craftifyUrl}/${craftifyId}`, craftify, {
      headers: { Authorization: getToken() },
    });
  }

  static createCraftify(craftify) {
    return Instance.post(craftifyUrl, craftify, {
      headers: { Authorization: getToken() },
    });
  }
}
