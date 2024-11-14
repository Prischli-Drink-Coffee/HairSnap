import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { IoSearchOutline } from "react-icons/io5";
import { getCSCHbyBic, getRequisitesInn } from "../../suppliers/requisites";
import AddAdress from "../../suppliers/add_adress";
import SupplierService from "../../../../API/services/supplier_service";
import { useFetching } from "../../../../hooks/useFetching";
import DeliveryPlaceService from "../../../../API/services/deliveryPlaces_service";
import FormikSelect from "../../../UI/formik_select";
import Select from "react-select";

const CreateSupplierForMaterial = () => {
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
    psch: "",
    kpp: "",
    ksch: "",
    bic: "",
    client: true,
    inn: "",
    bankName: "",
  });

  const [deliveryPlaceList, setDeliveryPlaceList] = useState();

  const [getDeliveryPlacesList, deliveryPlacesListError] = useFetching(
    async () => {
      await DeliveryPlaceService.getDeliveryPlaces().then((response) => {
        let buffer = response.data.map((element) => {
          return { value: element.id, label: element.address };
        });
        console.log(buffer);
        setDeliveryPlaceList(buffer);
      });
      console.log(deliveryPlaceList);
    },
  );

  const createSupplier = async (supplier) => {
    try {
      await SupplierService.createSupplier(supplier);
    } catch (error) {
      console.error("Error create supplier:", error);
    }
  };

  useEffect(() => {
    getDeliveryPlacesList();
  }, []);

  const options = [
    { value: "LEGAL_ENTITY", label: "Юр. лицо" },
    { value: "INDIVIDUAL_ENTREPRENEUR", label: "ИП" },
    { value: "SELF_EMPLOYEED", label: "Самозанятый" },
    { value: "OTHER", label: "Другое" },
  ];

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <AccordionButton>
          Добавить поставщика
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel minH={300} p={10}>
          <VStack width={"100%"} align={"flex-end"}>
            <HStack width={"100%"} align={"flex-end"} justify={"space-between"}>
              <Input
                placeholder="ИНН"
                onChange={(e) => {
                  setSupplier((state) => ({ ...state, inn: e.target.value }));
                }}
              />
              <Button>
                <IoSearchOutline
                  size={25}
                  onClick={() => {
                    getRequisitesInn(supplier.inn)
                      .then((data) => {
                        console.log(data);
                        if (data && data.suggestions.length != 0) {
                          setSupplier((state) => ({
                            ...state,
                            name: data.suggestions[0].value,
                          }));
                          if (data.suggestions[0].data.address)
                            setSupplier((state) => ({
                              ...state,
                              address: data.suggestions[0].data.address.value,
                            }));
                          if (data.suggestions[0].data.emails)
                            setSupplier((state) => ({
                              ...state,
                              email: data.suggestions[0].data.emails,
                            }));
                          if (data.suggestions[0].data.phones)
                            setSupplier((state) => ({
                              ...state,
                              phone: data.suggestions[0].data.phones,
                            }));
                          if (data.suggestions[0].data.type)
                            setSupplier((state) => ({
                              ...state,
                              supplierType:
                                data.suggestions[0].data.type == "LEGAL"
                                  ? "LEGAL_ENTITY"
                                  : "INDIVIDUAL_ENTREPRENEUR",
                            }));
                          if (data.suggestions[0].data.management)
                            setSupplier((state) => ({
                              ...state,
                              staff: [
                                {
                                  position:
                                    data.suggestions[0].data.management.post,
                                  email: "",
                                  phone: "",
                                  fio: data.suggestions[0].data.management.name,
                                },
                              ],
                            }));
                        }
                      })
                      .catch((error) => console.log("error", error));
                  }}
                />
              </Button>
            </HStack>
            <Input
              placeholder="Название*"
              onChange={(e) => {
                setSupplier((state) => ({ ...state, name: e.target.value }));
              }}
            />
            <Input
              placeholder="Бренд"
              onChange={(e) => {
                setSupplier((state) => ({ ...state, brand: e.target.value }));
              }}
            />
            <div style={{ width: "100%" }}>
              <label htmlFor={"supplierType"}>Тип поставщика*</label>
              <Select
                className={`form-control`}
                options={options}
                value={
                  options
                    ? options.find(
                        (option) => option.value === supplier.supplierType,
                      )
                    : ""
                }
                onChange={(option) =>
                  setSupplier((state) => ({
                    ...state,
                    supplierType: option.value,
                  }))
                }
              />
            </div>
            <Input
              placeholder="Ссылка на сайт"
              onChange={(e) => {
                setSupplier((state) => ({ ...state, website: e.target.value }));
              }}
            />
            <Input
              placeholder="Адрес*"
              onChange={(e) => {
                setSupplier((state) => ({ ...state, address: e.target.value }));
              }}
            />
            <Input
              placeholder="Почта"
              onChange={(e) => {
                setSupplier((state) => ({ ...state, email: e.target.value }));
              }}
            />
            <Input
              placeholder="Телефон"
              onChange={(e) => {
                setSupplier((state) => ({ ...state, phone: e.target.value }));
              }}
            />

            <Stack spacing={4}>
              {supplier.staff.map((worker, index) => (
                <Box
                  key={index}
                  p={4}
                  border="1px"
                  borderColor="gray.200"
                  rounded="md"
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Heading size="sm">Контактное лицо #{index + 1}</Heading>
                    {supplier.staff.length > 1 && (
                      <IconButton
                        aria-label="Удалить контакт"
                        icon={<CloseIcon />}
                        onClick={() => {
                          supplier.staff.splice(index, 1);
                          setSupplier((state) => ({
                            ...state,
                            phone: supplier.staff,
                          }));
                        }}
                      />
                    )}
                  </Flex>
                  <Stack spacing={4}>
                    <Input
                      placeholder="Должность*"
                      onChange={(e) => {
                        supplier.staff[index].position = e.target.value;
                        setSupplier((state) => ({
                          ...state,
                          staff: supplier.staff,
                        }));
                      }}
                    />
                    <Input
                      placeholder="Почта*"
                      onChange={(e) => {
                        supplier.staff[index].email = e.target.value;
                        setSupplier((state) => ({
                          ...state,
                          staff: supplier.staff,
                        }));
                      }}
                    />
                    <Input
                      placeholder="Телефон*"
                      onChange={(e) => {
                        supplier.staff[index].phone = e.target.value;
                        setSupplier((state) => ({
                          ...state,
                          staff: supplier.staff,
                        }));
                      }}
                    />
                    <Input
                      placeholder="ФИО*"
                      onChange={(e) => {
                        supplier.staff[index].fio = e.target.value;
                        setSupplier((state) => ({
                          ...state,
                          staff: supplier.staff,
                        }));
                      }}
                    />
                  </Stack>
                </Box>
              ))}
              <Button
                leftIcon={<AddIcon />}
                variant="menu_yellow"
                onClick={() => {
                  supplier.staff.push({
                    position: "",
                    email: "",
                    phone: "",
                    fio: "",
                  });
                  setSupplier((state) => ({
                    ...state,
                    phone: supplier.staff,
                  }));
                }}
              >
                Добавить контактное лицо
              </Button>
            </Stack>

            <HStack width={"100%"} align={"flex-end"} justify={"space-between"}>
              <Input
                placeholder="БИК"
                onChange={(e) => {
                  setSupplier((state) => ({ ...state, bic: e.target.value }));
                }}
              />
              <Button>
                <IoSearchOutline
                  size={25}
                  onClick={() => {
                    if (supplier.bic.length == 9) {
                      getCSCHbyBic(supplier.bic)
                        .then((response) => response)
                        .then((data) => {
                          if (data && data.suggestions.length != 0) {
                            setSupplier((state) => ({
                              ...state,
                              bankName: data.suggestions[0].value,
                            }));
                            if (data.suggestions[0].data.correspondent_account)
                              setSupplier((state) => ({
                                ...state,
                                ksch: data.suggestions[0].data
                                  .correspondent_account,
                              }));
                            if (data.suggestions[0].data.kpp)
                              setSupplier((state) => ({
                                ...state,
                                kpp: data.suggestions[0].data.kpp,
                              }));
                          }
                        });
                    }
                  }}
                />
              </Button>
            </HStack>
            <Input
              placeholder="БИК"
              onChange={(e) => {
                setSupplier((state) => ({ ...state, bic: e.target.value }));
              }}
            />
            <FormikSelect
              style={{ width: "100%" }}
              isMulti // Включает возможность выбора нескольких опций
              placeholder="Адреса отгрузки"
              options={deliveryPlaceList}
              onChange={(e) => {
                console.log(e);
                let buffer = e.map((property) => property.value);
                console.log(buffer);
                setSupplier((state) => ({
                  ...state,
                  deliveryPlaceIdList: buffer,
                }));
              }}
              maxMenuHeight={150}
            />
            <AddAdress getAdresses={getDeliveryPlacesList} />
            <Input
              placeholder="Название банка"
              onChange={(e) => {
                setSupplier((state) => ({
                  ...state,
                  bankName: e.target.value,
                }));
              }}
            />
            <Input
              placeholder="Р. счет"
              onChange={(e) => {
                setSupplier((state) => ({
                  ...state,
                  psch: e.target.value,
                }));
              }}
            />
            <Input
              placeholder="КПП"
              onChange={(e) => {
                setSupplier((state) => ({
                  ...state,
                  kpp: e.target.value,
                }));
              }}
            />
            <Input
              placeholder="Кор. счет"
              onChange={(e) => {
                setSupplier((state) => ({
                  ...state,
                  ksch: e.target.value,
                }));
              }}
            />
            <Checkbox
              name="client"
              isChecked={supplier.client}
              onChange={() =>
                setSupplier((state) => ({
                  ...state,
                  client: !supplier.client,
                }))
              }
            >
              Клиент ?
            </Checkbox>
            <Button
              variant={"menu_yellow"}
              onClick={() => {
                createSupplier(supplier);
              }}
            >
              Создать
            </Button>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default CreateSupplierForMaterial;
