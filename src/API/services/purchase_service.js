import { Instance } from "../instance";
import { purchasesUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class PurchaseService {
  static getPurchases(currentPage, currentPageSize) {
    const params = {
      page: currentPage,
      size: currentPageSize,
    };
    return Instance.get(purchasesUrl, {
      params,
      headers: { Authorization: getToken() },
    });
  }

  static getPurchase(purchaseId) {
    return Instance.get(`${purchasesUrl}/${purchaseId}`, {
      headers: { Authorization: getToken() },
    });
  }

  static updatePurchase(purchaseId, purchase) {
    return Instance.put(`${purchasesUrl}/${purchaseId}`, purchase, {
      headers: { Authorization: getToken() },
    });
  }

  static createPurchase(purchase, warehouseId) {
    const params = {
      warehouseId
    }
    return Instance.post(purchasesUrl, purchase, {
      params,
      headers: { Authorization: getToken() },
    });
  }
}
