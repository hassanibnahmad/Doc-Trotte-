import  { useState } from 'react';
import logo from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/about', label: 'À Propos' },
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-yellow-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full shadow">
              <img
                src={logo}
                alt="Doc'Trotte Logo"
                className="w-[52px] h-[52px] object-contain transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                style={{ filter: 'drop-shadow(0 0 8px #facc15)' }}
              />
            </span>
            <div>
              <span className="text-xl font-bold text-white">Doc'Trotte</span>
              <div className="text-xs text-yellow-400">Mobilité électrique</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  location.pathname === item.path
                    ? 'text-yellow-400 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 after:ease-in-out'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5 after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:left-0'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-yellow-400 hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  location.pathname === item.path
                    ? 'text-yellow-400 after:content-[""] after:absolute after:bottom-0 after:left-3 after:w-16 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 after:ease-in-out'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5 after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 after:ease-in-out hover:after:w-16 hover:after:left-3'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;