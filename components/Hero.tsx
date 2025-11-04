
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
      style={{ backgroundImage: `url('${bgImage.url}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      <div className="relative z-10 p-6">
        {/* Premium logo display */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#E63946] via-[#457B9D] to-[#E63946] rounded-full opacity-30 blur-lg animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-xl p-6 rounded-full border border-white/20">
              {/* Logo in background */}
              <img 
                src="/Phoneix/logo.png" 
                alt="Phoenix Projects Logo" 
                className="w-64 h-64 md:w-80 md:h-80 object-contain filter drop-shadow-2xl hover:scale-110 transition-transform duration-500 absolute inset-0 z-0 opacity-60"
                style={{background: 'transparent'}}
              />
              {/* Circular overlays on top */}
              <div className="relative z-10 w-64 h-64 md:w-80 md:h-80">
                <div className="absolute top-4 left-6 w-12 h-12 bg-gradient-to-br from-[#E63946]/40 to-transparent rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-10 h-10 bg-gradient-to-br from-[#457B9D]/45 to-transparent rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-6 left-8 w-8 h-8 bg-gradient-to-br from-white/35 to-transparent rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-4 right-6 w-14 h-14 bg-gradient-to-br from-[#E63946]/30 to-transparent rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute top-1/2 left-4 w-6 h-6 bg-gradient-to-br from-[#457B9D]/50 to-transparent rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/3 right-1/4 w-9 h-9 bg-gradient-to-br from-[#E63946]/35 to-transparent rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-[0.3em] mb-6 text-shadow-lg" style={{fontFamily: "'Quicksand', sans-serif", fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          ◆ EXCEPTIONAL CRAFTSMANSHIP
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-[#E63946] to-[#F77F00] mx-auto mb-8"></div>
        <h2 className="text-xl md:text-3xl font-light mb-12 max-w-4xl mx-auto leading-relaxed" style={{fontWeight: 300, letterSpacing: '0.05em'}}>
          ▲ Premier handyman, construction, and smart home automation services for discerning homeowners in Gauteng
        </h2>
        <button
          onClick={onQuoteClick}
          className="bg-gradient-to-r from-[#E63946] to-[#D62837] text-white font-semibold py-4 px-12 rounded-none hover:from-[#D62837] hover:to-[#C5252F] transition-all duration-500 transform hover:scale-110 text-lg uppercase tracking-[0.2em] shadow-2xl hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm"
          style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)'}}
        >
          ◆ GET ELITE CONSULTATION
        </button>
      </div>
    </section>
  );
};

export default Hero;
