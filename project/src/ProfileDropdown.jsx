import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import './styles/profileDropdown.css'

export const ProfileDropdown = ({ isOpen, onSelect}) => {
  const navigate = (path)=>{
    useNavigate(path);

  }
  return (
    isOpen && (
      <div className="profile-dropdown">
        <ul>
          <li><button onClick={()=>navigate('/profile')} tabIndex={0}>Profile</button></li>
          <li><button onClick={()=>navigate('/about')} tabIndex={1}>About</button></li>
          <li><button onClick={()=>navigate('/contact')} tabIndex={2}>Contact</button></li>
          <li><button onClick={()=>navigate('/login')} tabIndex={3}>Log in</button></li>
        </ul>
      </div>
    )
  );
};

ProfileDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};
