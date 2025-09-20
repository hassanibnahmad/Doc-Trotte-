import React from 'react';

interface AviClientProps {
  name: string;
  review: string;
  avatar: string;
}

const AviClient: React.FC<AviClientProps> = ({ name, review, avatar }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center group hover:scale-105 hover:shadow-2xl transition-all duration-500">
    <img
      src={avatar}
      alt={name}
      className="w-20 h-20 rounded-full border-4 border-yellow-400 mb-4 group-hover:rotate-6 transition-transform duration-500"
    />
    <h4 className="text-lg font-bold text-gray-900 mb-2">{name}</h4>
    <p className="text-gray-700 text-center italic">"{review}"</p>
  </div>
);

export default AviClient;
