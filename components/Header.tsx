import React from 'react';

interface HeaderProps {
  onQuoteClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onQuoteClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-widest" style={{fontFamily: "'Quicksand', sans-serif"}}>
          PHOENIX PROJECTS
        </h1>
        <nav>
          <button
            onClick={onQuoteClick}
            className="bg-[#E63946] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#D62837] transition-colors duration-300 text-sm uppercase tracking-wider"
          >
            Request a Quote
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;