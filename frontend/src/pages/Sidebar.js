import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={sidebarStyle}>
      <div style={logoContainerStyle}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#A2D2DF" style={{ flexShrink: 0 }}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
        <h2 style={logoTextStyles}>Fuel Decision System</h2>
      </div>

      <div style={menuContainerStyle}>
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

        <Link 
          to="/prediction" 
          style={{ 
            ...linkStyle, 
            backgroundColor: isActive('/prediction') ? '#2B4C48' : 'transparent',
            fontWeight: isActive('/prediction') ? 'bold' : 'normal'
          }}
        >
          <span style={iconStyle}>📊</span> <span>Prediction</span>
        </Link>

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

export default Sidebar;