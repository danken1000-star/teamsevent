import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTeamInviteEmail({
  to,
  eventTitle,
  organizerEmail,
  votingUrl,
}: {
  to: string
  eventTitle: string
  organizerEmail: string
  votingUrl: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TeamsEvent <onboarding@resend.dev>', // Später mit eigener Domain ersetzen
      to: [to],
      subject: `Einladung: ${eventTitle} - Bitte abstimmen`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .button { display: inline-block; background: #DC2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">🎉 TeamsEvent.ch</h1>
              </div>
              <div class="content">
                <h2 style="color: #1f2937; margin-top: 0;">Sie wurden zu einem Team-Event eingeladen!</h2>
                
                <p>Hallo!</p>
                
                <p><strong>${organizerEmail}</strong> hat Sie zum Event <strong>"${eventTitle}"</strong> eingeladen.</p>
                
                <p>Bitte klicken Sie auf den Button unten um Ihr bevorzugtes Datum für das Event auszuwählen:</p>
                
                <div style="text-align: center;">
                  <a href="${votingUrl}" class="button">
                    📅 Jetzt abstimmen
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  Oder kopieren Sie diesen Link in Ihren Browser:<br>
                  <a href="${votingUrl}" style="color: #DC2626;">${votingUrl}</a>
                </p>
              </div>
              <div class="footer">
                <p>Diese Email wurde von TeamsEvent.ch gesendet.</p>
                <p>© 2025 TeamsEvent.ch - Die erste Schweizer Event-Planungs-Software</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email exception:', error)
    return { success: false, error }
  }
}