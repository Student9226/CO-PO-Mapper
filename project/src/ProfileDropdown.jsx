import PropTypes from "prop-types";
import './styles/profileDropdown.css'

export const ProfileDropdown = ({isOpen, onSelect}) => {
  return (
    isOpen && (
      <div className="profile-dropdown">
        <ul>
          <li onClick={() => onSelect('/profile')} tabIndex={0}>Profile</li>
          <li onClick={() => onSelect('/about')} tabIndex={1}>About</li>
          <li onClick={() => onSelect('/contact')} tabIndex={2}>Contact</li>
          <li onClick={() => onSelect('/login')} tabIndex={3}>Log in</li>
        </ul>
      </div>
    )
  );
};

ProfileDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.string.isRequired,
};
