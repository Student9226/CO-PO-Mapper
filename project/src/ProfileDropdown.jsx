import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles/profileDropdown.css';

export const ProfileDropdown = ({ isOpen, onSelect }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
      <ul>
        <li onClick={() => { navigate('/profile'); onSelect(); }}>Profile</li>
        <li onClick={() => { navigate('/about'); onSelect(); }}>About</li>
        <li onClick={() => { navigate('/contact'); onSelect(); }}>Contact</li>
        <li onClick={() => { console.log('Clicked Login'); }}>Log out</li>
      </ul>
    </div>
  );
};

ProfileDropdown.propTypes = {
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
};
