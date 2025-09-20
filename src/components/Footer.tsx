//import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com/doctrotte", label: "Facebook" },
    { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/doctrotte", label: "Instagram" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/doctrotte", label: "Twitter" },
  ];

  const quickLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/about', label: 'À Propos' },
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <span className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow group">
                <img
                  src={logo}
                  alt="Doc'Trotte Logo"
                  className="w-[68px] h-[68px] object-contain transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                  style={{ filter: 'drop-shadow(0 0 8px #facc15)' }}
                />
              </span>
              <div>
                <span className="text-2xl font-bold text-white">Doc'Trotte</span>
                <div className="text-sm text-yellow-400">Mobilité électrique</div>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Votre partenaire de confiance pour la réparation et la vente de mobilité électrique. 
              Nous accompagnons vos déplacements urbains avec expertise et passion.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-yellow-400" />
                <span>+32 472 97 41 60</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-yellow-400" />
                <span>contact@doctrotte.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-yellow-400" />
                <span>Bruxelles, Belgique</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 sm:mb-0">
              © 2025 Doc'Trotte. Tous droits réservés.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center justify-center w-10 h-10 bg-yellow-400 text-black rounded-full hover:bg-yellow-300 transform hover:scale-110 transition-all duration-300 shadow-lg"
              aria-label="Retour en haut"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;