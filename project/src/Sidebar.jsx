import { useNavigate } from 'react-router-dom';
import './styles/sidebar.css'
import PropTypes from 'prop-types';

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
      <div className="sidebar-item" onClick={() => handleClick('profile')}>Profile</div>
    </aside>
  );
};

Sidebar.propTypes ={
  isOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
}