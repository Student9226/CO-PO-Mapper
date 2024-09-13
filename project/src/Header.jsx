import React, { useState, useEffect } from 'react';
import darkModeOn from '../assets/dark_mode_on.png'; // Adjust the path if necessary
import darkModeOff from '../assets/dark_mode_off.png'; // Adjust the path if necessary
import menuIcon from '../assets/menu.png';

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
