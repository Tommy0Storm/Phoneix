import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="container mx-auto px-6 text-center">
        {/* Logo and Company Name */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          <div className="relative">
            {/* Premium squared logo frame */}
            <div className="absolute -inset-1.5 bg-gradient-to-br from-[#E63946] via-[#457B9D] to-[#E63946] rounded-2xl opacity-60 blur"></div>
            <div className="relative bg-gradient-to-br from-white via-gray-50 to-white p-4 rounded-2xl shadow-2xl">
              <img 
                src="/Phoneix/logo.png" 
                alt="Phoenix Projects Logo" 
                className="w-16 h-16 object-contain drop-shadow-xl"
                style={{background: 'transparent'}}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold tracking-widest text-white">◆ PHOENIX PROJECTS</h3>
            <p className="text-sm text-gray-400 tracking-wide">▲ Building Excellence Since 2009</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <a href="mailto:andrewtruter2@gmail.com" className="flex items-center hover:text-white transition-colors group">
            <Mail size={16} className="mr-2 group-hover:scale-110 transition-transform" />
            andrewtruter2@gmail.com
          </a>
          <span className="hidden sm:inline">&bull;</span>
          <a href="tel:+27794635951" className="flex items-center hover:text-white transition-colors group">
            <Phone size={16} className="mr-2 group-hover:scale-110 transition-transform" />
            +27 79 463 5951
          </a>
          <span className="hidden sm:inline">&bull;</span>
          <p className="flex items-center">
            <MapPin size={16} className="mr-2" />
            Gauteng, South Africa
          </p>
        </div>
        <p className="text-xs text-gray-500" style={{fontWeight: 400}}>
          © {new Date().getFullYear()} ◆ Phoenix Projects. All Rights Reserved. ▲
        </p>
      </div>
    </footer>
  );
};

export default Footer;