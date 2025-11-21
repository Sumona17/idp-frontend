import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { poolData } from "./cognitoUserpool";

const userPool = new CognitoUserPool(poolData);

export const login = ({ username, password }) => {
  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        const jwt = session.getIdToken().getJwtToken();
        resolve({ jwt, session });
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: () => {
        return resolve({ newPasswordForm: true });
      },
    });
  });
};

export const handleNewPassword = async (data) => {
  const cognitoUser = new CognitoUser({
    Username: data.userName,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(
      new AuthenticationDetails({
        Username: data.userName,
        Password: data.password,
      }),
      {
        newPasswordRequired: () => {
          cognitoUser.completeNewPasswordChallenge(
            data.newPassword,
            {},
            {
              onSuccess: () => resolve({ passwordChanged: true }),
              onFailure: reject,
            }
          );
        },
      }
    );
  });
};

export const handleForgotPassword = (data) => {
  const userData = {
    Username: data.userName,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: function (data) {
        resolve({ success: true, data });
      },
      onFailure: function (err) {
        reject(err);
      },
      inputVerificationCode: function () {
        resolve({ success: true, step: "CODE_SENT", cognitoUser });
      },
    });
  });
};

export const confirmNewPassword = ({
  cognitoUser,
  verificationCode,
  newPassword,
}) => {
  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess() {
        resolve({ success: true });
      },
      onFailure(err) {
        reject(err);
      },
    });
  });
};
export const signOut = () => {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
  localStorage.clear();
  sessionStorage.clear();
};
