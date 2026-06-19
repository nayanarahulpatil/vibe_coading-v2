export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  // No SMTP configured in v3 MVP — link is logged here and returned in dev API response
  console.log('');
  console.log('========== PASSWORD RESET (dev) ==========');
  console.log(`Email: ${email}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log('==========================================');
  console.log('');
};
