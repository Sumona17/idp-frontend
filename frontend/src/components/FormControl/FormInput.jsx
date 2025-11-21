import React from "react";
import { Form, Input } from "antd";
import { FormInputFeild } from "../../style/components/FormControl";

const FormInput = ({
  theme,
  name,
  label,
  rules = [],
  value,
  required,
  layout,
  onChange,
  defaultValue,
  type,

  placeholder = "",
  ...rest
}) => {
  return (
    <FormInputFeild theme={theme}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        rules={[
          ...(required
            ? [{ required: true, message: `Please enter ${name}!` }]
            : []),
          ...rules,
        ]}
      >
        {type === "textarea" ? (
          <Input.TextArea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            defaultValue={defaultValue}
            data-has-default={!!defaultValue}
            {...rest}
          />
        ) : (
          <Input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            defaultValue={defaultValue}
            data-has-default={!!defaultValue}
            {...rest}
          />
        )}
      </Form.Item>
    </FormInputFeild>
  );
};

export default FormInput;
