import React from 'react';

const About: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-black mb-4">
            About Phoenix Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E63946] to-[#457B9D] mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-wrap items-center -mx-4 mb-16">
          {/* Andrew's Image */}
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            <div className="relative">
              {/* Premium frame effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#E63946] via-[#457B9D] to-[#E63946] rounded-2xl opacity-20 blur-lg"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500">
                <div className="relative h-96 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                  {/* Try multiple image sources */}
                  <img
                    src="/Phoneix/andrew.jpg"
                    alt="Andrew Truter - Founder & Owner of Phoenix Projects"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    loading="eager"
                    onError={(e) => {
                      console.log('Primary image failed, trying fallback');
                      const img = e.target as HTMLImageElement;
                      // Try without the base path
                      img.src = './andrew.jpg';
                      img.onerror = () => {
                        console.log('Fallback also failed, showing placeholder');
                        const parent = img.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-[#E63946]/20 to-[#457B9D]/20 flex items-center justify-center">
                              <div class="text-center">
                                <div class="w-24 h-24 bg-gradient-to-br from-[#E63946] to-[#D62837] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                  <span class="text-white font-bold text-3xl">AT</span>
                                </div>
                                <h3 class="text-xl font-bold text-[#2c3e50] mb-2">Andrew Truter</h3>
                                <p class="text-[#457B9D] font-semibold">Founder & Owner</p>
                                <p class="text-gray-600 text-sm mt-1">⭐ Building Excellence Since 2009</p>
                                <p class="text-xs text-gray-500 mt-2">Professional Photo Loading...</p>
                              </div>
                            </div>
                          `;
                        }
                      };
                    }}
                    onLoad={() => console.log('Andrew image loaded successfully')}
                  />
                  {/* Professional overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
                {/* Professional caption */}
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-[#2c3e50] mb-2">Andrew Truter</h3>
                  <p className="text-[#457B9D] font-semibold">Founder & Owner</p>
                <p className="text-gray-600 text-sm mt-1">Building Excellence Since 2009</p>
                </div>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="w-full lg:w-1/2 px-4 lg:pl-12">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#E63946]/10 to-[#457B9D]/10 p-6 rounded-xl border-l-4 border-[#E63946]">
                <h3 className="text-2xl font-bold text-[#2c3e50] mb-4 flex items-center">
                  <span className="mr-3 text-[#E63946]">▲</span>
                  Our Story: Building Trust Since 2009
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Welcome to Phoenix Projects, a name synonymous with reliability and quality in the construction industry since 2009. Founded and personally managed by owner <strong className="text-[#E63946]">Andrew Truter</strong>, Phoenix Projects was built on a simple philosophy: to keep homeowners and small businesses happy by delivering exceptional workmanship and dependable service.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  For over <strong className="text-[#457B9D]">15 years</strong>, Andrew and his team have built a strong reputation for turning visions into reality. We understand that any project, big or small, is an important investment for our clients. That's why we are just as dedicated to small-scale home improvements as we are to managing and executing many large-scale projects we've successfully completed over the years.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Our strength lies in our people. Phoenix Projects employs a dedicated, skilled team of workers equipped to handle the specific demands of any project. This versatility allows us to assemble the perfect crew for your job, ensuring efficiency, quality, and a final result that we are proud to put our name on.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#457B9D] to-[#2c3e50] p-6 rounded-xl text-white shadow-xl">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">▼</span>
                  <h4 className="text-xl font-bold">Our Promise</h4>
                </div>
                <p className="text-lg font-medium">
                  At Phoenix Projects, we aren't just building structures; we are building lasting relationships based on trust.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-[#E63946] to-[#D62837] p-8 rounded-2xl text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
          <p className="text-lg mb-6 opacity-90">
            Experience the Phoenix Projects difference. Let Andrew and his team bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="tel:0794635951" 
              className="bg-white text-[#E63946] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Call Andrew: 079 463 5951
            </a>
            <span className="text-white/80">or chat with AI Jannie below!</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;