import { Instance } from "../instance";
import { tmcTypesUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class TmcTypeService {
  static getTmcTypes() {
    return Instance.get(tmcTypesUrl, {
      headers: { Authorization: getToken() },
    });
  }

  static getTmcType(tmcId) {
    return Instance.get(`${tmcTypesUrl}/${tmcId}`, {
      headers: { Authorization: getToken() },
    });
  }

  static updateTmcType(tmcId, tmc) {
    return Instance.put(`${tmcTypesUrl}/${tmcId}`, tmc, {
      headers: { Authorization: getToken() },
    });
  }

  static createTmcType(tmc) {
    return Instance.post(tmcTypesUrl, tmc, {
      headers: { Authorization: getToken() },
    });
  }
}
