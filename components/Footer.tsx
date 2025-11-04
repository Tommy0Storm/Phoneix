import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold tracking-widest text-white mb-6">PHOENIX AUTOMATION</h3>
        <div className="flex justify-center space-x-6 mb-8 text-sm">
          <a href="mailto:contact@phoenixautomation.co.za" className="hover:text-white transition-colors">contact@phoenixautomation.co.za</a>
          <span>&bull;</span>
          <a href="tel:+27000000000" className="hover:text-white transition-colors">+27 (0)0 000 0000</a>
          <span>&bull;</span>
          <p>Gauteng, South Africa</p>
        </div>
        <p className="text-xs text-gray-500" style={{fontWeight: 400}}>
          &copy; {new Date().getFullYear()} Phoenix Automation. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;