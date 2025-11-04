
import React, { Fragment } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-white text-black w-full max-w-lg mx-4 p-8 transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInUp 0.5s' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-center mb-6">Request a Consultation</h2>
        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 sr-only">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#457B9D] focus:border-[#457B9D] transition-shadow duration-200 outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#457B9D] focus:border-[#457B9D] transition-shadow duration-200 outline-none"
            />
          </div>
          <div>
            <label htmlFor="service" className="sr-only">Service of Interest</label>
            <select
              id="service"
              name="service"
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-500 focus:text-black focus:ring-2 focus:ring-[#457B9D] focus:border-[#457B9D] transition-shadow duration-200 outline-none"
            >
              <option>Service of Interest</option>
              <option>Home Improvements & Maintenance</option>
              <option>Advanced Home Security</option>
              <option>Smart Home Automation</option>
              <option>Construction & Consulting</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
              name="message"
              id="message"
              rows={4}
              placeholder="Tell us about your project..."
              className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#457B9D] focus:border-[#457B9D] transition-shadow duration-200 outline-none resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#E63946] text-white font-semibold py-3 px-8 hover:bg-[#D62837] transition-colors duration-300 uppercase tracking-wider"
          >
            Submit Request
          </button>
        </form>
        <style>{`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translate3d(0, 20px, 0);
                }
                to {
                    opacity: 1;
                    transform: translate3d(0, 0, 0);
                }
            }
        `}</style>
      </div>
    </div>
  );
};

export default ContactModal;
