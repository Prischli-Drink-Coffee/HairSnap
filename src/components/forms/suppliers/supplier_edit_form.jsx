import React, { useEffect, useState } from "react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as Yup from "yup";
import FormikInput from "../../UI/formik_input";
import SupplierService from "../../../API/services/supplier_service";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import CustomInput from "../../staff_form";
import CustomSelect from "../../custom_select";
import { HStack } from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
import { getCSCHbyBic } from "./requisites";
import { getRequisitesInn } from "./requisites";
import FormikSelect from "../../UI/formik_select";
import AddAdress from "./add_adress";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  brand: Yup.string().min(0, "Too Short!").max(255, "Too Long!"),
  supplierType: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  website: Yup.string().min(0, "Too Short!").max(255, "Too Long!"),
  address: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
  email: Yup.string().min(0, "Too Short!").max(255, "Too Long!"),
  phone: Yup.string().min(0, "Too Short!").max(255, "Too Long!"),
  staff: Yup.array()
    .of(
      Yup.object().shape({
        position: Yup.string().required("Обязательное поле"),
        email: Yup.string()
          .email("Неверный формат почты")
          .required("Обязательное поле"),
        phone: Yup.string()
          .matches(/^\+?\d{10,12}$/, "Неверный формат телефона")
          .required("Обязательное поле"),
        fio: Yup.string().required("Обязательное поле"),
      })
    )
    .min(1, "Добавьте хотя бы одного работника"),
  psch: Yup.string().min(0, "Too Short!").max(255, "Too Long!"),
  kpp: Yup.string().min(0, "Too Short!").max(255, "Too Long!"),
  ksch: Yup.string().min(0, "Too Short!").max(255, "Too Long!"),
  bic: Yup.string().min(0, "Too Short!").max(255, "Too Long!"),
  client: Yup.boolean().required("Required"),
  inn: Yup.string()
    .min(1, "Too Short!")
    .max(255, "Too Long!")
    .required("Required"),
});

