/* eslint-disable no-unused-vars */
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

export const Login = ({ visible = true, onSendData = () => {} }) => {
  const [profileImg, setProfileImg] = useState("");

  const handleLoginSuccess = (response) => {
    const credential = jwtDecode(response.credential);
    const name = credential.given_name.charAt(0).toUpperCase() + credential.given_name.slice(1).toLowerCase();
    setProfileImg(credential.picture);
    onSendData(credential.picture); 
  };

  const handleLoginFailure = (error) => {
    console.log("Login Failed:", error);
  };

  return (
    <>
      {visible ? (
        <GoogleOAuthProvider clientId="74319926633-sqdklq8mhh90idd5nm8j5rj7ab9ted20.apps.googleusercontent.com">
          <div className="card">
            <h1>Login to Google</h1>
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
      ) : (
        profileImg && <img src={profileImg} alt="Profile" />
      )}
    </>
  );
};

Login.propTypes = {
  visible: PropTypes.bool,
  onSendData: PropTypes.func,
};
