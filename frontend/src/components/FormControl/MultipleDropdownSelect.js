import React, { useState } from 'react';
import { Select } from 'antd';
import { FormSelect } from "styles/components/FormControl";

const { Option } = Select;

const MultipleDropdownSelect = ({ options = [], defaultValue = [] }) => {
  const [selectedValues, setSelectedValues] = useState(defaultValue);

  const handleChange = (values) => {
    setSelectedValues(values);
  };

  return (
    <FormSelect>
      <Select
        mode="multiple"
        allowClear
        style={{
          backgroundColor: '#E6F2FC',
          width: '100%', // fixed width here
          borderRadius: 8,
        }}
        placeholder="Please select"
        value={selectedValues}
        onChange={handleChange}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </FormSelect>
  );
};

export default MultipleDropdownSelect;
