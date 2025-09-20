import  { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import trotinette2 from '../assets/trotinette2.webp';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Load blog posts from localStorage
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      // Update the first post to use the local image
      if (parsedPosts.length > 0 && parsedPosts[0].id === 1) {
        parsedPosts[0].image = trotinette2;
      }
      setPosts(parsedPosts);
    } else {
      // Default posts
      const defaultPosts: BlogPost[] = [
        {
          id: 1,
          title: "Les avantages de la trottinette électrique en ville",
          excerpt: "Découvrez pourquoi la trottinette électrique est devenue le moyen de transport urbain préféré des citadins.",
          content: "La trottinette électrique révolutionne nos déplacements urbains...",
          image: trotinette2,
          author: "Doc'Trotte Team",
          date: "2025-01-15",
          category: "Mobilité"
        },
        {
          id: 2,
          title: "Comment entretenir votre vélo électrique",
          excerpt: "Guide complet pour maintenir votre vélo électrique en parfait état et prolonger sa durée de vie.",
          content: "L'entretien régulier de votre vélo électrique est essentiel...",
          image: "https://images.pexels.com/photos/7876045/pexels-photo-7876045.jpeg?auto=compress&cs=tinysrgb&w=800",
          author: "Doc'Trotte Team",
          date: "2025-01-10",
          category: "Entretien"
        },
        {
          id: 3,
          title: "Gyroroue : le futur de la mobilité personnelle",
          excerpt: "Explorez les innovations technologiques qui font de la gyroroue un moyen de transport d'avenir.",
          content: "La gyroroue représente l'évolution naturelle de la mobilité personnelle...",
          image: "https://images.pexels.com/photos/6873899/pexels-photo-6873899.jpeg?auto=compress&cs=tinysrgb&w=800",
          author: "Doc'Trotte Team",
          date: "2025-01-05",
          category: "Innovation"
        }
      ];
      setPosts(defaultPosts);
      localStorage.setItem('blogPosts', JSON.stringify(defaultPosts));
    }
  }, []);

  const categories = ['all', ...Array.from(new Set(posts.map(post => post.category)))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 py-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-yellow-400/12"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYWNjMTUiIGZpbGwtb3BhY2l0eT0iMC4wNiI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIi8+PHJlY3QgeD0iNDAiIHk9IjQwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-25"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Blog Doc'Trotte
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-yellow-400 font-medium mb-4">
            L'actualité de la mobilité électrique
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Restez informé des dernières tendances, découvrez nos conseils d'experts 
            et suivez les innovations qui transforment nos déplacements urbains.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category === 'all' ? 'Tous' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
  <section className="py-20 bg-gray-900" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">Aucun article trouvé.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-400/30 hover:bg-gray-800/70 transform hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative">
                    <img data-aos="zoom-in"
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 right-2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-spin-slow">
                      <img data-aos="zoom-in"
                        src={logo}
                        alt="Doc'Trotte Logo"
                        className="w-[60px] h-[60px] object-contain hover:scale-110 hover:rotate-6 transition-transform duration-500"
                        style={{ filter: 'drop-shadow(0 0 8px #facc15)' }}
                      />
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <User className="w-4 h-4 mr-2" />
                      <span className="mr-4">{post.author}</span>
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <span className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-medium rounded-full mb-3">
                      {post.category}
                    </span>
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                    >
                      Lire la suite
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;