
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-apple-ease px-6 py-4",
        scrolled 
          ? "bg-black/80 backdrop-blur-lg border-b border-white/10" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-2xl font-medium tracking-tight">
          <span className="sr-only">Company Name</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white"></div>
            <span>Repo</span>
          </div>
        </a>
        
        <nav className="hidden md:flex items-center space-x-8">
          {['Features', 'Work', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="hover-link text-sm font-medium"
            >
              {item}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <a 
            href="#contact" 
            className="button-hover rounded-full px-5 py-2 text-sm font-medium border border-white/20 bg-white/5 hidden md:block"
          >
            Get Started
          </a>
          
          <button className="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
