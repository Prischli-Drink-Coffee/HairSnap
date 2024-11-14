import { Instance } from "../instance";
import { contractorsUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class SupplierService {
  static getSuppliers() {
    return Instance.get(contractorsUrl.contractors, {
      headers: { Authorization: getToken() },
    });
  }
  static getSuppliersClients(page, size, search, onlyClients = false) {
    const params = {
      page,
      size,
      search,
      onlyClients,
    };
    return Instance.get(`${contractorsUrl.contractors}`, {
      params,
      headers: { Authorization: getToken() },
    });
  }
  static createSupplier(supplier) {
    return Instance.post(`${contractorsUrl.contractors}`, supplier, {
      headers: { Authorization: getToken() },
    });
  }
  static getSupplierById(id) {
    return Instance.get(`${contractorsUrl.contractors}/${id}`,  {
      headers: { Authorization: getToken() },
    });
  }
  static udateSupplierById(id, supplier) {
    return Instance.put(`${contractorsUrl.contractors}/${id}`, supplier, {
      headers: { Authorization: getToken() },
    });
  }
}
