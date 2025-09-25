import  { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import trotinette2 from '../assets/trotinette2.webp';
import { blogService, type BlogPost } from '../lib/supabase';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const postId = parseInt(id);
        const fetchedPost = await blogService.getPostById(postId);
        
        if (fetchedPost) {
          setPost(fetchedPost);
          
          // Fetch related posts from the same category
          const allPosts = await blogService.getAllPosts();
          const related = allPosts
            .filter(p => p.id !== postId && p.category === fetchedPost.category)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-xl text-gray-400">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article non trouvé</h1>
          <Link
            to="/blog"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <User className="w-4 h-4 mr-2" />
            <span className="mr-4">{post.author}</span>
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(post.date)}</span>
          </div>
          
          <div className="flex items-center mb-6">
            <Tag className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-sm font-medium rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {post.title}
          </h1>

          <img data-aos="zoom-in"
            src={post.image_url || trotinette2}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-2xl"
            onError={(e) => {

              e.currentTarget.src = trotinette2;
            }}
          />
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="text-gray-300 leading-relaxed space-y-6">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
  <section className="py-20 bg-black" data-aos="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Articles similaires</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-400/30 hover:bg-gray-800/70 transform hover:-translate-y-2 transition-all duration-500"
                >
                  <img data-aos="zoom-in"
                    src={relatedPost.image_url === 'trotinette2.webp' ? trotinette2 : relatedPost.image_url}
                    alt={relatedPost.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-medium rounded-full mb-2">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
