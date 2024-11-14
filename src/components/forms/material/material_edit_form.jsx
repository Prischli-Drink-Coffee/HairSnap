import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  HStack,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditMaterialDto from "../../../dto/edit_material_dto";
import MaterialService from "../../../API/services/material_service";
import ImageService from "../../../API/services/image_service";
import CraftifyService from "../../../API/services/craftify_service";
import usePropertyValidationById from "../../../hooks/property_validation_by_id";
import {
  blobToBase64,
  mapPropertiesValidationToArray,
  materialPropertyDTOListToArray,
  unitConversion,
} from "./support/conversion_functions";
import FormikSelect from "../../UI/formik_select";
import Slider from "./slider/slider";
import {
  measureCategory,
  optionMeasureList,
  optionTypeList,
} from "../property/optionTypeList";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  comment: Yup.string().nullable().min(1, "Too Short!").max(300, "Too Long!"),
  tmCraftifyIdList: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().min(1, "Too Short!").required("Required"),
        name: Yup.string()
          .min(1, "Too Short!")
          .max(50, "Too Long!")
          .required("Required"),
      })
    )
    .max(20, "Too Long!"),
  show: Yup.boolean().required("Required"),
});

const MaterialEditForm = ({
  measure,
  visibleModal,
  setVisibleModal,
  materialId,
  getMaterialList,
}) => {
  //Можно написать MaterialDto
  const [material, setMaterial] = useState(new EditMaterialDto());

  const [mapPropertiesValidation, setMapPropertiesValidation] = useState(
    new Map()
  );

  const [images, setImages] = useState(null);

  const [isSubmit, setIsSubmit] = useState(false);

  const [craftifyList, setCraftifyList] = useState([]);

  const [currentProperties, setCurrentProperties] = useState([]);

  const [propertyChangeability] = usePropertyValidationById(
    mapPropertiesValidation,
    setMapPropertiesValidation
  );

  const refImageInput = useRef();

  const selectCraftifiesRef = useRef();

  const generateBooleanMap = (properties) => {
    if (properties !== undefined) {
      const propertiesValidation = new Map();
      properties.forEach((obj) => {
        propertiesValidation.set(obj.property.id, true);
      });
      return propertiesValidation;
    }
  };

  const [viewImages, setViewImages] = useState([]);

  const getImages = async (images) => {
    const dt = new DataTransfer();
    const imageArray = [];
    for (const image of images) {
      await ImageService.getImageBlob(image.path).then((response) => {
        dt.items.add(
          new File([response.data], image.path, {
            type: response.data.type,
          })
        );
        imageArray.push(response.data);
      });
    }
    setViewImages(
      await Promise.all(
        imageArray.map(async (image) => await blobToBase64(image))
      )
    );
    return dt;
  };

  const getMaterial = async (materialId) => {
    try {
      const response = await MaterialService.getMaterial(materialId);
      selectCraftifiesRef.current?.setValue(
        response.data.tmCraftifies.map((crafty) => {
          return { value: crafty.id, label: crafty.name };
        })
      );
      setMaterial(new EditMaterialDto(response.data));
      setCurrentProperties(
        response.data.properties?.map((item) => {
          return {
            id: item.property.id,
            name: item.property.name,
            type: item.property.type,
            measure: item.property.measure,
          };
        })
      );
      setMapPropertiesValidation(generateBooleanMap(response.data.properties));
      setIsSubmit(false);
      const images = await getImages(response.data.images);
      refImageInput.current.files = images.files;
      setImages(images.files);
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  const updateMaterial = async () => {
    try {
      const formData = new FormData();
      formData.append(
        "updateMaterialDTO",
        JSON.stringify({
          ...material,
          tmCraftifyIdList: material.tmCraftifyIdList.map(
            (craftify) => craftify.id
          ),
          materialPropertyDTOList: materialPropertyDTOListToArray(
            material.materialPropertyDTOList
          ),
        })
      );
      for (let i = 0; i < images?.length; i++) {
        formData.append("files", images[i]);
      }
      await MaterialService.updateMaterial(materialId, formData).then(() => {
        getMaterialList();
      });
    } catch (error) {
      console.error("Error putMaterial:", error);
    }
  };

  const getCraftifies = async () => {
    try {
      await CraftifyService.getCraftifies().then((response) => {
        setCraftifyList(
          response.data.map((tmcType) => {
            return { value: tmcType.id, label: tmcType.name };
          })
        );
      });
    } catch (error) {
      console.error("Error getMaterial:", error);
    }
  };

  const onClose = () => {
    setVisibleModal(false);
    clearForm();
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

  const changeTmCraftifyIdList = (e) => {
    setMaterial({
      ...material,
      tmCraftifyIdList: e?.map((craftify) => {
        return {
          id: craftify.value,
          name: craftify.label,
        };
      }),
    });
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

  const checkMeasure = () => {
    for (let key in measure) {
      if (measure[key] !== "") {
        return false;
      }
    }
    return true;
  };

  const formik = useFormik({
    initialValues: material,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (
        !mapPropertiesValidationToArray(mapPropertiesValidation).includes(
          false,
        ) &&
        checkMeasure()
      ) {
        updateMaterial();
        setVisibleModal(false);
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (materialId > 0) {
      getMaterial(materialId);
      getCraftifies();
      formik.setErrors({});
      formik.setTouched({});
    }
  }, [materialId]);

  useEffect(() => {
    if (visibleModal) {
      getCraftifies();
    }
  }, [visibleModal]);

  const clearForm = () => {
    getMaterial(materialId);
    formik.setErrors({});
    formik.setTouched({});
  };

  const measureReplacing = (propertyMeasure) => {
    for (let key in measure) {
      if (measure[key] !== "") {
        const findMeasure = measureCategory[key].find(
          (option) => option.value === propertyMeasure
        );
        if (findMeasure !== undefined) {
          console.log(
            optionMeasureList.find(
              (optionMeasure) => optionMeasure.value === measure[key]
            )
          );
          return optionMeasureList.find(
            (optionMeasure) => optionMeasure.value === measure[key]
          );
        }
      }
    }
    return optionMeasureList.find(
      (optionMeasure) => optionMeasure.value === propertyMeasure
    );
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        fontWeight="bold"
        mb={9}
      >
        <Text fontSize="2xl">Редактирование материала</Text>
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
                <label>Изображение</label>
                <CloseButton onClick={clearImages} />
              </HStack>
              <Input
                multiple
                borderColor="white"
                focusBorderColor="white"
                _hover={{ borderColor: "white" }}
                height={8}
                ref={refImageInput}
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={imageChangedHandler}
                placeholder="Изображение"
                maxWidth="100%"
                fontSize={["14px", "14px", "16px", "16px", "16px"]}
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
            <div>
              <label>Комментарий</label>
              <Input
                isInvalid={formik.errors.comment && formik.touched.comment}
                errorBorderColor="crimson"
                value={material.comment || ""}
                id="comment"
                name="comment"
                onChange={(e) =>
                  setMaterial({ ...material, comment: e.target.value })
                }
                height="40px"
                placeholder="Комментарий"
                maxWidth="100%"
                fontSize={["14px", "14px", "16px", "16px", "16px"]}
              />
            </div>
            <FormikSelect
              isMulti
              selectRef={selectCraftifiesRef}
              options={craftifyList}
              onChange={(e) => changeTmCraftifyIdList(e)}
              placeholder="Способы обработки"
              // fontSize={["14px", "14px", "16px", "16px", "16px"]}
            />
            <Checkbox
              size="md"
              isChecked={material?.show}
              colorScheme="green"
              onChange={(e) =>
                setMaterial({ ...material, show: e.target.checked })
              }
              fontSize={["14px", "14px", "16px", "16px", "16px"]}
            >
              Показывать
            </Checkbox>
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
                      {`${item.name} ${
                        optionTypeList.find((type) => type.value === item.type)
                          .label
                      } ${measureReplacing(item.measure).label}`}
                    </Checkbox>
                  ) : (
                    <div>
                      <label>
                        {`${item.name} ${
                          optionTypeList.find(
                            (type) => type.value === item.type
                          ).label
                        } ${measureReplacing(item.measure).label}`}
                      </label>
                      <Input
                        isInvalid={
                          mapPropertiesValidation.get(item.id) === false &&
                          isSubmit
                        }
                        errorBorderColor="crimson"
                        value={unitConversion(
                          item.measure,
                          measure,
                          material.materialPropertyDTOList.get(item.id)
                        )}
                        onChange={(event) =>
                          changeProperty(event.target.value, item.id, item.type)
                        }
                        type={item.type === "DATE" ? "date" : ""}
                        height="40px"
                        placeholder={item.name}
                      />
                    </div>
                  )}
                </div>
              );
            })}
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
              onClick={() => setIsSubmit(true)}
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
    </>
  );
};

export default MaterialEditForm;
