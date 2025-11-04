import React from 'react';
import type { Service } from '../types';
import { WrenchIcon, ShieldCheckIcon, HomeCogIcon, ClipboardDocIcon } from './icons/ServiceIcons';

const services: Service[] = [
  {
    name: '◆ Elite Home Improvements',
    description: 'From minor repairs to major renovations, we ensure your home is in pristine condition with meticulous attention to detail.',
    icon: <WrenchIcon />,
    subServices: ['◇ Premium Plumbing', '◇ Expert Electrical', '◇ Artisan Painting', '◇ Luxury Tiling', '◇ Master Carpentry', '◇ Elite Repairs'],
  },
  {
    name: '▲ Advanced Security Systems',
    description: 'State-of-the-art security solutions, including smart cameras, alarms, and access control for your peace of mind.',
    icon: <ShieldCheckIcon />,
    subServices: ['◇ HD CCTV Systems', '◇ Smart Alarms', '◇ Access Control', '◇ Electric Fencing', '◇ Premium Intercoms'],
  },
  {
    name: '● Smart Automation Suite',
    description: 'Integrate intelligent lighting, climate control, and entertainment systems for a seamless and modern living experience.',
    icon: <HomeCogIcon />,
    subServices: ['◇ Smart Lighting', '◇ Climate Control', '◇ Automated Gates', '◇ Audio Systems', '◇ Smart Blinds'],
  },
  {
    name: '■ Premium Construction',
    description: 'Expert project management and consulting services for new builds and extensions, delivering excellence from concept to completion.',
    icon: <ClipboardDocIcon />,
    subServices: ['◇ Project Management', '◇ New Builds', '◇ Renovations', '◇ Architectural Planning', '◇ Compliance Consulting'],
  },
];

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <div className="group bg-gray-50 border border-gray-200 p-8 text-center h-full flex flex-col items-center relative overflow-hidden" tabIndex={0} style={{minHeight: '360px'}}>
    <div className="text-[#457B9D] mb-5">{service.icon}</div>
    <h3 className="text-xl font-semibold uppercase tracking-wider text-black mb-3">{service.name}</h3>
    <div className="relative flex-grow w-full flex items-center justify-center">
      {/* Description */}
      <div className="transition-all duration-300 ease-in-out transform opacity-100 group-hover:opacity-0 group-focus-within:opacity-0 group-hover:-translate-y-2 group-focus-within:-translate-y-2">
        <p className="text-gray-600 text-base font-normal" style={{fontWeight: 400}}>{service.description}</p>
      </div>
      {/* Sub-services List */}
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out transform opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0">
        <ul className="text-left text-gray-700 space-y-1">
          {service.subServices?.map((sub, i) => <li key={i} className="flex items-center"><span className="text-[#457B9D] mr-2">◆</span>{sub}</li>)}
        </ul>
      </div>
    </div>
  </div>
);

const Services: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black">◆ Our Expertise</h2>
          <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto" style={{fontWeight: 400}}>
            ▲ Delivering ultra-premium services with an unwavering commitment to excellence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;