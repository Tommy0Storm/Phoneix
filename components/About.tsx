import React from 'react';

const About: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <div className="relative h-96">
                <img 
                    src="https://images.unsplash.com/photo-1581092921462-21516f4a8e03?q=80&w=1740&auto=format&fit=crop" 
                    alt="Phoenix Automation team collaborating on a technical project" 
                    className="w-full h-full object-cover"
                />
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4 lg:pl-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black mb-4">Our Commitment</h2>
            <p className="text-gray-600 mb-6 text-lg" style={{fontWeight: 400}}>
              At Phoenix Automation, we believe that true quality lies in the intersection of superior materials, expert skill, and a client-centric approach. Our foundation is built on integrity, reliability, and a relentless pursuit of perfection.
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