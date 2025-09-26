import logo from '../assets/logo.png';
import trotinette from '../assets/trotinette.webp';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings, Bike, ShoppingBag } from 'lucide-react';

const features = [
  {
    icon: <Settings className="w-8 h-8" />,
    title: "Réparation Trottinette",
    description: "Réparation rapide et garantie pour tous modèles de trottinettes électriques.",
  },
  {
    icon: <Bike className="w-8 h-8" />,
    title: "Vélos & Gyroroues",
    description: "Vente et entretien de vélos électriques et gyroroues dernière génération.",
  },
  {
    icon: <ShoppingBag className="w-8 h-8" />,
    title: "Pièces & Accessoires",
    description: "Large choix de pièces détachées et accessoires de qualité.",
  },
];

const avis = [
  {
    name: 'Sophie L.',
    review: 'Service rapide et équipe très professionnelle. Je recommande vivement DocTrot !',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Yassine B.',
    review: 'Ma trottinette a été réparée en un temps record. Merci pour votre accueil chaleureux !',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Fatima Z.',
    review: 'Des conseils personnalisés et un vrai sens du service client.',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

const Home = () => {
  return (
    <>
      <style>
        {`
          @keyframes glowPulse {
            0%, 100% {
              filter: drop-shadow(0 0 8px #facc15);
            }
            50% {
              filter: drop-shadow(0 0 10px #facc15) drop-shadow(0 0 14px rgba(250, 204, 21, 0.6));
            }
          }
        `}
      </style>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-aos="fade-up">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${trotinette})`,
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="mb-8 relative">
            <img
              src={logo}
              alt="Doc'Trot Logo"
              className="h-32 md:h-40 w-auto object-contain hover:scale-105 transition-all duration-700 drop-shadow-2xl"
              style={{ 
                filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.5))',
                animation: 'gentleBounce 4s ease-in-out infinite, glow 3s ease-in-out infinite alternate'
              }}
              //data-aos="zoom-in"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            <span className="text-yellow-400">Votre partenaire mobilité électrique</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in delay-300">
            Nous sommes une équipe de professionnels réparateurs et conseillers clients
          </p>
          <Link
            to="/services"
            className="inline-flex items-center px-8 py-4 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 animate-fade-in delay-500"
          >
            Découvrir nos services
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nos Spécialités
            </h2>
            <p className="text-xl text-gray-300">
              Services professionnels pour votre mobilité électrique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-yellow-400/30 hover:bg-gray-800/70 transform hover:-translate-y-2 transition-all duration-500"
              >
                <div className="text-yellow-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avis Clients Section */}
      <section className="py-20 bg-gray-900" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-400 mb-12 animate-fade-in">Ce que disent nos clients</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {avis.map((avi, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 animate-fade-in border border-yellow-400/20">
                <img src={avi.avatar} alt={avi.name} className="w-20 h-20 rounded-full mb-4 border-4 border-yellow-400 shadow" data-aos="zoom-in" />
                <p className="text-gray-200 italic mb-4">"{avi.review}"</p>
                <span className="font-semibold text-yellow-400">{avi.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-20 bg-gray-900" data-aos="fade-up">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6 animate-fade-in">Nous rendre visite</h2>
          <p className="text-lg text-gray-200 mb-8">Retrouvez-nous à Rue de merode 106 Saint Gilles, Bruxelles, Belgique. Cliquez ci-dessous pour ouvrir notre emplacement sur Google Maps.</p>
          <a
            href="https://maps.app.goo.gl/PPXJgh24DwxUHmVg6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-300 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-bounce-slow"
          >
            Voir sur Google Maps
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Prêt à optimiser votre mobilité ?
          </h2>
          <p className="text-lg text-gray-900 mb-8">
            Contactez notre équipe d'experts pour un conseil personnalisé
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-black text-yellow-400 font-semibold rounded-lg hover:bg-gray-900 transform hover:scale-105 transition-all duration-300"
          >
            Nous contacter
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;