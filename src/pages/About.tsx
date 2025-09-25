//import React from 'react';
import { Users, Award, Clock, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Équipe Experte",
      description: "Techniciens qualifiés et passionnés de mobilité électrique",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Qualité Garantie",
      description: "Réparations de haute qualité avec garantie incluse",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Service Rapide",
      description: "Diagnostic et réparation express pour votre mobilité",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Satisfaction Client",
      description: "Votre satisfaction est notre priorité absolue",
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
            Qui Sommes-Nous ?
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-yellow-400 font-medium mb-4">
            Experts en mobilité électrique urbaine
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Doc'Trot, c'est une équipe passionnée de mobilité urbaine électrique. 
            Nous réparons, conseillons et accompagnons nos clients pour profiter au mieux de leurs trottinettes, vélos et gyroroues.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-900" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nos Valeurs
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">
              Ce qui nous guide au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-yellow-400/50 transform hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:shadow-yellow-400/10"
              >
                <div className="text-yellow-400 mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-black" data-aos="fade-up">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Notre Mission
              </h2>
              <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  Chez Doc’Trot’, nous sommes passionnés par la mobilité électrique et convaincus qu’elle représente l’avenir de nos déplacements urbains.
                  C’est pourquoi nous mettons tout en œuvre pour offrir à nos clients des solutions fiables, pratiques et accessibles.
                </p>
                <p>
                  Notre équipe professionnelle de réparateurs et de conseillers accompagne chaque client dans son projet de mobilité, que ce soit pour la réparation ou la vente de trottinettes électriques, vélos électriques et gyroroues, ou encore pour l’achat de pièces et d’accessoires adaptés.
                </p>
                <p className="text-yellow-400 font-semibold text-xl">
                  Notre objectif : rendre vos trajets plus sûrs, plus agréables et plus respectueux de l'environnement.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                data-aos="zoom-in"
                src="https://images.pexels.com/photos/7876045/pexels-photo-7876045.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Notre équipe Doc'Trot"
                className="rounded-xl shadow-2xl w-full h-96 object-cover border border-gray-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500" data-aos="fade-up">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            En Quelques Chiffres
          </h2>
          <div className="w-24 h-1 bg-black/20 mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-6xl md:text-7xl font-bold text-black mb-4">5+</div>
              <div className="text-xl text-gray-900 font-semibold">Années d'expérience</div>
              <div className="text-gray-800 mt-2">dans la mobilité électrique</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-6xl md:text-7xl font-bold text-black mb-4">1000+</div>
              <div className="text-xl text-gray-900 font-semibold">Réparations effectuées</div>
              <div className="text-gray-800 mt-2">avec succès</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-6xl md:text-7xl font-bold text-black mb-4">98%</div>
              <div className="text-xl text-gray-900 font-semibold">Satisfaction client</div>
              <div className="text-gray-800 mt-2">mesurée et confirmée</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;