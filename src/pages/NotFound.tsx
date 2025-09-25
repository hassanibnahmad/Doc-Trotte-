import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Wrench } from 'lucide-react';
import logo from '../assets/logo.png';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="relative">
          {/* Background Pattern */}
         
          
          <div className="relative z-10 py-16">
            {/* Logo */}
            <div className="mb-8">
              <img
                src={logo}
                alt="Doc'Trot Logo"
                className="h-24 md:h-32 w-auto mx-auto object-contain animate-gentle-bounce"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.3))',
                }}
              />
            </div>

            {/* 404 Display */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold text-yellow-400 mb-4 animate-pulse">
                404
              </h1>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            </div>

            {/* Error Message */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Oups ! Page introuvable
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                La page que vous recherchez semble avoir pris la route... 🛴
              </p>
              <div className="flex items-center justify-center space-x-2 text-gray-400 mb-8">
                <Wrench className="w-5 h-5 text-yellow-400" />
                <p className="text-sm">
                  Nos techniciens travaillent peut-être sur cette page, ou elle n'existe pas.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="flex items-center px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-400/25"
              >
                <Home className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="flex items-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 hover:scale-105 border border-gray-600 hover:border-yellow-400/50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Page précédente
              </button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <p className="text-gray-400 mb-6">Vous cherchiez peut-être :</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/services"
                  className="px-4 py-2 text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 rounded-lg hover:border-yellow-400/50 transition-all duration-300"
                >
                  Nos Services
                </Link>
                <Link
                  to="/about"
                  className="px-4 py-2 text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 rounded-lg hover:border-yellow-400/50 transition-all duration-300"
                >
                  À Propos
                </Link>
                <Link
                  to="/blog"
                  className="px-4 py-2 text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 rounded-lg hover:border-yellow-400/50 transition-all duration-300"
                >
                  Blog
                </Link>
                <Link
                  to="/contact"
                  className="px-4 py-2 text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 rounded-lg hover:border-yellow-400/50 transition-all duration-300"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Fun Message */}
            <div className="mt-8 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg max-w-md mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Search className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-yellow-400 font-semibold">Conseil Doc'Trot</span>
              </div>
              <p className="text-sm text-gray-300">
                Comme pour nos trottinettes, parfois il faut juste vérifier l'URL ! 😉
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;