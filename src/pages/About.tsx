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
      <section className="pt-16 py-20 bg-gray-900" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Qui sommes-nous ?
              </h1>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  Doc'Trotte, c'est une équipe passionnée de mobilité urbaine électrique.
                </p>
                <p>
                  Nous réparons, conseillons et accompagnons nos clients pour profiter au mieux 
                  de leurs trottinettes, vélos et gyroroues.
                </p>
                <p className="text-yellow-400 font-semibold">
                  Notre objectif : rendre vos trajets plus sûrs et plus agréables.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                data-aos="zoom-in"
                src="https://images.pexels.com/photos/7876045/pexels-photo-7876045.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Notre équipe"
                className="rounded-xl shadow-2xl w-full h-96 object-cover"
                style={{ position: 'relative', zIndex: 10 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" style={{ zIndex: 20 }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-black" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-300">
              Ce qui nous guide au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-800/30 border border-gray-700 hover:border-yellow-400/30 transform hover:-translate-y-2 transition-all duration-500"
              >
                <div className="text-yellow-400 mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">5+</div>
              <div className="text-lg text-gray-900">Années d'expérience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">1000+</div>
              <div className="text-lg text-gray-900">Réparations effectuées</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">98%</div>
              <div className="text-lg text-gray-900">Satisfaction client</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;