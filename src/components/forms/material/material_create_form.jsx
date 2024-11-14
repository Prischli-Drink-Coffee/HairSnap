import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TmcService from "../../../API/services/tmc_service";
import TmcTypeService from "../../../API/services/tmcType_service";
import CraftifyService from "../../../API/services/craftify_service";
import usePropertyValidationById from "../../../hooks/property_validation_by_id";
import MaterialService from "../../../API/services/material_service";
import {
  blobToBase64,
  mapPropertiesValidationToArray,
  materialPropertyDTOListToArray,
} from "./support/conversion_functions";
import FormikSelect from "../../UI/formik_select";
import Slider from "./slider/slider";
import Select from "react-select";
import PropertyService from "../../../API/services/property_service";
import { optionMeasureList, optionTypeList } from "../property/optionTypeList";
import CreateSupplierForMaterial from "./createSupplierForMaterial/create_supplier_for_material";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  tmcId: Yup.number().min(1, "Too Short!").required("Required"),
  tmcTypeId: Yup.number().min(1, "Too Short!").required("Required"),
  tmCraftifyIdList: Yup.array(
    Yup.number().min(1, "Too Short!").required("Required"),
  ).max(20, "Too Long!"),
  show: Yup.boolean().required("Required"),
});

const MaterialCreateForm = ({
  visibleModal,
  setVisibleModal,
  getMaterialList,
}) => {
  //Можно написать MaterialDto
  const startMaterial = {
    name: "",
    tmcId: "",
    tmcTypeId: "",
    tmCraftifyIdList: [],
    materialPropertyDTOList: new Map(),
    show: true,
  };
  let tmcTypeNew = { name: "", propertyIdList: [] };
  let tmcNew = { name: "", propertyIdList: [] };
  let propertyNew = { name: "", type: "", measure: "" };
  let craftifyNew = { name: "" };
  const [propertyList, setPropertyList] = useState([]);
  const createTmcType = async (propety) => {
    try {
      await TmcTypeService.createTmcType(propety);
      getTmcTypes();
      setTmcTypeAlert(<Text color={"#28D146"}>Успешно</Text>);
      setTimeout(() => {
        setTmcTypeAlert(null);
      }, 3000);
    } catch (error) {
      console.error("Error createTmcType:", error);
      setTmcTypeAlert(<Text color={"#FF0F00"}>Ошибка</Text>);
      setTimeout(() => {
        setTmcTypeAlert(null);
      }, 3000);
    }
  };
  const createTmc = async (propety) => {
    try {
      await TmcService.createTmc(propety);
      getTmcs();
      setTmcAlert(<Text color={"#28D146"}>Успешно</Text>);
      setTimeout(() => {
        setTmcAlert(null);
      }, 3000);
    } catch (error) {
      console.error("Error createTmc:", error);
      setTmcAlert(<Text color={"#FF0F00"}>Ошибка</Text>);
      setTimeout(() => {
        setTmcAlert(null);
      }, 3000);
    }
  };
  const createProperty = async (propety) => {
    try {
      await PropertyService.createProperty(propety);
      getProperties();
      setPropertyAlert(<Text color={"#28D146"}>Успешно</Text>);
      setTimeout(() => {
        setPropertyAlert(null);
      }, 3000);
    } catch (error) {
      console.error("Error createProperty:", error);
      setPropertyAlert(<Text color={"#FF0F00"}>Ошибка</Text>);
      setTimeout(() => {
        setPropertyAlert(null);
      }, 3000);
    }
  };

  const [material, setMaterial] = useState({
    name: "",
    tmcId: "",
    tmcTypeId: "",
    tmCraftifyIdList: [],
    materialPropertyDTOList: new Map(),
    show: true,
  });

  const [tmcList, setTmcList] = useState([]);

  const [tmcTypeList, setTmcTypeList] = useState([]);

  const [craftifyList, setCraftifyTypeList] = useState([]);

  const [tmcAlert, setTmcAlert] = useState(null);
  const [tmcTypeAlert, setTmcTypeAlert] = useState(null);
  const [propertyAlert, setPropertyAlert] = useState(null);
  const [craftifyAlert, setCraftifyAlert] = useState(null);

  const [mapPropertiesValidation, setMapPropertiesValidation] = useState(
    new Map(),
  );

  const [currentProperties, setCurrentProperties] = useState([]);

  const [images, setImages] = useState(null);

  const [isSubmit, setIsSubmit] = useState(false);
  const [propertyNewInf, setPropertyNewInf] = useState({
    name: "",
    type: "",
    measure: "",
  });
  const [tmcNewInf, setTmcNewInf] = useState({ name: "", propertyIdList: [] });
  const [tmcTypeNewInf, setTmcTypeNewInf] = useState({
    name: "",
    propertyIdList: [],
  });
  const [craftifyNewInf, setCraftifyNewInf] = useState({
    name: "",
  });
  const refImageInput = useRef();
  const selectRefTMC = useRef();
  const selectRefTmcType = useRef();
  const selectRefCraftifyIdList = useRef();

  const [propertyChangeability, changeMapPropertiesValidation] =
    usePropertyValidationById(
      mapPropertiesValidation,
      setMapPropertiesValidation,
    );
  const getProperties = async () => {
    try {
      const response = await PropertyService.getProperties();
      setPropertyList(
        response.data.map((property) => {
          return {
            value: property.id,
            label: property.name,
          };
        }),
      );
    } catch (error) {
      console.error("Error getProperties:", error);
    }
  };
  useEffect(() => {
    getProperties();
  }, []);
  const createMaterial = async () => {
    try {
      const formData = new FormData();
      formData.append(
        "insertMaterialDTO ",
        JSON.stringify({
          ...material,
          materialPropertyDTOList: materialPropertyDTOListToArray(
            material.materialPropertyDTOList,
          ),
        }),
      );
      for (let i = 0; i < images?.length; i++) {
        formData.append("files", images[i]);
      }
      await MaterialService.createMaterial(formData).then(() => {
        getMaterialList();
      });
    } catch (error) {
      console.error("Error putMaterial:", error);
    }
  };
  const createCraftify = async (propety) => {
    try {
      await CraftifyService.createCraftify(propety);
      getCraftifies();
      setCraftifyAlert(<Text color={"#28D146"}>Успешно</Text>);
      setTimeout(() => {
        setCraftifyAlert(null);
      }, 3000);
    } catch (error) {
      console.error("Error createCraftify:", error);
      setCraftifyAlert(<Text color={"#FF0F00"}>Ошибка</Text>);
      setTimeout(() => {
        setCraftifyAlert(null);
      }, 3000);
    }
  };

  const getTmcs = async () => {
    try {
      await TmcService.getTmcs().then((response) => {
        setTmcList(response.data);
      });
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  const getTmcTypes = async () => {
    try {
      await TmcTypeService.getTmcTypes().then((response) => {
        setTmcTypeList(
          response.data.map((craftify) => {
            return { value: craftify.id, label: craftify.name };
          }),
        );
      });
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  const getCraftifies = async () => {
    try {
      await CraftifyService.getCraftifies().then((response) => {
        setCraftifyTypeList(
          response.data.map((tmcType) => {
            return { value: tmcType.id, label: tmcType.name };
          }),
        );
      });
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  useEffect(() => {
    if (visibleModal) {
      getTmcs();
      getTmcTypes();
      getCraftifies();
    }
  }, [visibleModal]);

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
  };

  const changeProperty = (value, propertyId, type) => {
    const changeability = propertyChangeability(value, propertyId, type);
    if (changeability) {
      material.materialPropertyDTOList.set(propertyId, value);
      setMaterial({
        ...material,
        materialPropertyDTOList: material.materialPropertyDTOList,
      });
    }
  };

  const changeTmCraftifyIdList = (e) => {
    setMaterial({
      ...material,
      tmCraftifyIdList: e.map((craftify) => craftify.value),
    });
  };

  const changeTmcId = (e) => {
    if (!e) {
      setCurrentProperties([]);
      setMaterial({
        ...material,
        tmcId: "",
        materialPropertyDTOList: new Map(),
      });
      return;
    }
    const result = tmcList.find((Tmc) => {
      return Tmc.id === e.value;
    });
    changeMapPropertiesValidation(result.properties);
    const newCurrentProperties = [];
    const newMaterialPropertyDTOList = new Map();
    result.properties?.forEach((property) => {
      if (material.materialPropertyDTOList.has(property.id)) {
        newMaterialPropertyDTOList.set(
          property.id,
          material.materialPropertyDTOList.get(property.id),
        );
      } else {
        if (property.type === "BOOLEAN") {
          propertyChangeability(false, property.id, property.type);
          newMaterialPropertyDTOList.set(property.id, false);
        } else {
          newMaterialPropertyDTOList.set(property.id, "");
        }
      }
      newCurrentProperties.push({
        id: property.id,
        name: property.name,
        type: property.type,
        value: "",
      });
    });
    setCurrentProperties(newCurrentProperties);
    setMaterial({
      ...material,
      tmcId: e.value,
      materialPropertyDTOList: newMaterialPropertyDTOList,
    });
  };

  const [viewImages, setViewImages] = useState([]);

  const imageChangedHandler = async (event) => {
    try {
      const dt = new DataTransfer();
      for (let i = 0; i < event.target.files.length; i++) {
        if (
          event.target.files[i].type === "image/jpeg" ||
          event.target.files[i].type === "image/png"
        ) {
          dt.items.add(event.target.files[i]);
        }
      }
      event.target.files = dt.files;
      setImages(dt.files);
      const images = [];
      for (let i = 0; i < dt.files.length; i++) {
        const response = await blobToBase64(dt.files[i]);
        images.push(response);
      }
      setViewImages(images);
    } catch (error) {
      console.error("Error imageChangedHandler:", error);
    }
  };

  const clearImages = () => {
    refImageInput.current.value = null;
    setImages(refImageInput.current.files);
    setViewImages([]);
  };

  const deleteImage = (index) => {
    const newImages = new DataTransfer();
    for (let i = 0; i < images.length; i++) {
      if (i !== index) {
        newImages.items.add(images[i]);
      }
    }
    viewImages.splice(index, 1);
    setImages(newImages.files);
    setViewImages(viewImages);
    refImageInput.current.files = newImages.files;
  };

  const formik = useFormik({
    initialValues: material,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (
        !mapPropertiesValidationToArray(mapPropertiesValidation).includes(false)
      ) {
        createMaterial();
        onClose();
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const clearForm = () => {
    refImageInput.current.value = null;
    setImages(refImageInput.current.files);
    selectRefTMC.current.clearValue();
    selectRefTmcType.current.clearValue();
    selectRefCraftifyIdList.current.clearValue();
    setMaterial(startMaterial);
    formik.setErrors({});
    formik.setTouched({});
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
        mb={9}
      >
        <Text fontSize="2xl">Создание материала</Text>
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
            <div>
              <HStack>
                <label>Изображения</label>
                <CloseButton onClick={clearImages} />
              </HStack>
              <Input
                height={8}
                ref={refImageInput}
                borderColor="white"
                focusBorderColor="white"
                _hover={{ borderColor: "white" }}
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={imageChangedHandler}
                multiple
                maxWidth="100%"
                fontSize={["14px", "14px", "16px", "16px", "16px"]}
                placeholder="Изображение"
              />
            </div>
            {viewImages.length === 0 ? (
              ""
            ) : (
              <Slider deleteImage={deleteImage} images={viewImages} />
            )}
            <div>
              <label>Имя</label>
              <Input
                isInvalid={formik.errors.name && formik.touched.name}
                errorBorderColor="crimson"
                id="name"
                name="name"
                value={material.name}
                onChange={(e) =>
                  setMaterial({ ...material, name: e.target.value })
                }
                height="40px"
                placeholder="Название"
                maxWidth="100%"
                fontSize={["14px", "14px", "16px", "16px", "16px"]}
              />
            </div>
            <FormikSelect
              selectRef={selectRefTMC}
              options={tmcList.map((tmc) => {
                return { value: tmc.id, label: tmc.name };
              })}
              onChange={(e) => changeTmcId(e)}
              placeholder="ТМЦ (вид материала)"
              // fontSize={["14px", "14px", "16px", "16px", "16px"]}
            />
            <FormikSelect
              selectRef={selectRefTmcType}
              options={tmcTypeList}
              onChange={(e) => {
                if (!e) {
                  return;
                }
                setMaterial({ ...material, tmcTypeId: e.value });
              }}
              placeholder="Тип ТМЦ (тип материала)"
              // fontSize={["14px", "14px", "16px", "16px", "16px"]}
            />
            <CreateSupplierForMaterial />
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  Добавить новое свойство
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel minH={350} p={10} height={"max-content"}>
                  <VStack width={"100%"} align={"flex-end"}>
                    <Input
                      placeholder="Название"
                      onChange={(e) => {
                        propertyNew = propertyNewInf;
                        propertyNew.name = e.target.value;
                        setPropertyNewInf(propertyNew);
                        console.log(propertyNewInf);
                      }}
                    />
                    <Box width={"100%"} zIndex={99}>
                      <Select
                        placeholder="Тип"
                        options={optionTypeList}
                        onChange={(e) => {
                          propertyNew = propertyNewInf;
                          propertyNew.type = e.value;
                          setPropertyNewInf(propertyNew);
                        }}
                        maxMenuHeight={150}
                      />
                    </Box>
                    <Box width={"100%"} zIndex={99}>
                      <Select
                        placeholder="Единица измерения"
                        options={optionMeasureList}
                        onChange={(e) => {
                          propertyNew = propertyNewInf;
                          propertyNew.measure = e.value;
                          setPropertyNewInf(propertyNew);
                        }}
                        maxMenuHeight={150}
                      />
                    </Box>

                    <Button
                      variant={"menu_yellow"}
                      onClick={() => {
                        createProperty(propertyNewInf);
                      }}
                    >
                      Создать
                    </Button>
                    {propertyAlert}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  Добавить новый тип материала
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel minH={300} p={10}>
                  <VStack width={"100%"} align={"flex-end"}>
                    <Input
                      placeholder="Название"
                      onChange={(e) => {
                        tmcTypeNew = tmcTypeNewInf;
                        tmcTypeNew.name = e.target.value;
                        setTmcTypeNewInf(tmcTypeNew);
                      }}
                    />
                    <Box width={"100%"}>
                      <Select
                        isMulti // Включает возможность выбора нескольких опций
                        placeholder="Свойства"
                        options={propertyList}
                        onChange={(e) => {
                          tmcTypeNew = tmcTypeNewInf;
                          tmcTypeNew.propertyIdList = e.map(
                            (value) => value.value,
                          );
                          setTmcTypeNewInf(tmcTypeNew);
                        }}
                        maxMenuHeight={150}
                      />
                    </Box>

                    <Button
                      variant={"menu_yellow"}
                      onClick={() => {
                        createTmcType(tmcTypeNewInf);
                      }}
                    >
                      Создать
                    </Button>
                    {tmcTypeAlert}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  Добавить новый вид материала
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel minH={300} p={10}>
                  <VStack width={"100%"} align={"flex-end"}>
                    <Input
                      placeholder="Название"
                      onChange={(e) => {
                        tmcNew = tmcNewInf;
                        tmcNew.name = e.target.value;
                        setTmcNewInf(tmcNew);
                      }}
                    />
                    <Box width={"100%"}>
                      <Select
                        isMulti // Включает возможность выбора нескольких опций
                        placeholder="Свойства"
                        options={propertyList}
                        onChange={(e) => {
                          tmcNew.propertyIdList = e.map((value) => value.value);
                        }}
                        maxMenuHeight={150}
                      />
                    </Box>

                    <Button
                      variant={"menu_yellow"}
                      onClick={() => {
                        createTmc(tmcNewInf);
                      }}
                    >
                      Создать
                    </Button>
                    {tmcAlert}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  Добавить новый способ обработки
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel minH={300} p={10}>
                  <VStack width={"100%"} align={"flex-end"}>
                    <Input
                      placeholder="Название"
                      onChange={(e) => {
                        craftifyNew = craftifyNewInf;
                        craftifyNew.name = e.target.value;
                        setCraftifyNewInf(craftifyNew);
                      }}
                    />

                    <Button
                      variant={"menu_yellow"}
                      onClick={() => {
                        createCraftify(craftifyNewInf);
                      }}
                    >
                      Создать
                    </Button>
                    {craftifyAlert}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <FormikSelect
              isMulti
              selectRef={selectRefCraftifyIdList}
              options={craftifyList}
              onChange={(e) => changeTmCraftifyIdList(e)}
              // fontSize={["14px", "14px", "16px", "16px", "16px"]}
              placeholder="Способы обработки"
            />
            <Stack spacing={[1, 5]} direction={["column", "row"]}>
              <Checkbox
                size="md"
                colorScheme="green"
                isChecked={material.show}
                fontSize={["14px", "14px", "16px", "16px", "16px"]}
                onChange={(e) =>
                  setMaterial({ ...material, show: e.target.checked })
                }
              >
                Показывать
              </Checkbox>
            </Stack>
            {currentProperties?.map((item, index) => {
              return (
                <div key={item.id}>
                  {item.type === "BOOLEAN" ? (
                    <Checkbox
                      size="md"
                      colorScheme="green"
                      isChecked={material.materialPropertyDTOList.get(item.id)}
                      onChange={(event) =>
                        changeProperty(event.target.checked, item.id, item.type)
                      }
                    >
                      {item.name}
                    </Checkbox>
                  ) : (
                    <div>
                      <label>{item.name}</label>
                      <Input
                        isInvalid={
                          mapPropertiesValidation.get(item.id) === false &&
                          isSubmit
                        }
                        errorBorderColor="crimson"
                        value={material.materialPropertyDTOList.get(item.id)}
                        onChange={(event) =>
                          changeProperty(event.target.value, item.id, item.type)
                        }
                        type={item.type === "DATE" ? "date" : ""}
                        height="40px"
                        placeholder={item.name}
                        maxWidth="100%"
                        fontSize={["14px", "14px", "16px", "16px", "16px"]}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </SimpleGrid>
          <Flex justifyContent="flex-end">
            <Button variant="menu_red" onClick={onClose} mr={3}>
              Отмена
            </Button>
            <Button
              variant="menu_yellow"
              onClick={() => setIsSubmit(true)}
              type="submit"
              me={1}
            >
              Сохранить
            </Button>
          </Flex>
        </form>
      </Box>
    </>
  );
};

export default MaterialCreateForm;
