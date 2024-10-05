import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Home } from './Home';
import { About } from './About';
import { Contact } from './Contact';
import { Login } from './Login';
import { HelpButton } from './HelpButton';
import { Profile } from './Profile';
import { ProfileDropdown } from './ProfileDropdown';
import './styles/App.css';

export const App = () => {
  const navigate = useNavigate(); 
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleDropdown = (path) => {
    navigate(path);
    setProfileDropdownOpen(false);
  };

  return (
    <>
      <Router>
        <div className={`App ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Header 
            toggleDarkMode={toggleDarkMode} 
            darkMode={darkMode} 
            toggleSidebar={toggleSidebar} 
            profileImg="" 
            toggleDropdown={() => setProfileDropdownOpen(prev => !prev)} 
            dropdownOpen={profileDropdownOpen}
            onSelect={() => setProfileDropdownOpen(false)}
          />
          
          {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
          <Sidebar isOpen={sidebarOpen} onSelect={closeSidebar} />
          <ProfileDropdown isOpen={profileDropdownOpen} onSelect={handleDropdown} />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
      
      <div>
        <HelpButton />
      </div>
    </>
  );
};

