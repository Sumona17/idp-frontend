import styled from "styled-components";

export const TopBar = styled.div`
  width: 100%;
  height: 70px;
  background-color: #28a5ae;
`;

export const PageWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  background: white;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
`;

export const LoginCard = styled.div`
  width: 420px;
  background: #f8fafa;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.09);
  padding: 40px;
`;

export const Title = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #143a40;
  margin-bottom: 25px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: #143a40;
  display: flex;
  justify-content: flex-start;
`;

export const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #cdd9de;
  outline: none;
  font-size: 15px;
  display: block;
  width: 100%;
    margin-top: 6px;
    box-sizing: border-box;
    transition: border-color 0.3s ease-in-out;
    background-color: #f8fafa;
    color: #143a40;


  &:focus {
    border-color: #28a5ae;
  }
`;

export const Button = styled.button`
  width: 100%;
  background-color: #0a6370;
  color: white;
  padding: 14px;
  font-size: 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #094e57;
  }
`;

export const RegisterText = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #406b77;

  a {
    color: #0a6370;
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
