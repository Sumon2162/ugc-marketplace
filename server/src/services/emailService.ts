// src/services/emailService.ts
import sgMail from '@sendgrid/mail';
import User from '../models/User';

// Check if SendGrid API key is properly set
const isEmailServiceConfigured = () => {
  return process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.');
};

// If API key is properly set, configure SendGrid
if (isEmailServiceConfigured()) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
}

export const sendWelcomeEmail = async (email: string, firstName: string) => {
  // If email service is not configured, just log it
  if (!isEmailServiceConfigured()) {
    console.log(`[Mock Email] Welcome email would be sent to ${email}`);
    return;
  }

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || 'noreply@example.com',
    subject: 'Welcome to UGC Creator Hub! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5CF6;">Welcome to UGC Creator Hub, ${firstName}!</h1>
        <p>Your account has been created successfully and you're ready to start your journey!</p>
        
        <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0;">
          <h2>What's Next?</h2>
          <p>Complete your profile, upload your best content, and start connecting with amazing brands and creators!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
            Get Started Now
          </a>
        </div>
        
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The UGC Creator Hub Team</p>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};

export const sendVerificationEmail = async (email: string, userId: string) => {
  // If email service is not configured, just log it
  if (!isEmailServiceConfigured()) {
    console.log(`[Mock Email] Verification email would be sent to ${email}`);
    return;
  }

  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${userId}`;
  
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || 'noreply@example.com',
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Verify Your Email Address</h1>
        <p>Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link:</p>
        <p>${verificationUrl}</p>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
};

export const sendNewMessageEmail = async (recipientId: string, senderId: string, content: string) => {
  // If email service is not configured, just log it
  if (!isEmailServiceConfigured()) {
    console.log(`[Mock Email] New message notification would be sent to user ${recipientId}`);
    return;
  }

  try {
    const [recipient, sender] = await Promise.all([
      User.findById(recipientId),
      User.findById(senderId)
    ]);
    
    if (!recipient || !sender) return;
    
    const msg = {
      to: recipient.email,
      from: process.env.FROM_EMAIL || 'noreply@example.com',
      subject: `New message from ${sender.firstName} ${sender.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>You have a new message!</h1>
          <p><strong>${sender.firstName} ${sender.lastName}</strong> sent you a message:</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            "${content.substring(0, 200)}${content.length > 200 ? '...' : ''}"
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/messages" style="background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px;">
              Reply Now
            </a>
          </div>
        </div>
      `
    };
    
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send new message email:', error);
    }
  } catch (error) {
    console.error('Send new message email error:', error);
  }
};