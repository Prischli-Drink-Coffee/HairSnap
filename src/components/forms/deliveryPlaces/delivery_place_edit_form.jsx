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
import DeliveryPlaceService from "../../../API/services/deliveryPlaces_service";

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  comment: Yup.string()
    .nullable()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
});

const DeliveryPlaceEditForm = ({
  getDeliveryPlaceList,
  setVisibleModal,
  deliveryPlaceId,
}) => {
  const deliveryPlace = {
    address: "",
    comment: "",
  };

  const formik = useFormik({
    initialValues: deliveryPlace,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      editDeliveryPlace(values);
      setVisibleModal(false);
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  const getDeliveryPlace = async (deliveryPlaceId) => {
    try {
      const response = await DeliveryPlaceService.getDeliveryPlace(
        deliveryPlaceId,
      );
      if (response.data.comment === null) {
        response.data.comment = "";
      }
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error getDeliveryPlace:", error);
    }
  };

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const editDeliveryPlace = async (deliveryPlace) => {
    try {
      await DeliveryPlaceService.updateDeliveryPlace(
        deliveryPlaceId,
        deliveryPlace,
      );
      getDeliveryPlaceList();
    } catch (error) {
      console.error("Error editDeliveryPlace:", error);
    }
  };

  useEffect(() => {
    if (deliveryPlaceId > 0) {
      getDeliveryPlace(deliveryPlaceId);
    }
  }, [deliveryPlaceId]);

  const clearForm = () => {
    getDeliveryPlace(deliveryPlaceId);
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
        <Text fontSize="2xl">Редактирование адреса отгрузки</Text>
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
            <FormikInput formik={formik} name={"address"} label={"Адрес"} />
            <FormikInput
              formik={formik}
              name={"comment"}
              label={"Комментарий"}
            />
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

export default DeliveryPlaceEditForm;
