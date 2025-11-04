import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="container mx-auto px-6 text-center">
        {/* Logo and Company Name */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#E63946] to-[#457B9D] rounded-xl opacity-30 blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              {/* Circular overlays */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute top-2 left-2 w-6 h-6 bg-gradient-to-br from-[#E63946]/30 to-transparent rounded-full"></div>
                <div className="absolute top-3 right-3 w-5 h-5 bg-gradient-to-br from-[#457B9D]/25 to-transparent rounded-full"></div>
                <div className="absolute bottom-2 left-3 w-4 h-4 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-br from-[#E63946]/20 to-transparent rounded-full"></div>
              </div>
              <img 
                src="/Phoneix/logo.png" 
                alt="Phoenix Projects Logo" 
                className="w-48 h-48 object-contain filter drop-shadow-lg relative z-10"
                style={{background: 'transparent'}}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold tracking-widest text-white">◆ PHOENIX PROJECTS</h3>
            <p className="text-sm text-gray-400 tracking-wide">▲ Building Excellence Since 2009</p>
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
          © {new Date().getFullYear()} ◆ Phoenix Projects. All Rights Reserved. ▲
        </p>
      </div>
    </footer>
  );
};

export default Footer;