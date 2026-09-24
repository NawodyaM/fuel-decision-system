import React from 'react';
import './visual-theme.css';
import { BrowserRouter, HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Processing from './pages/Processing';
import Result from './pages/Result';
import FuelTips from './pages/FuelTips';
import InputGuide from './pages/InputGuide';
import { FormProvider } from './FormContext';

const Router = process.env.REACT_APP_GITHUB_PAGES === 'true' ? HashRouter : BrowserRouter;

// Sidebar Component
const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-sidebar" style={sidebarStyle}>
      
      {/* Logo and System Title */}
      <div className="app-brand" style={logoContainerStyle}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#A2D2DF" style={{ flexShrink: 0 }}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
        <h2 style={logoTextStyles}>Fuel Decision System</h2>
      </div>

      {/* Menu Items */}
      <div className="app-navigation" style={menuContainerStyle}>
        
        {/* Input Guide Link */}
        <Link 
          to="/input-guide" 
          style={{ 
            ...linkStyle, 
            backgroundColor: isActive('/input-guide') ? '#2B4C48' : 'transparent',
            fontWeight: isActive('/input-guide') ? 'bold' : 'normal'
          }}
        >
          <span style={iconStyle}>📖</span> <span>Input Guide</span>
        </Link>

        {/* Dashboard Link */}
        <Link 
          to="/" 
          style={{ 
            ...linkStyle, 
            backgroundColor: isActive('/') ? '#2B4C48' : 'transparent',
            fontWeight: isActive('/') ? 'bold' : 'normal'
          }}
        >
          <span style={iconStyle}>🏠</span> <span>Dashboard</span>
        </Link>

        {/* Fuel Saving Tips Link */}
        <Link 
          to="/fuel-tips" 
          style={{ 
            ...linkStyle, 
            backgroundColor: isActive('/fuel-tips') ? '#2B4C48' : 'transparent',
            fontWeight: isActive('/fuel-tips') ? 'bold' : 'normal'
          }}
        >
          <span style={iconStyle}>💡</span> <span>Fuel Saving Tips</span>
        </Link>

      </div>

    </div>
  );
};

// Main App Component Content Wrapper
const MainContent = () => {
  const mainWrapperStyle = {
    display: 'flex', 
    minHeight: '100vh', 
    backgroundColor: '#F9F1E7', 
    color: '#000000',
    fontFamily: "'Times New Roman', Times, serif",
    position: 'relative'
  };

  return (
    <div className="fuel-app" style={mainWrapperStyle}>
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="app-content" style={{ flex: 1, marginLeft: '260px', padding: '40px', boxSizing: 'border-box', minWidth: '750px' }}>
        <Routes>
          <Route path="/input-guide" element={<InputGuide />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/result" element={<Result />} />
          <Route path="/fuel-tips" element={<FuelTips />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <FormProvider>
        <MainContent />
      </FormProvider>
    </Router>
  );
}

// Styles
const sidebarStyle = { 
  width: '260px', 
  backgroundColor: '#3A6D73', 
  color: 'white', 
  padding: '25px 15px', 
  display: 'flex', 
  flexDirection: 'column',
  position: 'fixed',
  height: '100vh',
  top: 0,
  left: 0,
  boxSizing: 'border-box',
  fontFamily: "'Times New Roman', Times, serif",
  zIndex: 1000
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '35px',
  paddingLeft: '5px',
  overflow: 'hidden'
};

const logoTextStyles = { 
  fontSize: '17px', 
  fontWeight: 'bold', 
  margin: 0,
  lineHeight: '1.2',
  fontFamily: "'Times New Roman', Times, serif"
};

const menuContainerStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '12px'
};

const linkStyle = { 
  display: 'flex', 
  alignItems: 'center',
  gap: '12px',
  color: 'white', 
  textDecoration: 'none', 
  padding: '12px 14px', 
  fontSize: '15px',
  borderRadius: '8px',
  transition: 'background 0.2s ease',
  fontFamily: "'Times New Roman', Times, serif",
  whiteSpace: 'nowrap'
};

const iconStyle = {
  fontSize: '16px',
  flexShrink: 0
};

export default App;
