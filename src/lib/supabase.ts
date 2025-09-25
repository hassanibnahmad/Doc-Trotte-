import { createClient } from '@supabase/supabase-js'
import { emailService } from './emailService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Blog post interface
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  date: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

// Lightweight blog post interface for listing
export interface BlogPostSummary {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

// Blog service functions
export const blogService = {
  // Get all blog posts (ultra-lightweight - for admin list)
  async getAllPostsSummary(): Promise<BlogPostSummary[]> {
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, excerpt, author, date, category, created_at, updated_at')
      .order('date', { ascending: false })
      .limit(50); // Limit to recent 50 posts for better performance
    
    if (error) {

      return [];
    }
    
    return data || [];
  },

  // Get paginated blog posts (for public blog page)
  async getPaginatedPosts(page: number = 1, limit: number = 6): Promise<{ posts: BlogPost[], totalCount: number }> {
    const offset = (page - 1) * limit;
    
    // Get count first
    const { count, error: countError } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {

      return { posts: [], totalCount: 0 };
    }
    
    // Get paginated data
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {

      return { posts: [], totalCount: count || 0 };
    }
    
    return { posts: data || [], totalCount: count || 0 };
  },
  // Get all blog posts
  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {

      return [];
    }
    
    return data || [];
  },

  // Get a single blog post by ID
  async getPostById(id: number): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {

      return null;
    }
    
    return data;
  },

  // Create a new blog post
  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> {
    try {
      // Ensure all required fields are present and properly formatted
      const postData = {
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        image_url: post.image_url || '',
        author: post.author || "Doc'Trot Team",
        date: post.date || new Date().toISOString().split('T')[0],
        category: post.category || 'Général'
      };

      const { data, error } = await supabase
        .from('blogs')
        .insert([postData])
        .select()
        .single();
      
      if (error) {

        return null;
      }
      
      return data;
    } catch (err) {

      return null;
    }
  },

  // Update a blog post
  async updatePost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {

      return null;
    }
    
    return data;
  },

  // Delete a blog post
  async deletePost(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    
    if (error) {

      return false;
    }
    
    return true;
  },

  // Contact form submission functions
  async createContactSubmission(submission: Omit<ContactSubmission, 'id' | 'is_read' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          ...submission,
          is_read: false
        }]);
      
      return !error;
    } catch (error) {

      return false;
    }
  }
};

// Admin authentication interface
export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  email?: string;
  email_verified?: boolean;
  first_login?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Password reset token interface
export interface PasswordResetToken {
  id: number;
  admin_user_id: number;
  token: string;
  expires_at: string;
  used: boolean;
  created_at?: string;
}

