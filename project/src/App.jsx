import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Home } from './Home';
import { About } from './About';
import { Contact } from './Contact';
import { Login } from './Login';
import { HelpButton } from './HelpButton';
import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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

  return (
    <>
    <Router>
      <div className={`App ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleSidebar={toggleSidebar} />
        
        {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        
        <Sidebar isOpen={sidebarOpen} onSelect={closeSidebar} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
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
