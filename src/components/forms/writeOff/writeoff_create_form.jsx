import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { FormikProvider, useFormik } from "formik";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import FormikInput from "../../UI/formik_input";
import FormikSelect from "../../UI/formik_select";
import WarehouseService from "../../../API/services/warehouse_service";
import MaterialService from "../../../API/services/material_service";
import SupplierService from "../../../API/services/supplier_service";
import { AsyncPaginate } from "react-select-async-paginate";
import WriteOffService from "../../../API/services/writeoff_service";
import { useCookies } from "react-cookie";

const validationSchema = Yup.object().shape({
  reason: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  supplierId: Yup.number().min(1, "Too Short!"),
  materials: Yup.array()
    .of(
      Yup.object().shape({
        materialId: Yup.number().min(1, "Too Short!").required("Required"),
        materialPurchases: Yup.array()
          .of(
            Yup.object().shape({
              count: Yup.number().min(1, "Too Short!").required("Required"),
              purchaseId: Yup.number()
                .min(1, "Too Short!")
                .required("Required"),
            }),
          )
          .min(1, "Too Short!")
          .max(20, "Too Long!"),
      }),
    )
    .min(1, "Too Short!")
    .max(20, "Too Long!"),
  warehouseId: Yup.number().min(1, "Too Short!").required("Required"),
});

