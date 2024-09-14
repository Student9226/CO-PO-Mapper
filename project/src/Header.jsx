import darkModeOn from '../assets/dark_mode_on.png'; 
import darkModeOff from '../assets/dark_mode_off.png'; 
import menuIcon from '../assets/menu.png';
import PropTypes from 'prop-types';

export const Header = ({ toggleDarkMode, darkMode, toggleSidebar }) => {
  return (
    <header className="header">
      <div className='menu' onClick={toggleSidebar}>
        <img src={menuIcon} alt="Menu" />
      </div>
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