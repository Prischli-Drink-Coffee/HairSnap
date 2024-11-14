import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { FormikProvider, useFormik } from "formik";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import FormikInput from "../../UI/formik_input";
import FormikSelect from "../../UI/formik_select";
import MaterialService from "../../../API/services/material_service";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  comment: Yup.string().nullable().min(1, "Too Short!").max(300, "Too Long!"),
  tmCraftifyIdList: Yup.array(
    Yup.number().min(1, "Too Short!").required("Required"),
  ).max(20, "Too Long!"),
  materialPropertyDTOList: Yup.array()
    .of(
      Yup.object().shape({
        propertyId: Yup.number().min(1, "Too Short!").required("Required"),
        value: Yup.string()
          .min(1, "Too Short!")
          .max(255, "Too Long!")
          .required("Required"),
      }),
    )
    .max(20, "Too Long!"),
  count: Yup.number()
    .min(1, "Too Short!")
    .max(10000, "Too Long!")
    .required("Required"),
  purchaseId: Yup.number().min(1, "Too Short!").required("Required"),
  show: Yup.boolean().required("Required"),
  trim: Yup.boolean().required("Required"),
});

const MaterialTrimCreateForm = ({
  visibleModal,
  getMaterialList,
  setVisibleModal,
  materialId,
}) => {
  const [materialPurchases, setMaterialPurchases] = useState([]);
  const selectRefPurchase = useRef();
  const material = {
    name: "",
    tmcId: "",
    tmcTypeId: "",
    tmCraftifyIdList: [],
    materialPropertyDTOList: [
      {
        propertyId: 0,
        value: 0,
      },
    ],
    count: 0,
    purchaseId: 0,
    show: true,
    trim: true,
  };
  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const createMaterial = async (material) => {
    try {
      await MaterialService.createTrimMaterial(material);
      getMaterialList();
    } catch (error) {
      console.error("Error createMaterial:", error);
    }
  };

  const formik = useFormik({
    initialValues: material,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      createMaterial(values);
      onClose();
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  const getMaterial = async (materialId) => {
    try {
      const response = await MaterialService.getMaterial(materialId);
      setMaterialPurchases(
        response.data.currentPurchaseMaterials.map((purchase) => ({
          value: purchase.purchaseId,
          label: `Идентификатор закупки: ${purchase.purchaseId}`,
        })),
      );

      formik.setValues({
        name: "",
        tmcId: response.data.tmc.id,
        tmcTypeId: response.data.tmcType.id,
        tmCraftifyIdList: response.data.tmCraftifies.map(
          (craftify) => craftify.id,
        ),
        materialPropertyDTOList: response.data.properties.map((property) => ({
          propertyId: property.property.id,
          value: property.value,
        })),
        count: 0,
        purchaseId: 0,
        show: true,
        trim: true,
      });
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  const getPurchases = async (materialId) => {
    try {
      const response = await MaterialService.getMaterial(materialId);
      setMaterialPurchases(
        response.data.currentPurchaseMaterials.map((purchase) => ({
          value: purchase.purchaseId,
          label: `Идентификатор закупки: ${purchase.purchaseId}`,
        })),
      );
    } catch (error) {
      console.error("Error getPurchases:", error);
    }
  };

  useEffect(() => {
    if (materialId > 0) {
      getMaterial(materialId);
    }
  }, [materialId]);

  useEffect(() => {
    if (materialId > 0 && visibleModal) {
      getPurchases(materialId);
    }
  }, [visibleModal]);

  const clearForm = () => {
    formik.setValues(material);
    formik.setErrors({});
    formik.setTouched({});
    selectRefPurchase.current.setValue("");
  };

  return (
    <FormikProvider value={formik}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
        mb={9}
      >
        <Text fontSize="2xl">Создание обрезка</Text>
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
            <FormikInput formik={formik} name={"name"} label={"Название"} />
            <FormikSelect
              selectRef={selectRefPurchase}
              formik={formik}
              name={"purchaseId"}
              placeholder={"Закупка"}
              options={materialPurchases}
            />
            <FormikInput formik={formik} name={"count"} label={"Кол-во"} />
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
export default MaterialTrimCreateForm;
