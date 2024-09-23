import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const ProfileDropdown = ({ onLogout, isOpen, onClose }) => {
  ProfileDropdown.propTypes = {
    onLogout: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    isOpen && (
      <div className="profile-dropdown">
        <ul>
          <li onClick={() => handleNavigate("/profile")}>Profile</li>
          <li onClick={() => handleNavigate("/about")}>About</li>
          <li onClick={() => handleNavigate("/contact")}>Contact</li>
          <li onClick={onLogout}>Log Out</li>
        </ul>
      </div>
    )
  );
};
