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
import WarehouseService from "../../../API/services/warehouse_service";
import MaterialService from "../../../API/services/material_service";
import PurchaseService from "../../../API/services/purchase_service";
import NotificationService from "../../../API/services/notification_service";
import WarehouseToWarehouseDto from "../../../dto/warehouse_to_warehouse_dto";
import { getRole } from "../../../API/helper/userCookie";
import FormikSelect from "../../UI/formik_select";
import { useCookies } from "react-cookie";

const validationSchema = Yup.object().shape({
  warehouseId: Yup.number().min(1, "Too Short!").required("Required"),
  materialsFromTransfer: Yup.array()
    .of(
      Yup.object().shape({
        materialId: Yup.number().min(1, "Too Short!").required("Required"),
        purchaseId: Yup.number().min(1, "Too Short!").required("Required"),
        maxCount: Yup.number()
          .min(1, "Too Short!")
          .max(50, "Too Long!")
          .required("Required"),
        count: Yup.number()
          .when("maxCount", (maxCount, schema) => {
            return maxCount
              ? schema
                  .min(1, "Too Short!")
                  .max(maxCount, `Count cannot be greater than ${maxCount}`)
              : schema.nullable().transform((value, originalValue) => {
                  if (
                    originalValue === undefined ||
                    originalValue === null ||
                    originalValue === ""
                  ) {
                    return null; // Count field must be empty when maxCount is not present
                  }
                  return value;
                });
          })
          .required("Required"),
      }),
    )
    .max(20, "Too Long!"),
});
const MaterialsToWarehouse = ({
  visibleModal,
  setVisibleModal,
  warehouseId,
  getMaterialList,
}) => {
  const [cookie, setCookie] = useCookies();

  const initialValues = {
    warehouseId: "",
    materialsFromTransfer: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      Transfer(values);
      setSubmitting(false);
      onClose();
    },
  });

  const [materialPurchasesList, setMaterialPurchasesList] = useState([]);
  const [materialList, setMaterialList] = useState([]);

  const [warehouseList, setWarehouseList] = useState([]);

  const selectPurchaseIdRef = useRef();

  const selectWarehouseIdRef = useRef();

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const changeCount = (e, materialId) => {
    let value = e.target.value;
    console.log(value);
    console.log(materialId);
    const validated = value.match(/^(\d*$)/);
    if (validated && value[0] !== "0") {
      formik.values.materialsFromTransfer.forEach((materialFromTransfer) => {
        if (materialFromTransfer.materialId === materialId) {
          materialFromTransfer.count = value;
        }
        formik.setFieldValue(
          "materialsFromTransfer",
          formik.values.materialsFromTransfer,
        );
      });
    }
  };

  const getMaterial = async () => {
    try {
      const firstRespoinse = await MaterialService.getMaterials(
        warehouseId,
        1,
        1,
      );
      const secondResponse = await MaterialService.getMaterials(
        warehouseId,
        1,
        firstRespoinse.data.totalItems,
      );
      setMaterialList(
        secondResponse.data.materials.map((material) => {
          return {
            value: material.id,
            label: material.name,
          };
        }),
      );

      const newMaterialPurchasesList = await Promise.all(
        secondResponse.data.materials.map(async (material) => {
          const response = await MaterialService.getMaterial(
            material.id,
            warehouseId,
          );
          return {
            materialId: material.id,
            materialPurchasesList: await Promise.all(
              response.data.currentPurchaseMaterials.map(
                async (purchaseMaterial) => {
                  const purchase = await PurchaseService.getPurchase(
                    purchaseMaterial.purchaseId,
                  );
                  return {
                    value: purchaseMaterial.purchaseId,
                    maxCount: purchaseMaterial.countOnWarehouse,
                    label: `${purchase.data.price} ${purchaseMaterial.countOnWarehouse} ${purchase.data.supplier.name}`,
                  };
                },
              ),
            ),
          };
        }),
      );
      setMaterialPurchasesList(newMaterialPurchasesList);
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  const getWarehouses = async () => {
    try {
      const response = await WarehouseService.getWarehouses();

      setWarehouseList(
        response.data
          .filter((warehouse) => warehouse.id !== warehouseId)
          .map((warehouse) => {
            return { value: warehouse.id, label: warehouse.name };
          }),
      );
    } catch (error) {
      console.error("Error getWarehouses:", error);
    }
  };

  useEffect(() => {
    if (warehouseId > 0) {
      selectPurchaseIdRef.current?.setValue();
      selectWarehouseIdRef.current?.setValue();
      formik.setValues(initialValues);
      formik.setTouched({});
      getMaterial();
      getWarehouses();
    }
  }, [warehouseId]);

  useEffect(() => {
    if (visibleModal) {
      getMaterial();
      getWarehouses();
    }
  }, [visibleModal]);

  const clearForm = () => {
    formik.setValues(initialValues);
    formik.setTouched({});
    selectPurchaseIdRef.current?.setValue();
    selectWarehouseIdRef.current?.setValue();
  };

  const Transfer = async (materialsTransfer) => {
    try {
      materialsTransfer.materialsFromTransfer.forEach(
        function (material, index) {
          delete material.maxCount;
        },
      );

      if (getRole() === "ADMIN") {
        Promise.all(
          materialsTransfer.materialsFromTransfer.map(
            async (materialFromTransfer) => {
              await WarehouseService.moveMaterial(
                warehouseId,
                materialsTransfer.warehouseId,
                materialFromTransfer,
              );
            },
          ),
        );
      } else {
        Promise.all(
          materialsTransfer.materialsFromTransfer.map(
            async (materialFromTransfer) => {
              await NotificationService.createNotification(
                new WarehouseToWarehouseDto({
                  currentWarehouseId: warehouseId,
                  newWarehouseId: materialsTransfer.warehouseId,
                  materialId: materialFromTransfer.materialId,
                  purchaseId: materialFromTransfer.purchaseId,
                  count: materialFromTransfer.count,
                }),
              );
            },
          ),
        );
      }
      getMaterialList();
    } catch (error) {
      console.error("Error Transfer:", error);
    }
  };
  console.log(formik.values);
  return (
    <FormikProvider value={formik}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
        mb={9}
      >
        <Text fontSize="2xl">Перемещение со склада на склад</Text>
        <CloseButton onClick={onClose} />
      </Flex>
      <Box pb={6}>
        <form onSubmit={formik.handleSubmit}>
          <SimpleGrid
            maxH="500px"
            width="500px"
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
            <FormikSelect
              value={
                warehouseList.filter(
                  (warehouse) => warehouse.value === cookie.warehouseId,
                )[0]
              }
              selectRef={selectWarehouseIdRef}
              options={cookie.role === "ADMIN" ? warehouseList : undefined}
              onChange={(e) => {
                formik.setFieldValue("warehouseId", e?.value);
              }}
              placeholder={"Склад"}
            />
            <FormikSelect
              isMulti
              options={materialList}
              onChange={(e) => {
                formik.setFieldValue(
                  "materialsFromTransfer",
                  formik.values.materialsFromTransfer.map(
                    (materialFromTransfer) => {
                      if (
                        e.find(
                          (material) =>
                            material.value === materialFromTransfer.materialId,
                        )
                      ) {
                        return materialFromTransfer;
                      }
                    },
                  ),
                );

                e.forEach((material) => {
                  if (
                    !formik.values.materialsFromTransfer.find(
                      (materialFromTransfer) =>
                        materialFromTransfer.materialId === material.value,
                    )
                  ) {
                    formik.values.materialsFromTransfer.push({
                      materialId: material.value,
                      purchaseId: "",
                      maxCount: "",
                      count: "",
                    });
                  }
                });

                formik.setFieldValue(
                  "materialsFromTransfer",
                  formik.values.materialsFromTransfer,
                );
              }}
              placeholder={"Материалы"}
            />
            {formik.values.materialsFromTransfer.map((materialFromTransfer) => {
              return (
                <>
                  <label>
                    {
                      materialList.find(
                        (material) =>
                          material.value === materialFromTransfer.materialId,
                      ).label
                    }
                  </label>
                  <div>
                    <label>{"Кол-во"}</label>
                    <Input
                      isInvalid={formik.errors.count && formik.touched.count}
                      errorBorderColor="crimson"
                      id="count"
                      name="count"
                      value={materialFromTransfer.count}
                      onChange={(e) =>
                        changeCount(e, materialFromTransfer.materialId)
                      }
                      height="40px"
                      placeholder={"Кол-во"}
                    />
                  </div>
                  <FormikSelect
                    selectRef={selectPurchaseIdRef}
                    options={
                      materialPurchasesList.find(
                        (materialPurchases) =>
                          materialPurchases.materialId ===
                          materialFromTransfer.materialId,
                      ).materialPurchasesList
                    }
                    onChange={(e) => {
                      materialFromTransfer.purchaseId = e?.value;
                      materialFromTransfer.maxCount = e?.maxCount;
                      formik.setFieldValue(
                        "materialsFromTransfer",
                        formik.values.materialsFromTransfer,
                      );
                    }}
                    placeholder={"Закупки"}
                  />
                </>
              );
            })}
          </SimpleGrid>
          <Flex justifyContent="flex-end">
            <Button variant="menu_red" onClick={onClose} mr={3}>
              Отмена
            </Button>
            <Button variant="menu_yellow" type="submit" me={1}>
              Сохранить
            </Button>
          </Flex>
        </form>
      </Box>
    </FormikProvider>
  );
};

export default MaterialsToWarehouse;
