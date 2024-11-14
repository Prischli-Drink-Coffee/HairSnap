import React from "react";
import { Input } from "@chakra-ui/react";

const FormikInput = ({ label, formik, name, type, change }) => {
  return (
    <div>
      <label>{label}</label>
      <Input
        isInvalid={formik.errors[name] && formik.touched[name]}
        errorBorderColor="crimson"
        id={name}
        name={name}
        value={formik.values[name]}
        onChange={change ? change : formik.handleChange}
        height="40px"
        type={type}
        placeholder={label}
      />
    </div>
  );
};

export default FormikInput;