// Contact form submission interface
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// Admin authentication service
export const adminService = {
  // Simple hash function for password (in production, use bcrypt)
  hashPassword(password: string): string {
    // Simple hash - in production use proper bcrypt
    return btoa(password + 'salt_doc_trot_2025');
  },

  // Verify password
  verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  },

  // Generate random token with timestamp
  generateResetToken(): string {
    const timestamp = Date.now();
    const randomPart1 = Math.random().toString(36).substring(2, 15);
    const randomPart2 = Math.random().toString(36).substring(2, 15);
    const token = btoa(`${randomPart1}_${timestamp}_${randomPart2}`);
    return token;
  },

  // Clean up expired tokens (optional maintenance)
  async cleanupExpiredTokens(): Promise<void> {
    try {
      const now = new Date().toISOString();
      await supabase
        .from('password_reset_tokens')
        .delete()
        .lt('expires_at', now);
    } catch (error) {
      // Silent cleanup - don't log errors
    }
  },

  // Get admin user
  async getAdmin(): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', 'admin')
      .single();
    
    if (error) {

      return null;
    }
    
    return data;
  },

  // Create initial admin user (if not exists)
  async initializeAdmin(): Promise<boolean> {
    const existingAdmin = await this.getAdmin();
    if (existingAdmin) {
      return true; // Admin already exists
    }

    // Create admin with default password "123123"
    const { error } = await supabase
      .from('admin_users')
      .insert({
        username: 'admin',
        password_hash: this.hashPassword('123123'),
        first_login: true,
        email_verified: false
      });

    if (error) {

      return false;
    }

    return true;
  },

  // Authenticate admin
  async authenticate(username: string, password: string): Promise<AdminUser | null> {
    if (username !== 'admin') {
      return null;
    }

    const admin = await this.getAdmin();
    
    if (!admin) {
      // Try to initialize admin if not exists
      await this.initializeAdmin();
      const newAdmin = await this.getAdmin();
      if (!newAdmin) return null;
      
      const passwordMatch = this.verifyPassword(password, newAdmin.password_hash);
      
      return passwordMatch ? newAdmin : null;
    }

    const passwordMatch = this.verifyPassword(password, admin.password_hash);

    return passwordMatch ? admin : null;
  },

  // Update admin email and first login status
  async updateAdminEmail(email: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          email, 
          first_login: false, 
          email_verified: false,
          updated_at: new Date().toISOString()
        })
        .eq('username', 'admin');

      return !error;
    } catch (error) {

      return false;
    }
  },

  // Change admin password
  async changePassword(currentPassword: string, newPassword: string): Promise<{success: boolean, message: string}> {
    const admin = await this.getAdmin();
    if (!admin) {
      return { success: false, message: 'Admin user not found' };
    }

    // Verify current password
    if (!this.verifyPassword(currentPassword, admin.password_hash)) {
      return { success: false, message: 'Current password incorrect' };
    }

    // Update password
    const { error } = await supabase
      .from('admin_users')
      .update({ 
        password_hash: this.hashPassword(newPassword),
        updated_at: new Date().toISOString()
      })
      .eq('username', 'admin');

    if (error) {

      return { success: false, message: 'Error updating password' };
    }

    return { success: true, message: 'Password updated successfully' };
  },

  // Create password reset token
  async createPasswordResetToken(email: string): Promise<string | null> {
    try {
      // Strategy: Get admin user by username (consistent with other functions)
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, email_verified')
        .eq('username', 'admin')
        .single();

      if (adminError || !adminData) {
        return null;
      }

      // Check if the email matches (case insensitive)
      if (adminData.email?.toLowerCase() !== email.toLowerCase()) {
        return null;
      }

      // IMPORTANT: Invalidate all existing unused tokens for this user
      // This ensures only the latest token is valid
      await supabase
        .from('password_reset_tokens')
        .update({ used: true })
        .eq('admin_user_id', adminData.id)
        .eq('used', false);

      // Clean up expired tokens while we're at it
      await this.cleanupExpiredTokens();

      // Generate NEW token and expiration (10 minutes)
      const token = this.generateResetToken();
      
      // Create timestamps in UTC to avoid timezone issues
      const nowUTC = new Date();
      const expiresUTC = new Date(nowUTC.getTime() + (10 * 60 * 1000)); // Add 10 minutes

      // Store the token
      const { error } = await supabase
        .from('password_reset_tokens')
        .insert({
          admin_user_id: adminData.id,
          token,
          expires_at: expiresUTC.toISOString()
        });

      if (error) {
        return null;
      }

      return token;
    } catch (error) {
      return null;
    }
  },

  // Verify and use password reset token (marks as used on first access)
  async verifyResetToken(token: string): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .from('password_reset_tokens')
        .select('admin_user_id, expires_at, used, created_at')
        .eq('token', token)
        .single();

      if (error || !data) {
        return null;
      }

      // Check if token is already used
      if (data.used) {
        return null;
      }

      // Check if token is expired (30 minutes) - FORCE UTC PARSING
      const nowUTC = new Date();
      const expiresUTC = new Date(data.expires_at + (data.expires_at.includes('Z') ? '' : 'Z'));
      const diffMs = expiresUTC.getTime() - nowUTC.getTime();

      if (diffMs < 0) {
        return null;
      }

      // DON'T mark as used yet - only mark as used when password is actually changed
      return data.admin_user_id;
    } catch (error) {
      return null;
    }
  },

  // Reset password with token and mark token as used
  async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
    try {
      // Get the token data (should be unused and valid)
      const { data: tokenData, error: tokenError } = await supabase
        .from('password_reset_tokens')
        .select('admin_user_id, used, expires_at')
        .eq('token', token)
        .single();

      if (tokenError || !tokenData) {
        return false;
      }

      // Check if token is already used
      if (tokenData.used) {
        return false;
      }

      // Check if token is expired using same logic as verification
      const nowUTC = new Date();
      const expiresUTC = new Date(tokenData.expires_at + (tokenData.expires_at.includes('Z') ? '' : 'Z'));
      const diffMs = expiresUTC.getTime() - nowUTC.getTime();

      if (diffMs < 0) {
        return false;
      }

      // Mark token as used FIRST (to prevent double-use)
      const { error: markUsedError } = await supabase
        .from('password_reset_tokens')
        .update({ used: true })
        .eq('token', token);

      if (markUsedError) {
        return false;
      }

      // Update password AND mark email as verified
      const passwordHash = this.hashPassword(newPassword);
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          password_hash: passwordHash,
          email_verified: true,  // ✅ Mark email as verified since they received and used the reset email
          updated_at: new Date().toISOString()
        })
        .eq('id', tokenData.admin_user_id);

      if (updateError) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  },

  // Send password reset email using EmailJS
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    try {
      // First, get the admin data to verify the email and get the correct email address
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, email_verified')
        .eq('username', 'admin')
        .single();

      if (adminError || !adminData) {
        return false;
      }

      // Check if the entered email matches the stored email (case insensitive)
      if (adminData.email?.toLowerCase() !== email.toLowerCase()) {
        return false;
      }

      // Create token using the verified email from database
      const token = await this.createPasswordResetToken(email);
      if (!token) {
        return false;
      }

      // Create the reset URL with our custom token (URL encode the token)
      const resetUrl = `${window.location.origin}/admin?reset_token=${encodeURIComponent(token)}`;
      
      // Send email via EmailJS - IMPORTANT: Use the email from the database, not the form
      try {
        const emailResult = await emailService.sendPasswordResetEmail(adminData.email, resetUrl);
        if (emailResult.success) {
          return true;
        } else {
          throw new Error(emailResult.message);
        }
      } catch (emailError) {
        // Fallback: Show alert with reset link (for development)
        const userMessage = `Lien de réinitialisation de mot de passe:

${resetUrl}

⚠️ L'envoi d'email a échoué. Utilisez ce lien directement.

🔥 IMPORTANT: Ce lien expire dans 10 minutes et ne peut être utilisé qu'une seule fois.`;

        alert(userMessage);
        return true;
      }
    } catch (error) {
      return false;
    }
  },

  // Contact submissions management
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {

        return [];
      }
      
      return data || [];
    } catch (error) {

      return [];
    }
  },

  async markSubmissionAsRead(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      return !error;
    } catch (error) {

      return false;
    }
  },

  async deleteContactSubmission(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);
      
      return !error;
    } catch (error) {

      return false;
    }
  },

  async getUnreadSubmissionsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (error) {

        return 0;
      }
      
      return count || 0;
    } catch (error) {

      return 0;
    }
  }
};
