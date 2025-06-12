import { useState } from 'react';

export default function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log('Toggle menu clicked');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      setIsOpen(!isOpen);
      mobileMenu.classList.toggle('hidden');
    }
  };

  return (
    <button
      onClick={toggleMenu}
      className="md:hidden focus:outline-none"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