const SupplierEditForm = ({
  getSuppliersList,
  setVisibleModal,
  supplierId,
  getDeliveryPlacesList,
  deliveryPlaceList,
}) => {
  const [supplier, setSupplier] = useState({
    name: "",
    brand: "",
    supplierType: "LEGAL_ENTITY",
    website: "",
    address: "",
    email: "",
    phone: "",
    staff: [{ position: "", email: "", phone: "", fio: "" }],
    deliveryPlaceIdList: [],
    deliveryPlaces: [
      {
        id: 0,
        address: "string",
        comment: "string",
      },
    ],
    psch: "",
    kpp: "",
    ksch: "",
    bic: "",
    client: true,
    inn: "",
    bankName: "",
  });
  const getSupplier = async (supplierId) => {
    try {
      const response = await SupplierService.getSupplierById(supplierId);
      setSupplier(response.data);
      setAdresses(
        supplier.deliveryPlaces.map((element) => {
          return { value: element.id, label: element.address };
        })
      );
      formik.setFieldValue(
        "deliveryPlaceIdList",
        adresses.map((el) => el.value)
      );
    } catch (error) {
      console.error("Error get supplier:", error);
    }
  };

  const [adresses, setAdresses] = useState([{ value: 1, label: "default" }]);

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const createSupplier = async (supplier) => {
    try {
      await SupplierService.udateSupplierById(supplierId, supplier);
      getSuppliersList();
    } catch (error) {
      console.error("Error update supplier:", error);
    }
  };
  useEffect(() => {
    getSupplier(supplierId);
    formik.setValues(supplier);
  }, [supplierId]);

  const formik = useFormik({
    initialValues: supplier,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      createSupplier(values);
      onClose();
      setSubmitting(false);
    },
    enableReinitialize: true,
  });

  const clearForm = () => {
    formik.setValues(supplier);
    formik.setErrors({});
    formik.setTouched({});
  };
  useEffect(() => {
    formik.setValues(supplier);
    console.log(supplier.deliveryPlaces);
    setAdresses(
      supplier.deliveryPlaces.map((element) => {
        return { value: element.id, label: element.address };
      })
    );
    formik.setFieldValue(
      "deliveryPlaceIdList",
      adresses.map((el) => el.value)
    );
    console.log(formik.values);
  }, [supplier]);

  useEffect(() => {
    formik.setFieldValue(
      "deliveryPlaceIdList",
      adresses.map((el) => el.value)
    );
  }, [adresses]);

  return (
    <FormikProvider value={formik}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
        mb={9}
      >
        <Text fontSize="2xl">Информация о поставщике с id: #{supplierId}</Text>
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
            <HStack width={"100%"} align={"flex-end"} justify={"space-between"}>
              <FormikInput formik={formik} name={"inn"} label={"ИНН*"} />
              <Button>
                <IoSearchOutline
                  size={25}
                  onClick={() => {
                    getRequisitesInn(formik.values.inn)
                      .then((data) => {
                        console.log(data);
                        if (data && data.suggestions.length != 0) {
                          formik.setFieldValue(
                            "name",
                            data.suggestions[0].value
                          );
                          if (data.suggestions[0].data.address)
                            formik.setFieldValue(
                              "address",
                              data.suggestions[0].data.address.value
                            );
                          if (data.suggestions[0].data.emails)
                            formik.setFieldValue(
                              "email",
                              data.suggestions[0].data.emails
                            );
                          if (data.suggestions[0].data.phones)
                            formik.setFieldValue(
                              "phone",
                              data.suggestions[0].data.phones
                            );
                          if (data.suggestions[0].data.type)
                            formik.setFieldValue(
                              "supplierType",
                              data.suggestions[0].data.type == "LEGAL"
                                ? "LEGAL_ENTITY"
                                : "INDIVIDUAL_ENTREPRENEUR"
                            );
                          if (data.suggestions[0].data.management)
                            formik.setFieldValue("staff", [
                              {
                                position:
                                  data.suggestions[0].data.management.post,
                                email: "",
                                phone: "",
                                fio: data.suggestions[0].data.management.name,
                              },
                            ]);
                        }
                      })
                      .catch((error) => console.log("error", error));
                  }}
                />
              </Button>
            </HStack>
            <FormikInput formik={formik} name={"name"} label={"Название*"} />

            <FormikInput formik={formik} name={"brand"} label={"Бренд"} />
            <CustomSelect
              name="supplierType"
              label={"Тип поставщика*"}
              options={[
                { value: "LEGAL_ENTITY", label: "Юр. лицо" },
                { value: "INDIVIDUAL_ENTREPRENEUR", label: "ИП" },
                { value: "SELF_EMPLOYEED", label: "Самозанятый" },
                { value: "OTHER", label: "Другое" },
              ]}
            />
            <FormikInput
              formik={formik}
              name={"website"}
              label={"Ссылка на сайт"}
            />
            <FormikInput formik={formik} name={"address"} label={"Адрес*"} />
            <FormikInput formik={formik} name={"email"} label={"Почта"} />
            <FormikInput formik={formik} name={"phone"} label={"Телефон"} />
            <FieldArray name="staff">
              {({ push, remove }) => (
                <Stack spacing={4}>
                  {formik.values.staff.map((worker, index) => (
                    <Box
                      key={index}
                      p={4}
                      border="1px"
                      borderColor="gray.200"
                      rounded="md"
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <Heading size="sm">
                          Контактное лицо #{index + 1}
                        </Heading>
                        {formik.values.staff.length > 1 && (
                          <IconButton
                            aria-label="Удалить контакт"
                            icon={<CloseIcon />}
                            onClick={() => remove(index)}
                          />
                        )}
                      </Flex>
                      <Stack spacing={4}>
                        <CustomInput
                          name={`staff.${index}.position`}
                          label="Должность*"
                          placeholder="Введите должность"
                        />
                        <CustomInput
                          name={`staff.${index}.email`}
                          label="Почта*"
                          placeholder="Введите почту"
                          type="email"
                        />
                        <CustomInput
                          name={`staff.${index}.phone`}
                          label="Телефон*"
                          placeholder="Введите телефон"
                          type="tel"
                        />
                        <CustomInput
                          name={`staff.${index}.fio`}
                          label="ФИО*"
                          placeholder="Введите ФИО"
                        />
                      </Stack>
                    </Box>
                  ))}
                  <Button
                    leftIcon={<AddIcon />}
                    variant="menu_yellow"
                    onClick={() =>
                      push({ position: "", email: "", phone: "", fio: "" })
                    }
                  >
                    Добавить контактное лицо
                  </Button>
                </Stack>
              )}
            </FieldArray>
            <FormikSelect
              isMulti // Включает возможность выбора нескольких опций
              placeholder="Адреса отгрузки"
              value={adresses}
              options={deliveryPlaceList}
              onChange={(e) => {
                console.log(e);
                setAdresses(e);
                let buffer = e.map((property) => property.value);
                console.log("buffer");
                console.log(buffer);
              }}
              maxMenuHeight={150}
            />
            <AddAdress getAdresses={getDeliveryPlacesList} />

            <HStack width={"100%"} align={"flex-end"} justify={"space-between"}>
              <FormikInput formik={formik} name={"bic"} label={"БИК"} />
              <Button>
                <IoSearchOutline
                  size={25}
                  onClick={() => {
                    if (formik.values.bic.length == 9) {
                      getCSCHbyBic(formik.values.bic)
                        .then((response) => response)
                        .then((data) => {
                          if (data && data.suggestions.length != 0) {
                            formik.setFieldValue(
                              "bankName",
                              data.suggestions[0].value
                            );
                            if (data.suggestions[0].data.correspondent_account)
                              formik.setFieldValue(
                                "ksch",
                                data.suggestions[0].data.correspondent_account
                              );
                            if (data.suggestions[0].data.kpp)
                              formik.setFieldValue(
                                "kpp",
                                data.suggestions[0].data.kpp
                              );
                          }
                        });
                    }
                  }}
                />
              </Button>
            </HStack>
            <FormikInput
              formik={formik}
              name={"bankName"}
              label={"Название банка"}
            />
            <FormikInput formik={formik} name={"psch"} label={"Р. счет"} />
            <FormikInput formik={formik} name={"kpp"} label={"КПП"} />
            <FormikInput formik={formik} name={"ksch"} label={"Кор. счет"} />
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

export default SupplierEditForm;
