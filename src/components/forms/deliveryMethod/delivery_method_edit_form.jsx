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
import DeliveryMethodService from "../../../API/services/deliveryMethod_service";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
});

const DeliveryMethodEditForm = ({
  visibleModal,
  getDeliveryMethodList,
  setVisibleModal,
  deliveryMethodId,
}) => {
  const deliveryMethod = {
    name: "",
  };

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const editDeliveryMethod = async (deliveryMethod) => {
    try {
      await DeliveryMethodService.updateDeliveryMethod(
        deliveryMethodId,
        deliveryMethod,
      );
      getDeliveryMethodList();
    } catch (error) {
      console.error("Error editDeliveryMethod:", error);
    }
  };

  const formik = useFormik({
    initialValues: deliveryMethod,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      editDeliveryMethod(values);
      setVisibleModal(false);
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  const getDeliveryMethod = async (deliveryMethodId) => {
    try {
      const response = await DeliveryMethodService.getDeliveryMethod(
        deliveryMethodId,
      );
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error getDeliveryMethod:", error);
    }
  };

  useEffect(() => {
    if (deliveryMethodId > 0) {
      getDeliveryMethod(deliveryMethodId);
    }
  }, [deliveryMethodId]);

  const clearForm = () => {
    getDeliveryMethod(deliveryMethodId);
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
        <Text fontSize="2xl">Редактирование способа доставки</Text>
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
            <FormikInput formik={formik} name={"name"} label={"Название"} />
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

export default DeliveryMethodEditForm;
