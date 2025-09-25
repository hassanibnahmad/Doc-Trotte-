import  { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import trotinette2 from '../assets/trotinette2.webp';
import { blogService, type BlogPost } from '../lib/supabase';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]); // Start with empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true); // Start with loading true
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const postsPerPage = 6;

  // Load data directly from database
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { posts: fetchedPosts, totalCount: total } = await blogService.getPaginatedPosts(currentPage, postsPerPage);
        
        // Map the database posts to handle the image field
        const processedPosts = fetchedPosts.map(post => ({
          ...post,
          image: post.image_url === 'trotinette2.webp' ? trotinette2 : post.image_url
        }));
        
        setPosts(processedPosts);
        setTotalCount(total);
      } catch (error) {
        setPosts([]); // Set empty array on error
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

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
            Blog Doc'Trot
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-400 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20"
              />
            </div>
            <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30 scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  style={{ animationDelay: `${350 + index * 50}ms` }}
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
          {loading ? (
            // Enhanced Loading State
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <img
                  src={logo}
                  alt="Doc'Trot Logo"
                  className="h-20 w-auto object-contain animate-gentle-bounce animate-glow"
                />
                <div className="absolute inset-0 h-20 w-full border-2 border-transparent border-b-yellow-400 animate-pulse"></div>
              </div>
              <p className="text-xl text-gray-400 animate-pulse">Chargement des articles...</p>
              <div className="flex space-x-2 mt-4">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">Aucun article trouvé.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-400/50 hover:bg-gray-800/70 hover:shadow-2xl hover:shadow-yellow-400/20 transform hover:-translate-y-4 hover:scale-105 transition-all duration-700 ease-out animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image_url === 'trotinette2.webp' ? trotinette2 : post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = trotinette2;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-3 right-3 bg-black/90 backdrop-blur-sm rounded-lg p-2 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <img data-aos="zoom-in"
                        src={logo}
                        alt="Doc'Trot Logo"
                        className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-500"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                      />
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-400 mb-3 group-hover:text-gray-300 transition-colors duration-300">
                      <User className="w-4 h-4 mr-2 group-hover:text-yellow-400 transition-colors duration-300" />
                      <span className="mr-4">{post.author}</span>
                      <Calendar className="w-4 h-4 mr-2 group-hover:text-yellow-400 transition-colors duration-300" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <span className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-medium rounded-full mb-3 group-hover:bg-yellow-400/30 group-hover:scale-105 transition-all duration-300">
                      {post.category}
                    </span>
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-100 transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="text-gray-300 mb-4 line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-all duration-300 group-hover:translate-x-2"
                    >
                      Lire la suite
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {/* Enhanced Pagination */}
          {!loading && totalCount > postsPerPage && (
            <div className="flex justify-center mt-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="flex space-x-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 hover:scale-105 hover:shadow-lg transition-all duration-300 transform active:scale-95"
                  >
                    Précédent
                  </button>
                )}
                
                {Array.from({ length: Math.ceil(totalCount / postsPerPage) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                      currentPage === page
                        ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30 scale-105'
                        : 'bg-gray-800 text-white hover:bg-gray-700 hover:shadow-lg'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {currentPage < Math.ceil(totalCount / postsPerPage) && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 hover:scale-105 hover:shadow-lg transition-all duration-300 transform active:scale-95"
                  >
                    Suivant
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;