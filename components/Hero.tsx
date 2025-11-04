
import React, { useState, useEffect } from 'react';
import { getRandomHeroImage, type ImagePool } from '../utils/images';

interface HeroProps {
  onQuoteClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onQuoteClick }) => {
  const [bgImage, setBgImage] = useState<ImagePool>({
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1920&auto=format&fit=crop',
    alt: 'Professional construction services',
  });

  useEffect(() => {
    // Set random background image on mount
    setBgImage(getRandomHeroImage());
  }, []);

  return (
    <section
      className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center transition-all duration-700"
      style={{ 
        backgroundImage: `url('${bgImage.url}')`,
        minHeight: '-webkit-fill-available' /* Fix for mobile Safari */
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      <div className="relative z-10 p-4 sm:p-6">
        {/* Premium logo display - Mobile Optimized */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            {/* Outer glow effect */}
            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-[#E63946]/20 via-[#457B9D]/20 to-[#E63946]/20 rounded-full blur-2xl animate-pulse"></div>
            
            {/* Main logo container */}
            <div className="relative">
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-transparent bg-gradient-to-r from-[#E63946] via-[#457B9D] to-[#E63946] animate-spin" style={{animationDuration: '8s', clipPath: 'inset(0 0 0 0 round 50%)'}}></div>
              
              {/* Inner container */}
              <div className="relative bg-gradient-to-br from-white via-gray-50 to-white p-4 sm:p-8 rounded-full shadow-2xl m-0.5 sm:m-1">
                {/* Premium logo display */}
                <img 
                  src="/Phoneix/logo.jpg" 
                  alt="Phoenix Projects Logo" 
                  className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl hover:scale-105 transition-all duration-700 rounded-full"
                />
                
                {/* Accent dots */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-[#E63946] rounded-full shadow-lg"></div>
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-2 h-2 sm:w-3 sm:h-3 bg-[#457B9D] rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 text-shadow-lg px-4" style={{fontFamily: "'Quicksand', sans-serif", fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          ◆ EXCEPTIONAL CRAFTSMANSHIP
        </h1>
        <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-[#E63946] to-[#F77F00] mx-auto mb-6 sm:mb-8"></div>
        <h2 className="text-base sm:text-xl md:text-3xl font-light mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4" style={{fontWeight: 300, letterSpacing: '0.05em'}}>
          ▲ Premier handyman, construction, and smart home automation services for discerning homeowners in Gauteng
        </h2>
        <button
          onClick={onQuoteClick}
          className="bg-gradient-to-r from-[#E63946] to-[#D62837] text-white font-semibold py-3 px-8 sm:py-4 sm:px-12 rounded-none hover:from-[#D62837] hover:to-[#C5252F] transition-all duration-500 transform hover:scale-110 active:scale-95 text-sm sm:text-lg uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-2xl hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm select-none"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)',
            touchAction: 'manipulation',
            minHeight: '44px'
          }}
        >
          ◆ GET ELITE CONSULTATION
        </button>
      </div>
    </section>
  );
};

export default Hero;
