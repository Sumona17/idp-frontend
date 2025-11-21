import React from "react";
import { Checkbox, Form } from "antd";
import { BlueCheckboxStyled } from "styles/components/FormControl";

const TableColCheckboxGroup = ({ options, onChange }) => {
  return (
    <BlueCheckboxStyled>
      <Form.Item>
        <Checkbox.Group
          options={options}
          // disabled
          // defaultValue={['Apple']}
          onChange={onChange}
        />
      </Form.Item>
    </BlueCheckboxStyled>
  );
};

export default TableColCheckboxGroup;
