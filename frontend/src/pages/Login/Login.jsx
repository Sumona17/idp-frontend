import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  
  PageWrapper,
  LoginCard,
  Title,
  Form,
  Label,
  Input,
  Button,
  RegisterText
} from "./../../styles/pages/Login.styles";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

   const handleLogin = () => {
    // Fake login — replace with real API
    localStorage.setItem("token", "12345");

     localStorage.setItem("username", username || "unknown");

    navigate("/upload"); //  Redirect to upload page
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <>
     

      <PageWrapper>
        <LoginCard>
          <Title>Login</Title>

          <Form onSubmit={handleLogin}>
            <div>
              <Label>User Name</Label>
              <Input
                type="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit">Login</Button>
          </Form>

          <RegisterText>
            Don’t have an account? <a href="#">Register</a>
          </RegisterText>
        </LoginCard>
      </PageWrapper>
    </>
  );
};

export default Login;
