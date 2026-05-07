import { Resend } from 'resend';
import { config } from '../config/index.js';

const resend = new Resend(config.resendKey);

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `http://${config.appUrl}/reset-password/${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password — FireSpear',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset your password</title>
      </head>
      <body style="margin:0;padding:0;background:#f4f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e0;">

                <!-- Header -->
                <tr>
                  <td style="background:#1a1a1a;padding:32px 40px 28px;text-align:center;">
                    <span style="color:#ffffff;font-size:20px;font-weight:500;letter-spacing:0.05em;">
                      &#9733; FireSpear
                    </span>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:32px 40px;">
                    <p style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">Password Reset</p>
                    <h1 style="font-size:22px;font-weight:500;color:#111;margin:0 0 16px;">Forgot your password?</h1>
                    <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 24px;">
                      We received a request to reset the password for your FireSpear account.
                      Click the button below to choose a new one.
                    </p>

                    <!-- CTA -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}"
                            style="display:inline-block;background:#E05C2A;color:#ffffff;text-decoration:none;font-size:15px;font-weight:500;padding:14px 32px;border-radius:8px;letter-spacing:0.02em;">
                            Reset my password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Expiry notice -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;border-radius:8px;margin:0 0 24px;">
                      <tr>
                        <td style="padding:14px 16px;font-size:13px;color:#666;line-height:1.6;">
                          &#9201; This link expires in <strong style="color:#111;font-weight:500;">1 hour</strong>.
                          If it expires, you can request a new one from the login page.
                        </td>
                      </tr>
                    </table>

                    <!-- Fallback URL -->
                    <p style="border-top:1px solid #e5e5e0;padding-top:20px;font-size:13px;color:#888;margin:0 0 10px;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="background:#f4f4f0;border-radius:8px;padding:10px 14px;margin:0;word-break:break-all;font-family:monospace;font-size:12px;color:#2563EB;">
                      ${resetUrl}
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9f9f7;border-top:1px solid #e5e5e0;padding:20px 40px;text-align:center;">
                    <p style="font-size:12px;color:#999;margin:0;line-height:1.6;">
                      If you didn't request a password reset, you can safely ignore this email — your account remains secure.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
};