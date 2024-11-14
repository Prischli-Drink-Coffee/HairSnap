export const optionTypeList = [
  { value: "STRING", label: "Строка" },
  { value: "INTEGER", label: "Целочисленное" },
  { value: "DOUBLE", label: "Вещественное" },
  { value: "BOOLEAN", label: "Правда или ложь" },
  { value: "DATE", label: "Дата" },
];

export const optionMeasureList = [
  { value: "MILLIMETERS", label: "Миллиметры" },
  { value: "CENTIMETERS", label: "Сантиметры" },
  { value: "METERS", label: "Метры" },
  { value: "SQUARE_MILLIMETERS", label: "Квадратные миллиметры" },
  { value: "SQUARE_CENTIMETERS", label: "Квадратные сантиметры" },
  { value: "SQUARE_METERS", label: "Квадратные метры" },
  { value: "KILOGRAMS", label: "Килограммы" },
  { value: "MILLILITERS", label: "Миллилитры" },
  { value: "LITERS", label: "Литры" },
  { value: "GRAMS_CENTIMETER_CUBE", label: "Граммы на кубический сантиметр" },
  { value: "KILOGRAMS_METER_CUBE", label: "Килограммы на кубический метр" },
  { value: "PIECES", label: "Штуки" },
  { value: "ROLLS", label: "Рулоны" },
  { value: "SHEETS", label: "Листы" },
  { value: "WATTS", label: "Ватты" },
  { value: "VOLTS", label: "Вольты" },
  { value: "AMPERES", label: "Амперы" },
  { value: "OHMS", label: "Омы" },
  { value: "BUNDLES", label: "Пучки" },
  { value: "PACKS", label: "Пакеты" },
  { value: "OTHER", label: "Другое" },
];

// Единицы измерения длины
export const optionLengthList = [
  { value: "MILLIMETERS", label: "Миллиметры" },
  { value: "CENTIMETERS", label: "Сантиметры" },
  { value: "METERS", label: "Метры" },
];

// Единицы измерения площади
export const optionAreaList = [
  { value: "SQUARE_MILLIMETERS", label: "Квадратные миллиметры" },
  { value: "SQUARE_CENTIMETERS", label: "Квадратные сантиметры" },
  { value: "SQUARE_METERS", label: "Квадратные метры" },
];

// Единицы измерения объёма жидкости
export const optionLiquidList = [
  { value: "MILLILITERS", label: "Миллилитры" },
  { value: "LITERS", label: "Литры" },
];

// Единицы измерения плотности
export const optionDensityList = [
  { value: "GRAMS_CENTIMETER_CUBE", label: "Граммы на кубический сантиметр" },
  { value: "KILOGRAMS_METER_CUBE", label: "Килограммы на кубический метр" },
];

export const measureCategory = {
  length: [
    { value: "MILLIMETERS", label: "Миллиметры" },
    { value: "CENTIMETERS", label: "Сантиметры" },
    { value: "METERS", label: "Метры" },
  ],
  area: [
    { value: "SQUARE_MILLIMETERS", label: "Квадратные миллиметры" },
    { value: "SQUARE_CENTIMETERS", label: "Квадратные сантиметры" },
    { value: "SQUARE_METERS", label: "Квадратные метры" },
  ],
  liquid: [
    { value: "MILLILITERS", label: "Миллилитры" },
    { value: "LITERS", label: "Литры" },
  ],
  density: [
    { value: "GRAMS_CENTIMETER_CUBE", label: "Граммы на кубический сантиметр" },
    { value: "KILOGRAMS_METER_CUBE", label: "Килограммы на кубический метр" },
  ],
};
