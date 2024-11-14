import { Instance } from "../instance";
import { warehousesUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class WarehouseService {
  static getWarehouses() {
    return Instance.get(warehousesUrl.warehouses, {
      headers: { Authorization: getToken() },
    });
  }

  static getWarehouse(warehouseId) {
    return Instance.get(`${warehousesUrl.warehouses}/${warehouseId}`, {
      headers: { Authorization: getToken() },
    });
  }

  static updateWarehouse(warehouseId, warehouse) {
    return Instance.put(
      `${warehousesUrl.warehouses}/${warehouseId}`,
      warehouse,
      {
        headers: { Authorization: getToken() },
      },
    );
  }

  static createWarehouse(warehouse) {
    return Instance.post(warehousesUrl.warehouses, warehouse, {
      headers: { Authorization: getToken() },
    });
  }

  static addMaterialToWarehouse(warehouseId, materialTransfer) {
    return Instance.put(
      `${warehousesUrl.warehouses}/${warehouseId}/${warehousesUrl.update}`,
      materialTransfer,
      {
        headers: { Authorization: getToken() },
      },
    );
  }

  static moveMaterial(warehouseId, newWarehouseId, materialTransfer) {
    return Instance.put(
      `${warehousesUrl.warehouses}/${warehouseId}/${warehousesUrl.move}/${newWarehouseId}`,
      materialTransfer,
      {
        headers: { Authorization: getToken() },
      },
    );
  }
}
