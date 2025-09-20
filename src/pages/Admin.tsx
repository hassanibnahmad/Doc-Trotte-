import logo from '../assets/logo.png';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src={logo} 
            alt="Doc'Trotte Logo" 
            className="w-24 h-24 hover:scale-110 transition-transform duration-500"
            style={{ filter: 'drop-shadow(0 0 20px #facc15)' }}
          />
        </div>

        {/* Coming Soon Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Bientôt Disponible
        </h1>
        
        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed">
          L'espace administrateur sera bientôt disponible.
        </p>
      </div>
    </div>
  );
};

export default Admin;