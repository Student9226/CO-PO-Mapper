import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ isOpen, onSelect }) => {
  const navigate = useNavigate();

  const handleClick = (page) => {
    navigate(`/${page}`);
    onSelect();  
  };

  return (
    <aside style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
      <div className="sidebar-item" onClick={() => handleClick('')}>Home</div>
      <div className="sidebar-item" onClick={() => handleClick('about')}>About</div>
      <div className="sidebar-item" onClick={() => handleClick('contact')}>Contact</div>
      <div className="sidebar-item" onClick={() => handleClick('login')}>Login</div>
    </aside>
  );
};
