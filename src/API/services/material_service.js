import { Instance } from "../instance";
import { materialsUrl } from "../apiConsts";
import { getToken } from "../helper/userCookie";

export default class MaterialService {
  static getMaterials(
    warehouseId,
    currentPage,
    currentPageSize,
    searchString,
    showHidden = false,
  ) {
    const params = {
      page: currentPage,
      size: currentPageSize,
      warehouseId: warehouseId,
      search: searchString,
      showHidden,
    };
    return Instance.get(`${materialsUrl.materials}`, {
      params,
      headers: { Authorization: getToken() },
    });
  }

  static searchMaterial(
    currentPage,
    currentPageSize,
    warehouseId,
    searchString,
    showHidden,
  ) {
    const params = {
      page: currentPage,
      size: currentPageSize,
      warehouseId: warehouseId,
      search: searchString,
      showHidden,
    };
    return Instance.get(`${materialsUrl.materials}`, {
      params,
      headers: { Authorization: getToken() },
    });
  }

  static getMaterial(materialId, warehouseId) {
    const params = {
      warehouseId,
    };
    return Instance.get(`${materialsUrl.materials}/${materialId}`, {
      params,
      headers: { Authorization: getToken() },
    });
  }

  static updateMaterial(materialId, material) {
    return Instance.put(`${materialsUrl.materials}/${materialId}`, material, {
      timeout: 5000,
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
        Authorization: getToken(),
      },
    });
  }

  static createMaterial(material) {
    return Instance.post(materialsUrl.materials, material, {
      timeout: 5000,
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
        Authorization: getToken(),
      },
    });
  }

  static createTrimMaterial(material) {
    const formData = new FormData();
    formData.append("insertMaterialDTO ", JSON.stringify(material));
    return Instance.post(
      `${materialsUrl.materials}/${materialsUrl.trim}`,
      formData,
      {
        timeout: 5000,
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "application/json",
          Authorization: getToken(),
        },
      },
    );
  }
}
