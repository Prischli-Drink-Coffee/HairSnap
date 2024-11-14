import React from "react";
import Select from "react-select";
import { useField } from "formik";

const CustomSelect = ({ label, options, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { touched, error } = meta;
  const { setValue } = helpers;
  return (
    <div className="form-group">
      <label htmlFor={props.id || props.name}>{label}</label>
      <Select
        className={`form-control ${touched && error ? "is-invalid" : ""}`}
        options={options}
        value={
          options ? options.find((option) => option.value === field.value) : ""
        }
        onChange={(option) => setValue(option.value)}
        onBlur={field.onBlur}
        {...props}
      />
      {touched && error ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
    </div>
  );
};

export default CustomSelect;
