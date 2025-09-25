import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Plus, Edit2, Trash2, Eye, EyeOff, Save, X, CheckCircle, AlertCircle, Info, Home, Mail, MessageSquare, Users, Clock, CheckCircle2 } from 'lucide-react';
import { blogService, adminService, type BlogPost, type BlogPostSummary, type ContactSubmission } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';

// Custom Alert Component
interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

// Custom Confirm Dialog Component
interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-red-500/20">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Confirmation de suppression</h3>
        </div>
        <div className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
          {message}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600 font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomAlert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500 text-white';
      case 'error':
        return 'bg-red-600 border-red-500 text-white';
      case 'info':
        return 'bg-blue-600 border-blue-500 text-white';
      default:
        return 'bg-gray-600 border-gray-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center p-4 rounded-lg border-l-4 shadow-lg max-w-md ${getAlertStyles()}`}>
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Cache for full post data to avoid repeated database calls
  const [postCache, setPostCache] = useState<Map<number, BlogPost>>(new Map());
  
  // Custom Alert State
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordFields, setShowPasswordFields] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Email Update State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailUpdate, setEmailUpdate] = useState('');

  // Login attempt tracking
  const [failedAttempts, setFailedAttempts] = useState(0);

  // First-time setup and password recovery states
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailSetup, setEmailSetup] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // Contact Submissions State
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'blog' | 'contact'>('blog');
  const [resetPassword, setResetPassword] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showResetPasswordFields, setShowResetPasswordFields] = useState({
    new: false,
    confirm: false
  });

  // Helper function to show alerts
  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000); // Auto-close after 5 seconds
  };

  const closeAlert = () => {
    setAlert(null);
  };

  // Helper function to show confirmation dialog
  const showConfirm = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ show: true, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmDialog(null);
  };

  useEffect(() => {
    // Log component state changes for debugging
    // Remove this in production
  }, [isAuthenticated, showEmailSetup, showForgotPassword, showResetPassword]);  useEffect(() => {
    // Initialize admin user in database if not exists
    const initializeAdmin = async () => {
      try {
        await adminService.initializeAdmin();
      } catch (error) {
        // Silent error handling for admin initialization
      }
    };
    
    // Check for password reset token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const rawToken = urlParams.get('reset_token');
    const token = rawToken ? decodeURIComponent(rawToken) : null;
    
    if (token) {
      // Verify the token immediately and mark as used
      verifyResetToken(token);
    }
    
    initializeAdmin();
  }, []);

  // Verify and consume reset token
  const verifyResetToken = async (token: string) => {
    try {
      const adminId = await adminService.verifyResetToken(token);
      if (adminId) {
        setResetToken(token);
        setShowResetPassword(true);
      } else {
        // Token is invalid, expired, or already used
        showAlert('error', 'Ce lien de réinitialisation est invalide, expiré ou a déjà été utilisé.');
        // Clean up URL
        window.history.replaceState({}, '', '/admin');
      }
    } catch (error) {
      showAlert('error', 'Erreur lors de la vérification du lien de réinitialisation.');
      window.history.replaceState({}, '', '/admin');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
      loadContactSubmissions();
    }
  }, [isAuthenticated]);

  const loadPosts = async () => {
    try {
      // Don't show loading spinner after initial load
      if (posts.length === 0) {
        setInitialLoading(true);
      }
      
      const fetchedPosts = await blogService.getAllPostsSummary();
      setPosts(fetchedPosts);
    } catch (error) {
      showAlert('error', 'Erreur lors du chargement des articles');
    } finally {
      setInitialLoading(false);
    }
  };

  // Contact submissions management
  const loadContactSubmissions = async () => {
    try {
      const submissions = await adminService.getContactSubmissions();
      const count = await adminService.getUnreadSubmissionsCount();
      setContactSubmissions(submissions);
      setUnreadCount(count);
    } catch (error) {
      showAlert('error', 'Erreur lors du chargement des messages de contact');
    }
  };

  const handleMarkAsRead = async (id: number, senderName: string) => {
    const success = await adminService.markSubmissionAsRead(id);
    if (success) {
      setContactSubmissions(prev => 
        prev.map(submission => 
          submission.id === id ? { ...submission, is_read: true } : submission
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      showAlert('success', `✅ Message de "${senderName}" marqué comme lu`);
    } else {
      showAlert('error', '❌ Erreur lors de la mise à jour du message');
    }
  };

  const handleDeleteSubmission = async (id: number, senderName: string) => {
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer le message de "${senderName}" ?`;

    showConfirm(confirmMessage, async () => {
      const success = await adminService.deleteContactSubmission(id);
      if (success) {
        const deletedSubmission = contactSubmissions.find(s => s.id === id);
        setContactSubmissions(prev => prev.filter(submission => submission.id !== id));
        if (deletedSubmission && !deletedSubmission.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        showAlert('success', '✅ Message supprimé avec succès');
      } else {
        showAlert('error', '❌ Erreur lors de la suppression du message');
      }
      // Close the confirmation dialog after action
      closeConfirm();
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check username first
      if (credentials.username !== 'admin') {
        setFailedAttempts(prev => prev + 1);
        showAlert('error', 'Nom d\'utilisateur incorrect. Utilisez "admin"');
        setLoading(false);
        return;
      }

      // Authenticate with Supabase
      const admin = await adminService.authenticate(credentials.username, credentials.password);
      
      if (admin) {
        setFailedAttempts(0); // Reset failed attempts on successful login
        setCurrentAdmin(admin);
        
        // Check if this is first login and email setup is required
        if (admin.first_login && !admin.email) {
          setShowEmailSetup(true);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        let errorMessage = 'Mot de passe incorrect. ';
        
        if (newAttempts === 1) {
          errorMessage += 'Veuillez réessayer.';
        } else if (newAttempts === 2) {
          errorMessage += 'Vérifiez que vous utilisez le bon mot de passe.';
        } else if (newAttempts >= 3) {
          errorMessage += 'Plusieurs tentatives échouées. Contactez l\'administrateur si nécessaire.';
        }
        
        showAlert('error', errorMessage);
      }
    } catch (error) {
      showAlert('error', 'Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setEditingPost({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      author: "Doc'Trot Team",
      date: new Date().toISOString().split('T')[0],
      category: 'Mobilité'
    });
    setShowModal(true);
  };

  const handleEditPost = async (postSummary: BlogPostSummary) => {
    try {
      // Check cache first
      const cachedPost = postCache.get(postSummary.id);
      if (cachedPost) {
        setEditingPost({
          ...cachedPost,
          image_url: cachedPost.image_url || ''
        });
        setShowModal(true);
        return;
      }

      setLoading(true);
      // Load the full post data including content and image
      const fullPost = await blogService.getPostById(postSummary.id);
      if (fullPost) {
        // Cache the full post data
        setPostCache(prev => new Map(prev.set(postSummary.id, fullPost)));
        
        setEditingPost({
          ...fullPost,
          image_url: fullPost.image_url || ''
        });
        setShowModal(true);
      } else {
        showAlert('error', 'Erreur lors du chargement de l\'article');
      }
    } catch (error) {
      showAlert('error', 'Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      setLoading(true);
      
      const postData = {
        title: editingPost.title?.trim() || '',
        excerpt: editingPost.excerpt?.trim() || '',
        content: editingPost.content?.trim() || '',
        image_url: editingPost.image_url?.trim() || '',
        author: editingPost.author?.trim() || "Doc'Trot Team",
        date: editingPost.date || new Date().toISOString().split('T')[0],
        category: editingPost.category?.trim() || 'Général'
      };

      // Validate required fields
      if (!postData.title || !postData.excerpt || !postData.content || !postData.image_url || !postData.category) {
        showAlert('error', 'Veuillez remplir tous les champs obligatoires (titre, extrait, contenu, image, catégorie)');
        return;
      }

      let savedPost;
      if (editingPost.id) {
        // Update existing post
        savedPost = await blogService.updatePost(editingPost.id, postData);
      } else {
        // Create new post
        savedPost = await blogService.createPost(postData);
      }

      if (savedPost) {
        // Clear cache and reload posts from database
        setPostCache(new Map());
        await loadPosts();
        closeModal();
        showAlert('success', 'Article sauvegardé avec succès!');
      } else {
        showAlert('error', 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      showAlert('error', 'Erreur lors de la sauvegarde de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    const confirmDelete = async () => {
      try {
        setLoading(true);
        const success = await blogService.deletePost(id);
        if (success) {
          // Clear cache and reload posts
          setPostCache(prev => {
            const newCache = new Map(prev);
            newCache.delete(id);
            return newCache;
          });
          await loadPosts();
          showAlert('success', 'Article supprimé avec succès!');
        } else {
          showAlert('error', 'Erreur lors de la suppression');
        }
      } catch (error) {
        showAlert('error', 'Erreur lors de la suppression de l\'article');
      } finally {
        setLoading(false);
      }
      closeConfirm();
    };

    showConfirm('Êtes-vous sûr de vouloir supprimer cet article ?', confirmDelete);
  };

  const handleImageSelect = (imageUrl: string) => {
    setEditingPost(prevPost => {
      if (!prevPost) return prevPost;
      return {
        ...prevPost,
        image_url: imageUrl
      };
    });
  };

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingPost(null);
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate new password
      if (passwordChange.newPassword.length < 6) {
        showAlert('error', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
        setLoading(false);
        return;
      }
      
      // Validate password confirmation
      if (passwordChange.newPassword !== passwordChange.confirmPassword) {
        showAlert('error', 'Les nouveaux mots de passe ne correspondent pas');
        setLoading(false);
        return;
      }

      // Change password using Supabase
      const result = await adminService.changePassword(
        passwordChange.currentPassword, 
        passwordChange.newPassword
      );

      if (result.success) {
        setShowPasswordModal(false);
        showAlert('success', 'Mot de passe modifié avec succès !');
      } else {
        showAlert('error', result.message);
      }
    } catch (error) {
      showAlert('error', 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordChange({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordFields({
      current: false,
      new: false,
      confirm: false
    });
  };

  // Email setup handlers
  const handleEmailSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailSetup.trim()) {
      showAlert('error', 'Veuillez entrer une adresse email valide');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailSetup.trim())) {
      showAlert('error', 'Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);
    try {
      const success = await adminService.updateAdminEmail(emailSetup.trim());
      if (success) {
        setShowEmailSetup(false);
        setIsAuthenticated(true);
        showAlert('success', 'Email configuré avec succès ! Vous pourrez maintenant récupérer votre mot de passe si nécessaire.');
      } else {
        showAlert('error', 'Erreur lors de la configuration de l\'email');
      }
    } catch (error) {
      showAlert('error', 'Erreur lors de la configuration de l\'email');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handlers
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      showAlert('error', 'Veuillez entrer votre adresse email');
      return;
    }

    if (!forgotPasswordEmail.includes('@') || !forgotPasswordEmail.includes('.')) {
      showAlert('error', 'Veuillez entrer une adresse email valide (ex: admin@doctrot.com)');
      return;
    }

    setLoading(true);
    try {
      const success = await adminService.sendPasswordResetEmail(forgotPasswordEmail.trim());
      if (success) {
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
        showAlert('success', '✅ Lien de réinitialisation envoyé ! Vérifiez votre boîte email et vos spams. Le lien expire dans 10 minutes.');
      } else {
        showAlert('error', '❌ Cette adresse email ne correspond à aucun compte administrateur. Vérifiez l\'orthographe.');
      }
    } catch (error) {
      showAlert('error', '❌ Erreur lors de l\'envoi de l\'email. Vérifiez votre connexion internet et réessayez.');
    } finally {
      setLoading(false);
    }
  };

  // Reset password handlers
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetPassword.newPassword.length < 6) {
      showAlert('error', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      showAlert('error', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const success = await adminService.resetPasswordWithToken(resetToken, resetPassword.newPassword);
      if (success) {
        setShowResetPassword(false);
        // Clear URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
        showAlert('success', 'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.');
      } else {
        showAlert('error', 'Lien de réinitialisation invalide ou expiré');
      }
    } catch (error) {
      showAlert('error', 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  // Email update handlers
  const handleChangeEmail = () => {
    setEmailUpdate(currentAdmin?.email || '');
    setShowEmailModal(true);
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailUpdate.trim()) {
      showAlert('error', 'Veuillez entrer une adresse email valide');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailUpdate.trim())) {
      showAlert('error', 'Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);
    try {
      const success = await adminService.updateAdminEmail(emailUpdate.trim());
      if (success) {
        // Update current admin data
        if (currentAdmin) {
          setCurrentAdmin({
            ...currentAdmin,
            email: emailUpdate.trim(),
            email_verified: false
          });
        }
        setShowEmailModal(false);
        showAlert('success', 'Email mis à jour avec succès !');
      } else {
        showAlert('error', 'Erreur lors de la mise à jour de l\'email');
      }
    } catch (error) {
      showAlert('error', 'Erreur lors de la mise à jour de l\'email');
    } finally {
      setLoading(false);
    }
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailUpdate('');
  };

  // Email Setup Modal (shown when needed, regardless of auth state)
  if (showEmailSetup) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">Configuration initiale</h1>
            <p className="text-gray-300">Configurez votre adresse email</p>
          </div>
          
          <form onSubmit={handleEmailSetup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                value={emailSetup}
                onChange={(e) => setEmailSetup(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="votre.email@exemple.com"
                required
                autoFocus
              />
            </div>
            
            <p className="text-gray-400 text-sm">
              Cette adresse email permettra la récupération de mot de passe en cas d'oubli.
            </p>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-lg transform transition-all duration-300 ${
                loading 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Configuration...
                </div>
              ) : (
                'Configurer'
              )}
            </button>
          </form>
        </div>
        
        {/* Custom Alert for email setup */}
        {alert && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={closeAlert}
          />
        )}
      </div>
    );
  }

  // Show reset password form when there's a reset token
  if (showResetPassword && resetToken) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">Réinitialiser le mot de passe</h1>
            <p className="text-gray-400 mt-2">Choisissez un nouveau mot de passe</p>
            <p className="text-yellow-400 text-sm mt-1">⏰ Ce lien expire dans 10 minutes</p>
            <p className="text-red-400 text-xs mt-1">🔥 Ce lien ne peut être utilisé qu'une seule fois</p>
          </div>
          
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showResetPasswordFields.new ? "text" : "password"}
                  value={resetPassword.newPassword}
                  onChange={(e) => setResetPassword({...resetPassword, newPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all pr-10"
                  placeholder="Au moins 6 caractères"
                  required
                  minLength={6}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowResetPasswordFields({...showResetPasswordFields, new: !showResetPasswordFields.new})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showResetPasswordFields.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showResetPasswordFields.confirm ? "text" : "password"}
                  value={resetPassword.confirmPassword}
                  onChange={(e) => setResetPassword({...resetPassword, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all pr-10"
                  placeholder="Répétez le mot de passe"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowResetPasswordFields({...showResetPasswordFields, confirm: !showResetPasswordFields.confirm})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showResetPasswordFields.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all transform ${
                loading
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Changement...
                </div>
              ) : (
                'Changer le mot de passe'
              )}
            </button>
            
            <div className="text-center">
              <Link
                to="/admin"
                className="inline-flex items-center px-4 py-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetToken('');
                  window.history.replaceState({}, '', '/admin');
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>

        {/* Custom Alert for reset */}
        {alert && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={closeAlert}
          />
        )}
      </div>
    );
  }

  if (!isAuthenticated && !showEmailSetup) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">Administration</h1>
            </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                onFocus={() => {
                  // Reset failed attempts when user focuses on username field
                  if (failedAttempts >= 2) {
                    setFailedAttempts(0);
                  }
                }}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${
                  failedAttempts >= 2 ? 'border-red-500 focus:ring-red-400' : 'border-gray-600'
                }`}
                placeholder="admin"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  onFocus={() => {
                    // Reset failed attempts when user focuses on password field after multiple failures
                    if (failedAttempts >= 3) {
                      setFailedAttempts(0);
                    }
                  }}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all pr-10 ${
                    failedAttempts >= 2 ? 'border-red-500 focus:ring-red-400' : 'border-gray-600'
                  }`}
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {/* Failed Attempts Warning */}
            {failedAttempts >= 2 && (
              <div className="bg-red-900/30 border border-red-600 rounded-lg p-3">
                <p className="text-sm text-red-300 text-center">
                  <span className="text-red-400">⚠️ Attention :</span> {failedAttempts} tentatives échouées. 
                  {failedAttempts >= 3 ? ' Contactez l\'administrateur si vous avez oublié votre mot de passe.' : ''}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-lg transform transition-all duration-300 ${
                loading 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
            
            <div className="mt-4 text-center space-y-2">
              {!showForgotPassword ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                  }}
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 underline text-sm"
                >
                  Mot de passe oublié ?
                </button>
              ) : null}
              
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </form>

          {/* Forgot Password Form - Outside main form */}
          {showForgotPassword && (
            <div className="mt-6 bg-gray-800 border border-gray-700 p-6 rounded-lg">
              <h3 className="text-yellow-400 text-lg font-semibold mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Récupération de mot de passe
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                Entrez votre adresse email pour recevoir un lien de réinitialisation:
              </p>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="votre.email@exemple.com"
                  required
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-2 px-4 font-medium rounded-lg transition-colors ${
                      loading
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-yellow-400 text-black hover:bg-yellow-300'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Envoi...
                      </div>
                    ) : (
                      'Envoyer le lien'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                    }}
                    disabled={loading}
                    className="flex-1 py-2 px-4 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Custom Alert for login page */}
        {alert && (
          <CustomAlert
            type={alert.type}
            message={alert.message}
            onClose={closeAlert}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Administration Doc'Trot</h1>
            {currentAdmin?.email && (
              <div className="flex items-center mt-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span className="mr-2 break-all">{currentAdmin.email}</span>
                {!currentAdmin.email_verified && (
                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs whitespace-nowrap">
                    Non vérifié
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={handleChangeEmail}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors text-sm sm:text-base"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Modifier email
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors text-sm sm:text-base"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Changer mot de passe
            </button>
            <Link
              to="/"
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Voir le site
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex flex-col sm:flex-row gap-2 sm:gap-8">
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center justify-center sm:justify-start px-4 py-3 sm:py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'blog'
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Gestion du Blog
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center justify-center sm:justify-start px-4 py-3 sm:py-2 font-medium rounded-lg transition-colors relative ${
                activeTab === 'contact'
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Messages de Contact
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Blog Management Tab */}
        {activeTab === 'blog' && (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">Articles du Blog</h2>
              <button
                onClick={handleAddPost}
                className="flex items-center justify-center px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvel Article
              </button>
            </div>

            {/* Blog Posts List */}

        {initialLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400">Chargement des articles...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Aucun article trouvé</p>
            <button
              onClick={handleAddPost}
              className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer votre premier article
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6">{/* ... rest of post card ... */}
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Modal */}
        {showModal && editingPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingPost.id ? 'Modifier' : 'Créer'} un article
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSavePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Extrait *
                  </label>
                  <textarea
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contenu *
                  </label>
                  <textarea
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    rows={8}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={editingPost.category || ''}
                      onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="Mobilité">Mobilité</option>
                      <option value="Entretien">Entretien</option>
                      <option value="Innovation">Innovation</option>
                      <option value="Conseils">Conseils</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={editingPost.date || ''}
                      onChange={(e) => setEditingPost({...editingPost, date: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      required
                    />
                  </div>
                </div>
                
                <ImageUpload
                  currentImage={editingPost?.image_url}
                  onImageSelect={handleImageSelect}
                  onError={(message) => showAlert('error', message)}
                  onSuccess={(message) => showAlert('success', message)}
                  isRequired={!editingPost?.image_url}
                  disabled={loading}
                />
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center flex-1 justify-center py-2 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-500 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Changer le mot de passe</h2>
                <button
                  onClick={closePasswordModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordFields.current ? "text" : "password"}
                      value={passwordChange.currentPassword}
                      onChange={(e) => setPasswordChange({...passwordChange, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPasswordFields({...showPasswordFields, current: !showPasswordFields.current})}
                    >
                      {showPasswordFields.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordFields.new ? "text" : "password"}
                      value={passwordChange.newPassword}
                      onChange={(e) => setPasswordChange({...passwordChange, newPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPasswordFields({...showPasswordFields, new: !showPasswordFields.new})}
                    >
                      {showPasswordFields.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Au moins 6 caractères</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordFields.confirm ? "text" : "password"}
                      value={passwordChange.confirmPassword}
                      onChange={(e) => setPasswordChange({...passwordChange, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPasswordFields({...showPasswordFields, confirm: !showPasswordFields.confirm})}
                    >
                      {showPasswordFields.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-2 font-medium rounded transition-colors ${
                      loading
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-yellow-400 text-black hover:bg-yellow-300'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Changement...
                      </div>
                    ) : (
                      'Changer le mot de passe'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closePasswordModal}
                    disabled={loading}
                    className="flex-1 py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
          </>
        )}

        {/* Contact Submissions Tab */}
        {activeTab === 'contact' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">Messages de Contact</h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">
                  Total: {contactSubmissions.length} messages
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full">
                    Non lus: {unreadCount}
                  </span>
                )}
              </div>
            </div>

            {contactSubmissions.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400 text-lg mb-2">Aucun message de contact</p>
                <p className="text-gray-500">Les messages du formulaire de contact apparaîtront ici</p>
              </div>
            ) : (
              <>
                {/* Desktop table view */}
                <div className="hidden lg:block bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Nom
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Sujet
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Message
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {contactSubmissions.map((submission) => (
                          <tr key={submission.id} className={`group transition-all duration-200 ${
                            submission.is_read 
                              ? 'bg-gray-800 hover:bg-gray-750' 
                              : 'bg-blue-900/20 hover:bg-blue-900/30 border-l-4 border-l-blue-400'
                          } hover:shadow-lg hover:shadow-gray-900/20`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors ${
                                  submission.is_read ? 'bg-gray-600' : 'bg-blue-500/20'
                                }`}>
                                  <Users className={`w-4 h-4 ${
                                    submission.is_read ? 'text-gray-400' : 'text-blue-400'
                                  }`} />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-white">
                                    {submission.name}
                                  </span>
                                  {!submission.is_read && (
                                    <span className="block text-xs text-blue-400 font-medium">
                                      Nouveau message
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-300">
                                {submission.email}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-300 max-w-xs truncate block">
                                {submission.subject || 'Sans sujet'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-300 max-w-md truncate block">
                                {submission.message}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                <div>
                                  <div className="text-white text-sm">
                                    {new Date(submission.created_at).toLocaleDateString('fr-FR')}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(submission.created_at).toLocaleTimeString('fr-FR', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                submission.is_read 
                                  ? 'bg-green-400/20 text-green-400' 
                                  : 'bg-yellow-400/20 text-yellow-400'
                              }`}>
                                {submission.is_read ? 'Lu' : 'Non lu'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {!submission.is_read && (
                                  <button
                                    onClick={() => handleMarkAsRead(submission.id, submission.name)}
                                    className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-200 text-xs font-medium"
                                    title="Marquer comme lu"
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Marquer lu
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteSubmission(submission.id, submission.name)}
                                  className="inline-flex items-center px-2 py-1 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 text-xs font-medium"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile card view */}
                <div className="lg:hidden space-y-4">
                  {contactSubmissions.map((submission) => (
                    <div key={submission.id} className={`p-4 rounded-xl border transition-all duration-200 ${
                      submission.is_read 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-blue-900/20 border-blue-400/30 border-l-4 border-l-blue-400'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors ${
                            submission.is_read ? 'bg-gray-600' : 'bg-blue-500/20'
                          }`}>
                            <Users className={`w-4 h-4 ${
                              submission.is_read ? 'text-gray-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">
                              {submission.name}
                            </h3>
                            <p className="text-xs text-gray-400 break-all">
                              {submission.email}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          submission.is_read 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-yellow-400/20 text-yellow-400'
                        }`}>
                          {submission.is_read ? 'Lu' : 'Non lu'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Sujet:</p>
                          <p className="text-sm text-gray-300">
                            {submission.subject || 'Sans sujet'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Message:</p>
                          <p className="text-sm text-gray-300 break-words">
                            {submission.message}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>
                            {new Date(submission.created_at).toLocaleDateString('fr-FR')} à {new Date(submission.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {!submission.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(submission.id, submission.name)}
                              className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-200 text-xs font-medium"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Lu
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSubmission(submission.id, submission.name)}
                            className="inline-flex items-center px-2 py-1 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 text-xs font-medium"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Suppr.
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Email Update Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Modifier l'adresse email
              </h3>
              <button
                onClick={closeEmailModal}
                disabled={loading}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEmailUpdate} className="space-y-4">
              {/* Current Email Display */}
              {currentAdmin?.email && (
                <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-400 mb-1">Email actuel :</p>
                  <div className="flex items-center">
                    <p className="text-white">{currentAdmin.email}</p>
                    {!currentAdmin.email_verified && (
                      <span className="ml-2 px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs">
                        Non vérifié
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* New Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nouvelle adresse email
                </label>
                <input
                  type="email"
                  value={emailUpdate}
                  onChange={(e) => setEmailUpdate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="nouvelle.email@exemple.com"
                  required
                  autoFocus
                />
              </div>

              <div className="text-sm text-gray-400">
                <p>⚠️ Après la modification :</p>
                <ul className="ml-4 mt-1 list-disc">
                  <li>L'email sera marqué comme non vérifié</li>
                  <li>Vous pourrez utiliser cette adresse pour récupérer votre mot de passe</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-2 font-medium rounded transition-colors ${
                    loading
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-yellow-400 text-black hover:bg-yellow-300'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Mise à jour...
                    </div>
                  ) : (
                    'Mettre à jour'
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeEmailModal}
                  disabled={loading}
                  className="flex-1 py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Custom Alert */}
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}
      
      {/* Confirmation Dialog */}
      {confirmDialog?.show && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={closeConfirm}
        />
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Récupération de mot de passe</h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </p>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Adresse Email
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-2 font-medium rounded transition-colors ${
                    loading
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-yellow-400 text-black hover:bg-yellow-300'
                  }`}
                >
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={loading}
                  className="flex-1 py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Admin Footer */}
      {isAuthenticated && (
        <footer className="mt-12 border-t border-gray-700 pt-6">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              <div className="mb-2 md:mb-0">
                <p>© 2025 Doc'Trot - Panneau d'administration</p>
              </div>
              <div className="flex items-center space-x-4">
                <span>Articles: <span className="text-yellow-400">{posts.length}</span></span>
                <span>•</span>
                <span>Dernière connexion: {new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Admin;