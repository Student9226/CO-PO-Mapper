import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Home } from './Home';
import { About } from './About';
import { Contact } from './Contact';
import { Login } from './Login';
import { HelpButton } from './HelpButton';
import { Profile } from './Profile';
import { ProfileDropdown } from './ProfileDropdown';
import './App.css';

const App = () => {
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

  const handleLogout = () => {
    console.log('Logged out');
  };

  return (
    <>
      <Router>
        <div className={`App ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Header 
            toggleDarkMode={toggleDarkMode} 
            darkMode={darkMode} 
            toggleSidebar={toggleSidebar} 
            profileImg="" // Pass a profile image if available
            toggleDropdown={() => setProfileDropdownOpen(prev => !prev)} // Pass toggle function
            dropdownOpen={profileDropdownOpen} // Pass dropdown state
            onSelect={() => setProfileDropdownOpen(false)} // Pass the close function for the dropdown
          />
          
          {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
          
          <Sidebar isOpen={sidebarOpen} onSelect={closeSidebar} />
          <ProfileDropdown 
            isOpen={profileDropdownOpen} 
            onLogout={handleLogout} 
            onSelect={() => setProfileDropdownOpen(false)} // Close dropdown on select
          />
          
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

export default App;
