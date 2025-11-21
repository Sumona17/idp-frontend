import React from "react";
import { Button, Form, Input } from "antd";

const NewPasswordChangeForm = ({ loading, onNewPasswordForm, onFinishFailed }) => {
  return (
    <Form
  className="login-form"
  style={{marginTop:'50px'}}
  name="change-password"
  labelCol={{
    flex: '130px',
  }}
  wrapperCol={{
    flex: 1,
  }}
  labelAlign="left"
  onFinish={onNewPasswordForm}
  onFinishFailed={onFinishFailed}
  autoComplete="off"
>
  <Form.Item
    label="Password"
    name="password"
    rules={[{ required: true, message: "Please input your password!" }]}
  >
    <Input.Password />
  </Form.Item>

  <Form.Item
    label="New Password"
    name="newPassword"
    rules={[{ required: true, message: "Please input your new password!" }]}
  >
    <Input.Password />
  </Form.Item>

  <Form.Item
    label="Confirm Password"
    name="confirmPassword"
    rules={[{ required: true, message: "Please confirm your password!" }]}
  >
    <Input.Password />
  </Form.Item>

  <Form.Item
    wrapperCol={{
      offset: 0,
      span: 24,
    }}
  >
    <Button
      style={{ background: '#31AAB7', color: '#fff' }}
      htmlType="submit"
      loading={loading}
      className="signin-btn"
    >
      Submit
    </Button>
  </Form.Item>
</Form>

  );
};
export default NewPasswordChangeForm;