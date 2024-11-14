import {
  measureCategory,
  optionMeasureList,
} from "../../property/optionTypeList";

export const materialPropertyDTOListToArray = (materialPropertyDTOList) => {
  return Array.from(materialPropertyDTOList.entries(), ([key, value]) => ({
    propertyId: key,
    value,
  }));
};

export const mapPropertiesValidationToArray = (map) => {
  return Array.from(map.values());
};

export const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const conversionArray = {
  length: {
    MILLIMETERS: 1,
    CENTIMETERS: 10,
    METERS: 1000,
  },
  area: {
    SQUARE_MILLIMETERS: 1,
    SQUARE_CENTIMETERS: 100,
    SQUARE_METERS: 1000000,
  },
  liquid: {
    MILLILITERS: 1,
    LITERS: 1000,
  },
  density: {
    GRAMS_CENTIMETER_CUBE: 1,
    KILOGRAMS_METER_CUBE: 1000,
  },
};

const measurConversion = (startMeasure, endMeasure, value, mesureCategory) => {
  console.log(value);
  console.log(conversionArray[mesureCategory][startMeasure]);
  console.log(conversionArray[mesureCategory][endMeasure]);
  return (
    value *
    (conversionArray[mesureCategory][startMeasure] /
      conversionArray[mesureCategory][endMeasure])
  );
};

export const unitConversion = (propertyMeasure, measure, value) => {
  for (let key in measure) {
    if (measure[key] !== "") {
      const findMeasure = measureCategory[key].find(
        (option) => option.value === propertyMeasure,
      );
      if (findMeasure !== undefined) {
        let endMeasure = optionMeasureList.find(
          (optionMeasure) => optionMeasure.value === measure[key],
        ).value;
        return measurConversion(propertyMeasure, endMeasure, value, key);
      }
    }
  }
  return value;
};