const WriteoffCreateForm = ({
  visibleModal,
  getWriteOffList,
  setVisibleModal,
}) => {
  const [cookie, setCookie] = useCookies();
  const writeOff = {
    reason: "",
    materials: [],
    warehouseId: cookie.warehouseId,
  };
  const [warehouses, setWarehouses] = useState([]);

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const getWarehouses = async () => {
    try {
      const response = await WarehouseService.getWarehouses();
      setWarehouses(
        response.data.map((warehouses) => {
          return { value: warehouses.id, label: warehouses.name };
        }),
      );
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  const getMaterial = async (materialId, warehouseId) => {
    try {
      const response = await MaterialService.getMaterial(
        materialId,
        warehouseId,
      );
      return response.data;
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  const createWriteOff = async (WriteOff) => {
    try {
      const materials = [];
      WriteOff.materials.forEach((material) => {
        material.materialPurchases.forEach((materialPurchase) => {
          materials.push({
            materialId: material.materialId,
            count: materialPurchase.count,
            purchaseId: materialPurchase.purchaseId,
          });
        });
      });
      WriteOff.materials = materials;
      if (cookie.warehouseId > 0) {
        delete WriteOff.warehouseId;
      }
      await WriteOffService.createWriteoff(WriteOff);
      getWriteOffList();
    } catch (error) {
      console.error("Error createWriteOff:", error);
    }
  };

  const formik = useFormik({
    initialValues: writeOff,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      createWriteOff(JSON.parse(JSON.stringify(values)));
      onClose();
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    getWarehouses();
  }, [visibleModal]);

  useEffect(() => {
    selectMaterialRef.current?.setValue([]);
    formik.setFieldValue(
      "warehouseId",
      Number.isInteger(+cookie.warehouseId) ? cookie.warehouseId : -1,
    );
    formik.setFieldValue("materials", []);
  }, [cookie.warehouseId]);

  const findIndexMaterial = (materialId) => {
    return formik.values.materials.findIndex(
      (formikMaterial) => formikMaterial.materialId === materialId,
    );
  };

  const selectMaterialRef = useRef();

  const selectRefWarehouseId = useRef();

  const selectRefSupplierId = useRef();

  const setWarehouseId = (e) => {
    selectMaterialRef.current?.clearValue();
    formik.setFieldValue("warehouseId", e?.value);
    formik.setFieldValue("materials", []);
  };
  const addFormikMaterial = async (e) => {
    if (!e) {
      formik.setFieldValue("materials", []);
    }
    for (const material of e) {
      if (findIndexMaterial(material.value) === -1) {
        const newMaterial = await getMaterial(
          material.value,
          formik.values.warehouseId,
        );
        const currentPurchaseMaterials =
          newMaterial?.currentPurchaseMaterials?.map((purchaseMaterial) => ({
            purchaseId: purchaseMaterial.purchaseId,
            countOnWarehouse: purchaseMaterial.countOnWarehouse,
          }));
        const materialPurchases =
          currentPurchaseMaterials.length === 1
            ? [
                {
                  count: 0,
                  purchaseId: currentPurchaseMaterials[0].purchaseId,
                },
              ]
            : [];
        formik.values.materials.push({
          currentPurchaseMaterials,
          materialName: material.label,
          materialId: material.value,
          materialPurchases,
        });
      }
    }
    formik.values.materials.forEach((materialFormik, index) => {
      if (!e.find((material) => material.value === materialFormik.materialId)) {
        formik.values.materials.splice(index, 1);
      }
    });
    formik.setFieldValue("materials", formik.values.materials);
  };

  const setCountFormikMaterial = async (e, indexMaterial, purchaseId) => {
    let value = e.target.value;
    const validated = value.match(/^(\d*$)/);
    if (validated && value[0] !== "0") {
      const material = formik.values.materials[indexMaterial];
      const currentPurchaseMaterial = material.currentPurchaseMaterials.find(
        (purchaseMaterial) => purchaseMaterial.purchaseId === purchaseId,
      );
      if (currentPurchaseMaterial.countOnWarehouse >= value) {
        const indexMaterialPurchase = formik.values.materials[
          indexMaterial
        ].materialPurchases.findIndex(
          (materialPurchase) => materialPurchase.purchaseId === purchaseId,
        );
        formik.values.materials[indexMaterial].materialPurchases[
          indexMaterialPurchase
        ].count = value;
        formik.setFieldValue("materials", formik.values.materials);
      }
    }
  };
  const setPurchaseFormikMaterial = async (e, indexMaterial) => {
    const material = formik.values.materials[indexMaterial];
    const array = [];

    e.forEach((eventMaterialPurchase) => {
      let indexMaterialPurchase = material.materialPurchases.findIndex(
        (materialPurchase) =>
          materialPurchase.purchaseId === eventMaterialPurchase.value,
      );

      if (indexMaterialPurchase !== -1) {
        array.push(material.materialPurchases[indexMaterialPurchase]);
      } else {
        array.push({
          count: 0,
          purchaseId: eventMaterialPurchase.value,
        });
      }
    });
    array.forEach((materialPurchase) => {
      const currentPurchaseMaterial = material.currentPurchaseMaterials.find(
        (purchaseMaterial) =>
          purchaseMaterial.purchaseId === materialPurchase.purchaseId,
      );
      if (
        !(currentPurchaseMaterial.countOnWarehouse >= materialPurchase.count)
      ) {
        formik.setFieldError(
          "materials",
          "Такого количества нет по одному из заказов",
        );
      }
    });
    formik.values.materials[indexMaterial].materialPurchases = array;
    formik.setFieldValue("materials", formik.values.materials);
  };

  const loadOptions = async (search, prevOptions, { page }) => {
    if (formik.values.warehouseId !== -1) {
      let searchString = search === "" ? null : `name:*${search}*`;
      const response = await MaterialService.getMaterials(
        formik.values.warehouseId,
        page,
        10,
        searchString,
      ).catch((reason) => {
        console.error("WriteoffCreateForm-loadOptions");
      });

      const hasMore = prevOptions.length < response.data.totalItems;
      return {
        options: response.data.materials.map((material) => ({
          value: material.id,
          label: material.name,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    }
    const hasMore = false;
    return {
      options: [],
      hasMore,
      additional: {
        page: 1,
      },
    };
  };
  const getSuppliers = async (currentPage, currentPageSize, search) => {
    try {
      return await SupplierService.getSuppliersClients(
        currentPage,
        currentPageSize,
        search,
        true,
      );
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  const loadOptionsSupplier = async (search, prevOptions, { page }) => {
    const response = await getSuppliers(page, 10, search);

    const hasMore = prevOptions.length < response.data.totalItems;
    return {
      options: response.data.suppliers.map((supplier) => ({
        value: supplier.id,
        label: supplier.name,
      })),
      hasMore,
      additional: {
        page: page + 1,
      },
    };
  };

  const clearForm = () => {
    selectMaterialRef.current.clearValue();
    selectRefWarehouseId?.current?.clearValue();
    selectRefSupplierId.current.clearValue();
    formik.setValues(writeOff);
    formik.setErrors({});
    formik.setTouched({});
  };

  return (
    <FormikProvider value={formik}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
        mb={9}
      >
        <Text fontSize="2xl">Списание</Text>
        <CloseButton onClick={onClose} />
      </Flex>
      <Box pb={6}>
        <form onSubmit={formik.handleSubmit}>
          <SimpleGrid
            maxH="500px"
            width={["300px", "350px", "400px", "450px", "500px"]}
            overflowX="scroll"
            spacing={5}
            p={1}
            sx={{
              "::-webkit-scrollbar": {
                w: "2",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "10",
                bg: `gray.100`,
              },
            }}
          >
            <FormikInput formik={formik} name={"reason"} label={"Причина"} />
            <div>
              <label>{"Клиент"}</label>
              <AsyncPaginate
                selectRef={selectRefSupplierId}
                loadOptions={loadOptionsSupplier}
                onChange={(e) => formik.setFieldValue("supplierId", e?.value)}
                additional={{
                  page: 1,
                }}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 3 }) }}
                placeholder={"Клиент"}
              />
            </div>
            <FormikSelect
              value={
                warehouses.filter(
                  (warehouse) => warehouse.value === cookie.warehouseId,
                )[0]
              }
              selectRef={selectRefWarehouseId}
              formik={formik}
              name={"warehouseId"}
              placeholder={"Склад"}
              options={cookie.role === "ADMIN" ? warehouses : undefined}
              onChange={setWarehouseId}
            />
            <div>
              <label>{"Материалы"}</label>
              <AsyncPaginate
                selectRef={selectMaterialRef}
                isMulti
                loadOptions={loadOptions}
                cacheUniqs={[formik.values.warehouseId]}
                onChange={addFormikMaterial}
                additional={{
                  page: 1,
                }}
                closeMenuOnSelect={false}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 3 }) }}
                placeholder={"Материалы"}
              />
            </div>
            {formik.values.materials?.map((material, index) => {
              return (
                <div key={material.materialId}>
                  {material.currentPurchaseMaterials.length === 1 ? (
                    <FormikSelect
                      formik={formik}
                      placeholder={material?.materialName}
                      defaultValue={{
                        value: material.materialPurchases[0].purchaseId,
                        label: `id: ${material.materialPurchases[0].purchaseId}, Кол-во: ${material.currentPurchaseMaterials[0].countOnWarehouse}`,
                      }}
                    />
                  ) : (
                    <FormikSelect
                      isMulti={true}
                      onChange={(e) => setPurchaseFormikMaterial(e, index)}
                      options={material.currentPurchaseMaterials?.map(
                        (purchaseMaterial) => ({
                          value: purchaseMaterial.purchaseId,
                          label: `id: ${purchaseMaterial.purchaseId}, Кол-во: ${purchaseMaterial.countOnWarehouse}`,
                        }),
                      )}
                      formik={formik}
                      placeholder={material?.materialName}
                    />
                  )}
                  {material.materialPurchases?.map((materialPurchase) => {
                    return (
                      <div
                        style={{ marginTop: "1.25rem" }}
                        key={`${material.materialId}-${materialPurchase.purchaseId}`}
                      >
                        <label>{`id: ${
                          materialPurchase.purchaseId
                        }, Кол-во: ${
                          material.currentPurchaseMaterials.find(
                            (purchaseMaterial) =>
                              purchaseMaterial.purchaseId ===
                              materialPurchase.purchaseId,
                          ).countOnWarehouse
                        }`}</label>
                        <Input
                          value={materialPurchase.count}
                          onChange={(e) =>
                            setCountFormikMaterial(
                              e,
                              index,
                              materialPurchase.purchaseId,
                            )
                          }
                          height="40px"
                          placeholder={material?.materialName}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </SimpleGrid>
          <Flex justifyContent="flex-end">
            <Button
              variant="menu_red"
              onClick={onClose}
              mr={3}
              maxWidth="100%"
              fontSize={["14px", "14px", "16px", "16px", "16px"]}
            >
              Отмена
            </Button>
            <Button
              variant="menu_yellow"
              type="submit"
              me={1}
              maxWidth="100%"
              fontSize={["14px", "14px", "16px", "16px", "16px"]}
            >
              Сохранить
            </Button>
          </Flex>
        </form>
      </Box>
    </FormikProvider>
  );
};
export default WriteoffCreateForm;
