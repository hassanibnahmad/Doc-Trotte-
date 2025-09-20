//import React from 'react';
import { Wrench, ShoppingCart, Package, CheckCircle } from 'lucide-react';
import ReparationExpressImg from '../assets/RéparationExpress.webp';
import VenteConseilsImg from '../assets/VenteConseils.webp';
import AccessoiresImg from '../assets/Accessoires.webp';

const Services = () => {
  const services = [
    {
      title: "Réparation Express",
      description: "Diagnostic et réparation en un temps record.",
      image: ReparationExpressImg,
      icon: <Wrench className="w-8 h-8" />,
      features: [
        "Diagnostic gratuit",
        "Réparation sous 24h",
        "Garantie 6 mois",
        "Pièces d'origine"
      ]
    },
    {
      title: "Vente & Conseils",
      description: "Trottinettes, vélos électriques et gyroroues adaptés à vos besoins.",
      image: VenteConseilsImg,
      icon: <ShoppingCart className="w-8 h-8" />,
      features: [
        "Conseil personnalisé",
        "Test avant achat",
        "Garantie constructeur",
        "Formation incluse"
      ]
    },
    {
      title: "Accessoires",
      description: "Casques, batteries, pneus et plus encore.",
      image: AccessoiresImg,
      icon: <Package className="w-8 h-8" />,
      features: [
        "Large gamme",
        "Marques reconnues",
        "Installation incluse",
        "Conseils d'usage"
      ]
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 py-32 bg-gray-900 overflow-hidden" data-aos="fade-up">
        <div className="absolute inset-0 bg-yellow-400/12"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYWNjMTUiIGZpbGwtb3BhY2l0eT0iMC4wNiI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIi8+PHJlY3QgeD0iNDAiIHk9IjQwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-25"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Nos Services
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-yellow-400 font-medium mb-4">
            Solutions complètes pour votre mobilité électrique
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            De la réparation express à la vente de véhicules neufs, en passant par tous les accessoires. 
            Découvrez notre gamme complète de services dédiés à votre mobilité urbaine.
          </p>
        </div>
      </section>

      {/* Services Section */}
  <section className="py-20 bg-gray-900" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center mb-6">
                    <div className="text-yellow-400 mr-4">{service.icon}</div>
                    <h2 className="text-3xl font-bold text-white">{service.title}</h2>
                  </div>
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-xl shadow-2xl w-full h-80 object-cover hover:scale-105 transform transition-transform duration-500"
                    data-aos="zoom-in"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
  <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Besoin d'un service ?
          </h2>
          <p className="text-lg text-gray-900 mb-8">
            Notre équipe est là pour vous accompagner dans tous vos besoins de mobilité électrique
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-black text-yellow-400 font-semibold rounded-lg hover:bg-gray-900 transform hover:scale-105 transition-all duration-300"
          >
            Prendre rendez-vous
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;