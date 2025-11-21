import React, { useState } from "react";
import { Form, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";

import NewPasswordForm from "./NewPasswordForm";
import LoginForm from "./LoginForm";
import { handleNewPassword, login } from "../../service/auth/index";
import ForgotPasswordForm from "./ForgotPasswordForm";
//import { useDispatch } from "react-redux";
//import { setUserDetails } from "features/user/userSlice";

const { Title } = Typography;

const Login = () => {
 // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newPasswordStep, setNewPasswordStep] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const resp = await login(values);
      if (resp.newPasswordForm !== undefined) {
        setUser(values.username);
        setPassword(values.password);
        setNewPasswordStep(true);
        return;
      }

      const jwt = resp.jwt;
      localStorage.setItem("token", jwt);
      message.success("Login successful");
      const role = resp.session.idToken.payload["custom:role"];
      const username = resp.session.idToken.payload["cognito:username"];
      const firstname = resp.session.idToken.payload["given_name"];
      const lastname = resp.session.idToken.payload["family_name"];
      const gender = resp.session.idToken.payload["gender"];
      setUser({ username, role, firstname, lastname, gender })
       navigate("/");
      console.log("role",role)
    } catch (err) {
      message.error(err.message || "Login failed");
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onNewPasswordForm = (data) => {
    setLoading(true);
    data = { ...data, userName: user, password: password };
    if (data.newPassword !== data.confirmPassword) {
      setLoading(false);
      alert("The new password does not match the confirm password.");
      return;
    }
    handleNewPassword(data)
      .then(() => {
        setLoading(false);
        setNewPasswordStep(false);
        alert("Password changed successfully");
        navigate("/");
      })
      .catch((error) => {
        if (error === "Error: Network Error") {
          alert("System is under maintenance. Please try again.");
        } else {
          alert(error.message);
        }
        setLoading(false);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 90,
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 8,
        }}
      >
        <Title level={3} style={{ textAlign: "center", color: "#31AAB7" }}>
          Login
        </Title>
        {newPasswordStep ? (
          <NewPasswordForm
            loading={loading}
            onNewPasswordForm={onNewPasswordForm}
          />
        ) : (
          <>
            <LoginForm form={form} loading={loading} onFinish={onFinish} />
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                setForgotPasswordOpen(true);
              }}
            >
              Forgot password
            </p>
          </>
        )}
        {forgotPasswordOpen && (
          <ForgotPasswordForm
            open={forgotPasswordOpen}
            setPassword={setForgotPasswordOpen}
          />
        )}
      </Card>
    </div>
  );
};

export default Login;
