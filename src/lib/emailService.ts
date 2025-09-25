// EmailJS configuration for password reset emails
import emailjs from '@emailjs/browser';

// EmailJS configuration from environment variables
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

// Initialize EmailJS with the public key from environment
if (EMAILJS_CONFIG.publicKey) {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

export const emailService = {
  // Send password reset email using EmailJS
  async sendPasswordResetEmail(
    userEmail: string, 
    resetUrl: string, 
    adminName: string = 'Admin'
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Template parameters that will be used in your EmailJS template
      const templateParams = {
        to_email: userEmail,      // Make sure your EmailJS template uses {{to_email}}
        user_email: userEmail,    // Alternative variable name
        email: userEmail,         // Another common variable name
        to_name: adminName,
        reset_url: resetUrl,
        expires_in: '10 minutes',
        from_name: "Doc'Trot Admin",
        subject: 'Réinitialisation de votre mot de passe - Doc\'Trot',
        message: `Vous avez demandé une réinitialisation de mot de passe pour votre compte administrateur Doc'Trot. 

Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :
${resetUrl}

⚠️ Important :
- Ce lien expire dans 10 minutes
- Ce lien ne peut être utilisé qu'une seule fois (il expire dès que vous le visitez)
- Si vous n'avez pas demandé cette réinitialisation, ignorez cet email

Pour votre sécurité, ne partagez jamais ce lien avec personne.`,
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );
      
      if (response.status === 200) {
        return {
          success: true,
          message: 'Email envoyé avec succès via EmailJS'
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de l\'envoi de l\'email'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur EmailJS: ' + (error as Error).message
      };
    }
  }
};