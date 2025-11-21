import React from "react";
import { Form, Select } from "antd";

const { Option } = Select;

const TableColSelect = ({ value, onChange, style, options }) => {
  return (
    <>
      <Form.Item>
        <Select value={value} onChange={onChange} style={style}>
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default TableColSelect;
