# Doc'Trot - Blog Admin Platform

A modern, responsive blog and admin platform built with React, TypeScript, and Supabase for managing content and customer communications.

## Features

- **Blog Management**: Create, edit, and delete blog posts with rich content and image support
- **Admin Authentication**: Secure login system with password management and recovery
- **Contact Form Management**: Handle customer inquiries with read/unread status tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Email Integration**: Password reset emails via EmailJS
- **Image Handling**: Base64 image storage and display

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication)
- **Email**: EmailJS for password reset functionality
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install

```bash
git clone [repository-url]
cd Doc-Trotte-
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Supabase Configuration (get from your Supabase project)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS Configuration (get from EmailJS dashboard)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Create the required database tables:
   - **admin_users** - For admin authentication
   - **blogs** - For blog posts storage
   - **contact_submissions** - For contact form submissions
   - **password_reset_tokens** - For password recovery

**Admin Users Table:**
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  password_hash TEXT NOT NULL,
  email TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  first_login BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Blogs Table:**
```sql
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT DEFAULT 'Doc''Trot Team',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  date TEXT,
  category TEXT DEFAULT 'Mobilité'
);
```

**Contact Submissions Table:**
```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Password Reset Tokens Table:**
```sql
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES admin_users(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. EmailJS Setup

1. Create account at [EmailJS](https://www.emailjs.com/)
2. Create a new email service
3. Create a password reset email template
4. Get your service ID, template ID, and public key
5. Add them to your `.env` file

### 5. Development

```bash
npm run dev
```

### 6. Production Build

```bash
npm run build
npm run preview
```

## Admin Access

- Default password: `123123`
- **Important**: Change the default password immediately after first login
- Set up admin email for password recovery functionality

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── lib/                # Utilities and services
├── assets/             # Static assets
```

## Security Notes

- All sensitive configuration is moved to environment variables
- Console logs removed from production build  
- Database queries use RLS (Row Level Security)
- Password recovery tokens expire after 10 minutes and are single-use
- **Development files with credentials completely removed**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure no sensitive data is committed
5. Submit a pull request

## License

This project is licensed under the MIT License.
```
