import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import avatar from "../assets/avatar.png";
import { Login } from "./Login";

export const Profile = ({ user = "User", picture = avatar }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome, {user}!</h2>
      <Login visible={false} />
      <img src={picture} alt="Profile" />
      <div>
        You can log in to your account for more features.
        <button onClick={() => navigate("/login")} role="button" tabIndex={0}>
          Log in
        </button>
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.string,
  picture: PropTypes.string,
};
