import React, { useEffect } from "react";
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
import WriteOffService from "../../../API/services/writeoff_service";

const validationSchema = Yup.object().shape({
  id: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  comment: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
});

const WriteoffConfirmForm = ({
  getWriteOffList,
  setVisibleModal,
  writeOffId,
}) => {
  const writeOff = {
    id: writeOffId,
    comment: "",
  };

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const confirmWriteOff = async (confirm) => {
    try {
      await WriteOffService.confirmWriteoff(confirm.id, confirm.comment);
      getWriteOffList();
    } catch (error) {
      console.error("Error confirmWriteOff:", error);
    }
  };

  const formik = useFormik({
    initialValues: writeOff,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      confirmWriteOff(values);
      onClose();
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (writeOffId > 0) {
      formik.setFieldValue("id", writeOffId);
    }
  }, [writeOffId]);

  const clearForm = () => {
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
        <Text fontSize="2xl">Подтверждение списания</Text>
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
            <FormikInput
              formik={formik}
              name={"comment"}
              label={"Комментарий"}
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
export default WriteoffConfirmForm;
