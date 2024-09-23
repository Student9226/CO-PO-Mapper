/* eslint-disable no-unused-vars */
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

export const Login = ({onSendData}) => {
  const [profileImg, setProfileImg] = useState("");
  const [username, setUsername] = useState("");


  const handleLoginSuccess = (response) => {
    const credential = jwtDecode(response.credential);
    const name = credential.given_name.charAt(0).toUpperCase() + credential.given_name.slice(1).toLowerCase();
  setUsername(name);
  onSendData(name);
    setProfileImg(credential.picture);
  };

  const handleLoginFailure = (error) => {
    console.log("Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="74319926633-sqdklq8mhh90idd5nm8j5rj7ab9ted20.apps.googleusercontent.com">
      <div className="card">
        <h1>Login in to Google</h1>
        <div className="login-container">
          <GoogleLogin
            className="google-login-button"
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </div>
        {profileImg && <img src={profileImg} alt="Profile" />}
      </div>
    </GoogleOAuthProvider>
  );
};

Login.propTypes = {
  onSendData: PropTypes.func.isRequired,
};