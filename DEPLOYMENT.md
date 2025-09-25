# Production Deployment Guide

## Pre-deployment Checklist ✅

This project has been cleaned and prepared for safe GitHub deployment:

### Security Measures Implemented

- ✅ **Environment Variables**: All sensitive data moved to `.env` files
- ✅ **GitIgnore Updated**: `.env`, debug files, and temp files excluded from Git
- ✅ **Console Logs Removed**: All development logging cleaned from production code  
- ✅ **Debug Files Moved**: Test and debug scripts moved to `dev-tools/` directory
- ✅ **Documentation Updated**: Sensitive info removed from markdown files
- ✅ **Environment Template**: `.env.example` created with placeholder values

### Files Secured

- `src/lib/emailService.ts` - Now uses environment variables
- `src/lib/supabase.ts` - Console logs removed, secure error handling
- `src/pages/Admin.tsx` - All debug logging removed
- `src/pages/Contact.tsx` - Console errors removed
- `src/pages/Blog.tsx` - Debug output cleaned
- `src/pages/BlogPost.tsx` - Error logging removed

### Development Files Removed

**Completely removed for security:**
- `dev-tools/` directory - Contained actual Supabase credentials
- `database/` directory - Development SQL scripts and docs
- Development documentation files with setup details

## Deployment Steps

### 1. Final Check
```bash
# Verify no sensitive data in tracked files
git status
git diff

# Ensure .env is not tracked
cat .gitignore | grep ".env"
```

### 2. Build for Production
```bash
npm run build
npm run preview # Test production build locally
```

### 3. Environment Setup on Hosting Platform

Set these environment variables on your hosting platform (Vercel, Netlify, etc.):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 4. Database Setup

Use the SQL schema provided in the README.md to create the required tables:
- admin_users
- blogs  
- contact_submissions
- password_reset_tokens

### 5. Admin Setup

1. Access admin panel at `/admin`
2. Login with default password: `123123`
3. **IMMEDIATELY** change default password
4. Set up admin email for password recovery

## Post-Deployment Security

- [ ] Change default admin password
- [ ] Test password recovery functionality
- [ ] Verify contact form submissions work
- [ ] Test admin authentication flow
- [ ] Confirm no sensitive data appears in browser dev tools
- [ ] Check that environment variables are properly loaded

## Development vs Production

**Development** (with dev-tools):
```bash
npm run dev
# Access debug tools in dev-tools/ directory if needed
```

**Production** (clean):
- No console output
- No debug files in build
- All sensitive data via environment variables
- Optimized bundle with no development dependencies

## Support

For any issues during deployment:
1. Check environment variables are set correctly
2. Verify Supabase connection and RLS policies
3. Confirm EmailJS configuration
4. Test admin authentication flow

The codebase is now ready for safe open-source deployment! 🚀