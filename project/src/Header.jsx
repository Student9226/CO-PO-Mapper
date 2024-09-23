import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import darkModeOn from '../assets/dark_mode_on.png'; 
import darkModeOff from '../assets/dark_mode_off.png'; 
import menuIcon from '../assets/menu.png';
import profileIcon from '../assets/avatar.png';
import PropTypes from 'prop-types';
import {ProfileDropdown} from './ProfileDropdown';

export const Header = ({ toggleDarkMode, darkMode, toggleSidebar }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    console.log('Logged out'); 
    navigate('/login'); 
  };

  return (
    <header className="header">
      <div className='menu' onClick={toggleSidebar}>
        <img src={menuIcon} alt="Menu" />
      </div>
      <div className='profile' onClick={toggleDropdown}>
        <img src={profileIcon} alt="Profile" />
      </div>
      <ProfileDropdown isOpen={dropdownOpen} onLogout={handleLogout} onClose={() => setDropdownOpen(false)} />
      <h1>CO PO Mapper</h1>
      <div className="dark-mode-toggle" onClick={toggleDarkMode}>
        <img src={darkMode ? darkModeOn : darkModeOff} alt="Toggle Dark Mode" />
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleDarkMode: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};
