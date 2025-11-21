import React from "react";
import { Form, Button,Input } from "antd";
//import FormControl from "../../components/FormControl/FormInput";

const LoginForm = ({ form, loading, onFinish }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ username: "", password: "" }}
    >
      <Form.Item
        label="User Name"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      
      <Form.Item>
        <Button style={{background:'#31AAB7',color:'#fff'}} htmlType="submit" loading={loading} block>
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
