import React from 'react';

interface HeaderProps {
  onQuoteClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onQuoteClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl text-white shadow-2xl border-b border-white/10">
      <div className="container mx-auto px-8 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#E63946] to-[#D62837] rounded-full flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="text-2xl font-bold tracking-[0.2em] bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" style={{fontFamily: "'Quicksand', sans-serif"}}>
            PHOENIX PROJECTS
          </h1>
        </div>
        <nav>
          <button
            onClick={onQuoteClick}
            className="bg-gradient-to-r from-[#E63946] to-[#D62837] text-white font-semibold py-3 px-8 rounded-none hover:from-[#D62837] hover:to-[#C5252F] transition-all duration-500 text-sm uppercase tracking-[0.15em] shadow-xl hover:shadow-2xl transform hover:scale-105 border border-white/20"
          >
            PREMIUM CONSULTATION
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

// Add custom styles for ultra premium look
const styles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`;