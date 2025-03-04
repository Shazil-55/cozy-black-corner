
import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = containerRef.current?.querySelectorAll('.animate-on-scroll');
    if (elements) {
      elements.forEach((el) => observer.observe(el));
    }
    
    return () => {
      if (elements) {
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-300/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gray-300/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center z-10 pt-20">
        <div className="animate-on-scroll opacity-0 transform translate-y-4 transition-all duration-1000 ease-apple-ease">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            Designed with precision
          </span>
        </div>
        
        <h1 className="animate-on-scroll opacity-0 transform translate-y-4 transition-all duration-1000 delay-100 ease-apple-ease text-5xl md:text-7xl font-bold leading-tight md:leading-tight max-w-4xl mx-auto mb-6 text-balance">
          Minimal design for <span className="italic">maximum</span> impact
        </h1>
        
        <p className="animate-on-scroll opacity-0 transform translate-y-4 transition-all duration-1000 delay-200 ease-apple-ease text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 text-balance">
          Clean aesthetics, intuitive interactions, and flawless functionality. 
          We make digital experiences that leave a lasting impression.
        </p>
        
        <div className="animate-on-scroll opacity-0 transform translate-y-4 transition-all duration-1000 delay-300 ease-apple-ease flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#features" 
            className="button-hover rounded-full px-8 py-4 font-medium bg-white text-black"
          >
            Explore Features
          </a>
          <a 
            href="#work" 
            className="button-hover rounded-full px-8 py-4 font-medium border border-white/20 bg-white/5"
          >
            See Our Work
          </a>
        </div>
        
        <div className="animate-on-scroll opacity-0 transform translate-y-4 transition-all duration-1000 delay-400 ease-apple-ease mt-24">
          <div className="glass-card rounded-2xl p-1 inline-block cursor-pointer animate-floating">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" 
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
