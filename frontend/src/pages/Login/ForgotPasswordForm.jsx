import { Button, Form, message } from "antd";
import React, { useState } from "react";
import { confirmNewPassword, handleForgotPassword } from "../../service/auth";

import PopupModal from "../../components/PopupModal";
import FormControl from "../../components/FormControl/FormInput";

export default function ForgotPasswordForm({ open, setPassword }) {
  const [requestForm] = Form.useForm();
  const [confirmForm] = Form.useForm();
  const [messageText, setMessageText] = useState(
    "An email will be sent to the email address associated with the Username."
  );

  const [cognitoUser, setCognitoUser] = useState(null);
  const [verifyCodeForm, setVerifyCodeForm] = useState(false);

  const onRequest = async (data) => {
    try {
      const res = await handleForgotPassword(data);

      setCognitoUser(res.cognitoUser);
      confirmForm.resetFields();
      setVerifyCodeForm(true);
      message.success("Verification code sent to your email/phone.");
      alert("Verification code sent to your email/phone.");
    } catch (err) {
      message.error(err.message);
    }
  };

  const onConfirm = async (data) => {
    try {
      await confirmNewPassword({
        cognitoUser,
        verificationCode: data.code,
        newPassword: data.newPassword,
      });
      message.success("Password reset successful. You can now login.");
      alert("Password reset successful. You can now login.");
      setPassword(false);
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleModalClose = () => {
    setPassword(false);
    setMessageText(
      "An email will be sent to the email address associated with the Username."
    );
  };

  const content = (
    <>
      <h2>Forgot Password </h2>

      <div className="email-subtext">{messageText}</div>

      {!verifyCodeForm ? (
        <Form
          form={requestForm}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="forgot-password-form"
          onFinish={onRequest}
          autoComplete="off"
        >
          <FormControl
            label="User Name"
            name="userName"
            required={true}
            // layout="vertical"
          />

          <Form.Item className="cancel-box" wrapperCol={{ span: 24 }}>
            <Button
              style={{ background: "#31AAB7", color: "#fff" }}
              htmlType="submit"
              className="signin-btn email"
            >
              Send Email
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          form={confirmForm}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="forgot-password-form"
          onFinish={onConfirm}
          autoComplete="off"
        >
          <FormControl
            label="Verification Code"
            name="code"
            required={true}
            // layout="vertical"
          />
          <FormControl
            label="New Password"
            name="newPassword"
            required={true}
            // layout="vertical"
          />
          <FormControl
            label="Confirm Password"
            name="confirmPassword"
            required={true}
            // layout="vertical"
          />

          <Form.Item className="cancel-box" wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="signin-btn email"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );

  return (
    <>
      <PopupModal open={open} onCancel={handleModalClose} content={content} />
    </>
  );
}
