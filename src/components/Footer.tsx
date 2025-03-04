
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-16 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <a href="/" className="text-2xl font-medium tracking-tight block mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white"></div>
                <span>Repo</span>
              </div>
            </a>
            <p className="text-gray-400 mb-6 max-w-md">
              A minimalist approach to digital experiences, where every detail is crafted with intention and purpose.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'instagram', 'github', 'dribbble'].map((social) => (
                <a 
                  key={social}
                  href={`#${social}`} 
                  className="hover-link p-1"
                  aria-label={`Follow us on ${social}`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <span className="block w-5 h-5 rounded-full bg-white/80"></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-3">
              {['Features', 'Work', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover-link text-gray-400 hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              {['Privacy', 'Terms', 'Cookies', 'Licenses'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover-link text-gray-400 hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Repo. All rights reserved.
          </p>
          
          <p className="text-gray-500 text-sm">
            Designed with precision and care.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
