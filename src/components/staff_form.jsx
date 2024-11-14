import React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";

const CustomInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { name, value, onChange, onBlur } = field;
  const { touched, error } = meta;
  return (
    <FormControl isInvalid={touched && error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomInput;
