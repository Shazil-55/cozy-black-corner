
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
        }
      });
    });

    // Initial animation on page load
    document.body.classList.add('smooth-display-enter');
    
    return () => {
      document.body.classList.remove('smooth-display-enter');
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Work section - simple placeholder */}
      <section id="work" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-6">
              Our Portfolio
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Selected work
            </h2>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto text-balance">
              A showcase of our most impactful projects, demonstrating our commitment to excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((_, index) => (
              <div 
                key={index}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-500 ease-apple-ease hover:scale-[1.02] group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-white/5 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-white/60">Project {index + 1}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-white/80 transition-colors">
                    Project Title {index + 1}
                  </h3>
                  <p className="text-gray-400">
                    Brief description of the project and its unique features.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact section - simple placeholder */}
      <section id="contact" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-6">
              Get in Touch
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Let's start a conversation
            </h2>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto text-balance">
              Ready to elevate your digital presence? We're here to help bring your vision to life.
            </p>
          </div>
          
          <div className="glass-card rounded-2xl p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                    placeholder="Your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="button-hover w-full rounded-lg px-6 py-4 font-medium bg-white text-black"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
