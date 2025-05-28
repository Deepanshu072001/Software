import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '10px 0',
      backgroundColor: '#C0C0C0',
      fontSize: '14px',
      color: '#FF573B',
      marginTop: 'auto'
    }}>
      &copy; {new Date().getFullYear()} <h4> PS PaperTech Solutions </h4>
    </footer>
  );
};

export default Footer;
