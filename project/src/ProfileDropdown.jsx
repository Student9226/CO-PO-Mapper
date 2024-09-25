import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const ProfileDropdown = ({ isOpen, onSelect, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call the logout function passed as a prop
    navigate('/login'); // Redirect to the login page
    onSelect(); // Close the dropdown
  };

  return (
    isOpen && (
      <div className="profile-dropdown">
        <ul>
          <li onClick={onSelect}>Profile</li>
          <li onClick={onSelect}>About</li>
          <li onClick={onSelect}>Contact</li>
          <li onClick={() => navigate('/login')} role="button" tabIndex={0}>Log in</li>
        </ul>
      </div>
    )
  );
};

ProfileDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired // Ensure onLogout is defined as a prop
};
