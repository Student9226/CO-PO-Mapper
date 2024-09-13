import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export const Login = () => {
  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
  };

  const handleLoginFailure = (error) => {
    console.log('Login Failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <div className="card">
      <h1>Login Page</h1>
      <div className="login-container">
        <GoogleLogin
          className="google-login-button"
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </div>
      </div>
    </GoogleOAuthProvider>
  );
};

