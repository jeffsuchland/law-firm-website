import { useState } from 'react';

export default function MobileMenu({ menuItems }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        id="menuButton" 
        className="md:hidden focus:outline-none" 
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      
      {/* Mobile menu */}
      <div 
        id="mobileMenu" 
        className={`absolute top-full left-0 right-0 bg-gray-900 py-4 px-6 md:hidden ${isOpen ? '' : 'hidden'}`}
      >
        <div className="flex flex-col space-y-4">
          {menuItems.map(item => (
            <a key={item.href} href={item.href} className="hover:text-gray-300">{item.text}</a>
          ))}
        </div>
      </div>
    </>
  );
}
