import React, { useState, useEffect } from 'react';
import { getRandomAboutImage, type ImagePool } from '../utils/images';

const About: React.FC = () => {
  const [image, setImage] = useState<ImagePool>({
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1740&auto=format&fit=crop',
    alt: 'Phoenix Automation team',
  });

  useEffect(() => {
    // Set random image on mount
    setImage(getRandomAboutImage());
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
                <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                />
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4 lg:pl-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black mb-4">Our Commitment</h2>
            <p className="text-gray-600 mb-6 text-lg" style={{fontWeight: 400}}>
              At Phoenix Projects, we believe that true quality lies in the intersection of superior materials, expert skill, and a client-centric approach. Our foundation is built on integrity, reliability, and a relentless pursuit of perfection.
            </p>
            <p className="text-gray-600 text-lg" style={{fontWeight: 400}}>
              We serve the Gauteng region with a promise: to treat every project, regardless of scale, with the highest level of professionalism and to deliver results that not only meet but exceed expectations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;