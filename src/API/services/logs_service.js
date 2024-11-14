import { Instance } from "../instance";
import { logsUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class LogsService {
  static getLogs(page, size) {
    const params = {
      page,
      size,
    };
    return Instance.get(`${logsUrl}`, {
      params,
      headers: { Authorization: getToken() },
    });
  }
}
