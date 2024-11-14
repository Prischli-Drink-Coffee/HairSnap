import React, { useRef } from "react";
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
import PropertyService from "../../../API/services/property_service";
import FormikSelect from "../../UI/formik_select";
import { optionMeasureList, optionTypeList } from "./optionTypeList";
import FormikInput from "../../UI/formik_input";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  type: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  measure: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
});

const PropertyCreateForm = ({ getPropertyList, setVisibleModal }) => {
  const selectRefType = useRef();
  const selectRefMeasure = useRef();

  const property = {
    name: "",
    type: "",
    measure: "",
  };

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const createProperty = async (propety) => {
    try {
      await PropertyService.createProperty(propety);
      getPropertyList();
    } catch (error) {
      console.error("Error createProperty:", error);
    }
  };

  const formik = useFormik({
    initialValues: property,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      createProperty(values);
      onClose();
      setSubmitting(false);
    },
    enableReinitialize: true,
  });
  const clearForm = () => {
    selectRefType.current.setValue("");
    selectRefMeasure.current.setValue("");
    formik.setValues(property);
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
        <Text fontSize="2xl">Создание свойства</Text>
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
              selectRef={selectRefType}
              formik={formik}
              name={"type"}
              placeholder={"Тип"}
              options={optionTypeList}
            />
            <FormikSelect
              selectRef={selectRefMeasure}
              formik={formik}
              name={"measure"}
              placeholder={"Единица измерения"}
              options={optionMeasureList}
            />
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

export default PropertyCreateForm;
