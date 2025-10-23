import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVotingInvitation({
  email,
  name,
  eventId,
  memberId,
  eventTitle,
}: {
  email: string;
  name?: string;
  eventId: string;
  memberId: string;
  eventTitle: string;
}) {
  // Simple anonymous participation URL (no memberId needed)
  const participationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.teamsevent.ch'}/participate/${eventId}`;
  
  const displayName = name || email.split('@')[0];

  try {
    const result = await resend.emails.send({
      from: 'TeamEvent <noreply@teamsevent.ch>', // ✅ Verifizierte Domain
      to: email,
      subject: `🎉 Teilnahme für "${eventTitle}"`,
      html: getEmailTemplate(displayName, eventTitle, participationUrl),
    });

    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

function getEmailTemplate(name: string, eventTitle: string, participationUrl: string) {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teilnahme für ${eventTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                🎉 TeamEvent.ch
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 600;">
                Hallo ${name}! 👋
              </h2>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Du wurdest eingeladen, an dem Event <strong style="color: #111827;">"${eventTitle}"</strong> teilzunehmen.
              </p>

              <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Bitte bestätige deine Teilnahme und gib deine Ernährungspräferenzen an.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 8px; background-color: #dc2626;">
                    <a href="${participationUrl}" 
                       style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      🎉 Teilnahme bestätigen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Oder kopiere diesen Link in deinen Browser:<br>
                <a href="${participationUrl}" style="color: #dc2626; word-break: break-all;">${participationUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center; line-height: 1.5;">
                Diese Einladung wurde über <strong>TeamEvent.ch</strong> versendet<br>
                <a href="https://www.teamsevent.ch" style="color: #dc2626; text-decoration: none;">www.teamsevent.ch</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}