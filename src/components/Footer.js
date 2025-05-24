import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '10px 0',
      backgroundColor: 'chocolate',
      fontSize: '14px',
      color: '#FF573B',
      marginTop: 'auto'
    }}>
      &copy; {new Date().getFullYear()} PS PaperTech Solutions
    </footer>
  );
};

export default Footer;
