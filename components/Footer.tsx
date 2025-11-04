import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="container mx-auto px-6 text-center">
        {/* Logo and Company Name */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#E63946] to-[#457B9D] rounded-xl opacity-30 blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <img 
                src="/Phoneix/logo.png" 
                alt="Phoenix Projects Logo" 
                className="w-24 h-24 object-contain filter drop-shadow-lg opacity-85"
                style={{mixBlendMode: 'multiply'}}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold tracking-widest text-white">🏗️ PHOENIX PROJECTS</h3>
            <p className="text-sm text-gray-400 tracking-wide">⭐ Building Excellence Since 2009</p>
          </div>
        </div>
        <div className="flex justify-center space-x-6 mb-8 text-sm">
          <a href="mailto:andrewtruter2@gmail.com" className="hover:text-white transition-colors">📧 andrewtruter2@gmail.com</a>
          <span>&bull;</span>
          <a href="tel:+27794635951" className="hover:text-white transition-colors">📱 +27 79 463 5951</a>
          <span>&bull;</span>
          <p>📍 Gauteng, South Africa</p>
        </div>
        <p className="text-xs text-gray-500" style={{fontWeight: 400}}>
          © {new Date().getFullYear()} 🏗️ Phoenix Projects. All Rights Reserved. ⭐
        </p>
      </div>
    </footer>
  );
};

export default Footer;