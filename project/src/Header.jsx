import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import darkModeOn from '../assets/dark_mode_on.png'; 
import darkModeOff from '../assets/dark_mode_off.png'; 
import menuIcon from '../assets/menu.png';
import profileIcon from '../assets/avatar.png';
import PropTypes from 'prop-types';
import { ProfileDropdown } from './ProfileDropdown';
import './styles/header.css'

export const Header = ({ toggleDarkMode, darkMode, toggleSidebar, profileImg, toggleDropdown, dropdownOpen, onSelect }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log('Logged out');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileDiv = document.querySelector('.profile');
      if (profileDiv && !profileDiv.contains(event.target)) {
        onSelect(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSelect]);

  return (
    <header className="header">
      <div className='menu' onClick={toggleSidebar}>
        <img src={menuIcon} alt="Menu" />
      </div>
      <div className='profile' onClick={toggleDropdown} aria-label="Profile menu" role="button">
        <img src={profileImg || profileIcon} alt="Profile" /> 
      </div>
      <ProfileDropdown 
        isOpen={dropdownOpen} 
        onLogout={handleLogout} 
        onSelect={onSelect} // Pass the onSelect prop here
      />
      <h1>CO PO Mapper</h1>
      <div className="dark-mode-toggle" onClick={toggleDarkMode} aria-label="Toggle Dark Mode" role="button">
        <img src={darkMode ? darkModeOn : darkModeOff} alt="Toggle Dark Mode" />
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleDarkMode: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  profileImg: PropTypes.string,
  toggleDropdown: PropTypes.func.isRequired,
  dropdownOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired // Ensure this prop is required
};
