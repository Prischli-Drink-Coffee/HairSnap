import { Instance } from "../instance";
import { tmcsUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class TmcService {
  static getTmcs() {
    return Instance.get(tmcsUrl, {
      headers: { Authorization: getToken() },
    });
  }

  static getTmc(tmcId) {
    return Instance.get(`${tmcsUrl}/${tmcId}`, {
      headers: { Authorization: getToken() },
    });
  }

  static updateTmc(tmcId, tmc) {
    return Instance.put(`${tmcsUrl}/${tmcId}`, tmc, {
      headers: { Authorization: getToken() },
    });
  }

  static createTmc(tmc) {
    return Instance.post(tmcsUrl, tmc, {
      headers: { Authorization: getToken() },
    });
  }
}
