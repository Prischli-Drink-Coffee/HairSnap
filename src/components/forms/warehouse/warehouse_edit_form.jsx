import React, { useEffect } from "react";
import { FormikProvider, useFormik } from "formik";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import * as Yup from "yup";
import FormikInput from "../../UI/formik_input";
import WarehouseService from "../../../API/services/warehouse_service";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
});
const WarehouseEditForm = ({
  getWarehouseList,
  setVisibleModal,
  warehouseId,
}) => {
  const warehouse = {
    name: "",
  };

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const updateWarehouse = async (warehouse) => {
    try {
      await WarehouseService.updateWarehouse(warehouseId, warehouse);
      getWarehouseList();
    } catch (error) {
      console.error("Error updateWarehouse:", error);
    }
  };

  const formik = useFormik({
    initialValues: warehouse,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      updateWarehouse(values);
      setVisibleModal(false);
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  const getWarehouse = async (warehouseId) => {
    try {
      const response = await WarehouseService.getWarehouse(warehouseId);
      formik.setValues(response.data);
      formik.setTouched({});
    } catch (error) {
      console.error("Error getWarehouse:", error);
    }
  };

  useEffect(() => {
    if (warehouseId > 0) {
      getWarehouse(warehouseId);
    }
  }, [warehouseId]);

  const clearForm = () => {
    getWarehouse(warehouseId);
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
        <Text fontSize="2xl">Создание склада</Text>
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

export default WarehouseEditForm;
