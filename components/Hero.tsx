
import React from 'react';

interface HeroProps {
  onQuoteClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onQuoteClick }) => {
  return (
    <section 
      className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 p-6">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest mb-4" style={{fontFamily: "'Quicksand', sans-serif", fontWeight: 700}}>
          Exceptional Craftsmanship.
        </h1>
        <h2 className="text-lg md:text-2xl font-light mb-8 max-w-3xl mx-auto" style={{fontWeight: 400}}>
          Premier handyman, construction, and automation services for discerning homeowners in Gauteng.
        </h2>
        <button
          onClick={onQuoteClick}
          className="bg-[#E63946] text-white font-semibold py-3 px-8 rounded-md hover:bg-[#D62837] transition-all duration-300 transform hover:scale-105 text-base uppercase tracking-wider"
        >
          Get Your Free Consultation
        </button>
      </div>
    </section>
  );
};

export default Hero;
