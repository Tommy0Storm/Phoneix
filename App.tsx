
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white text-black antialiased">
      <Header onQuoteClick={openModal} />
      <main>
        <Hero onQuoteClick={openModal} />
        <Services />
        <About />
      </main>
      <Footer />
      <ContactModal isOpen={isModalOpen} onClose={closeModal} />
      <Chatbot />
    </div>
  );
};

export default App;