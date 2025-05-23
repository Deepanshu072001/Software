import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '10px 0',
      backgroundColor: '#f5f5f5',
      fontSize: '14px',
      color: '#555',
      marginTop: 'auto'
    }}>
      &copy; {new Date().getFullYear()} PS PaperTech Solutions
    </footer>
  );
};

export default Footer;
