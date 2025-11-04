import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold tracking-widest text-white mb-6">PHOENIX PROJECTS</h3>
        <div className="flex justify-center space-x-6 mb-8 text-sm">
          <a href="mailto:andrewtruter2@gmail.com" className="hover:text-white transition-colors">andrewtruter2@gmail.com</a>
          <span>&bull;</span>
          <a href="tel:+27794635951" className="hover:text-white transition-colors">+27 79 463 5951</a>
          <span>&bull;</span>
          <p>Gauteng, South Africa</p>
        </div>
        <p className="text-xs text-gray-500" style={{fontWeight: 400}}>
          &copy; {new Date().getFullYear()} Phoenix Projects. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;