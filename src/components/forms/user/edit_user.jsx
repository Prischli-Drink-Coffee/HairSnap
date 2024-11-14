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
import FormikInput from "../../UI/formik_input";
import PurchaseService from "../../../API/services/purchase_service";
import UserService from "../../../API/services/user_service";
import * as Yup from "yup";
import CustomSelect from "../../custom_select";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .nullable()
    .min(1, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
});

const UserEditForm = ({
  setVisibleModal,
  purchaseId,
  userInfo,
  warehouses,
  getPurchaseList,
}) => {
  const purchase = {
    login: "",
    username: "",
    password: "",
    role: "",
    warehouseId: 1,
  };

  const onClose = () => {
    setVisibleModal(false);
  };

  const updatePurchase = async (userInfo) => {
    try {
      await UserService.update(purchaseId, userInfo);
      getPurchaseList()
    } catch (error) {
      console.error("Error createPurchase:", error);
    }
  };

  const formik = useFormik({
    initialValues: userInfo,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      updatePurchase(values);
      setVisibleModal(false);
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  //   const getPurchase = async (purchaseId) => {
  //     try {
  //       const response = await PurchaseService.getPurchase(purchaseId);
  //       formik.setValues({
  //         linkToMaterial: response.data.linkToMaterial || "",
  //         comment: response.data.comment || "",
  //       });
  //     } catch (error) {
  //       console.error("Error getMaterial:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     if (purchaseId > 0) {
  //       getPurchase(purchaseId);
  //     }
  //   }, [purchaseId]);

  //   const clearForm = () => {
  //     getPurchase(purchaseId);
  //     formik.setErrors({});
  //     formik.setTouched({});
  //   };

  return (
    <FormikProvider value={formik}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
        mb={9}
      >
        <Text fontSize="2xl">Изменение данных пользователя</Text>
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
            <FormikInput
              formik={formik}
              name={"password"}
              label={"Новый пароль"}
            />
            {userInfo.role == "MASTER" ||
            userInfo.role == "WAREHOUSE_RESPONSIBLE" ? (
              <CustomSelect
                name="warehouseId"
                label={"Склады"}
                options={warehouses.map((warehouse) => {
                  return { value: warehouse.id, label: warehouse.name };
                })}
              />
            ) : null}
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

export default UserEditForm;
