const WELCOME_EMAIL_RESUME_DATE = '2026-06-05'

export function shouldSendWelcomeEmail(now = new Date()) {
  const todayInNewYork = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
  }).format(now)

  return todayInNewYork >= WELCOME_EMAIL_RESUME_DATE
}

export function buildWelcomeEmail(firstName, email = '') {
  const name = firstName || 'Friend'
  const baseUrl = 'https://indiancaucus.org'
  const unsubscribeUrl = `${baseUrl}/unsubscribe?e=${encodeURIComponent(email)}`
  const facebook = 'https://www.facebook.com/IndianCaucusSEC'
  const instagram = 'https://www.instagram.com/indiancaucussec'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Welcome to Indian Caucus of Secaucus</title>
</head>
<body style="margin:0;padding:0;background:#f1f3f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f1f3f8;">
<tr><td align="center" style="padding:32px 16px 48px;">

  <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

    <!-- ── HEADER ── -->
    <tr>
      <td style="background:#1a2744;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
        <img src="${baseUrl}/logo.png" alt="Indian Caucus of Secaucus" height="52" style="height:52px;width:auto;display:block;margin:0 auto 16px;">
        <p style="margin:0;color:#93c5fd;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Community &nbsp;·&nbsp; Culture &nbsp;·&nbsp; Civic Engagement</p>
      </td>
    </tr>

    <!-- ── WELCOME ── -->
    <tr>
      <td style="background:#ffffff;padding:40px 40px 32px;">
        <h1 style="margin:0 0 16px;color:#1a2744;font-size:26px;font-weight:800;line-height:1.2;text-align:center;">Welcome, ${name}.</h1>
        <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
          Thank you for joining the Indian Caucus of Secaucus. We are a 501(c)(3) nonprofit dedicated to celebrating Indian culture and bringing our Secaucus community together through memorable annual events. You will be among the first to hear about upcoming celebrations, volunteer opportunities, and community news.
        </p>
      </td>
    </tr>

    <!-- ── DIVIDER ── -->
    <tr>
      <td style="background:#ffffff;padding:0 40px;">
        <div style="height:1px;background:#e5e7eb;"></div>
      </td>
    </tr>

    <!-- ── EVENTS ── -->
    <tr>
      <td style="background:#ffffff;padding:32px 40px;">
        <h2 style="margin:0 0 24px;color:#1a2744;font-size:18px;font-weight:700;letter-spacing:-0.3px;">Our Annual Events</h2>

        <!-- Diwali -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
          <tr>
            <td style="width:4px;background:#f59e0b;border-radius:4px;">&nbsp;</td>
            <td style="padding-left:16px;">
              <p style="margin:0 0 2px;color:#1a2744;font-size:15px;font-weight:700;">Diwali Mela &mdash; Every October</p>
              <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">Buchmuller Park, Secaucus NJ</p>
              <p style="margin:0 0 8px;color:#4b5563;font-size:14px;line-height:1.6;">Live performances, cultural exhibits, rangoli competition, and a vibrant community marketplace.</p>
              <span style="display:inline-block;background:#f0fdf4;color:#16a34a;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;">Free Admission</span>
            </td>
          </tr>
        </table>

        <!-- Dandiya -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
          <tr>
            <td style="width:4px;background:#9333ea;border-radius:4px;">&nbsp;</td>
            <td style="padding-left:16px;">
              <p style="margin:0 0 2px;color:#1a2744;font-size:15px;font-weight:700;">Dandiya Dhamaka &mdash; Every Fall</p>
              <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">Secaucus, NJ</p>
              <p style="margin:0 0 8px;color:#4b5563;font-size:14px;line-height:1.6;">An electrifying night of traditional Gujarati folk dance during Navratri. Come dressed in traditional attire and dance the night away.</p>
              <span style="display:inline-block;background:#faf5ff;color:#9333ea;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;">Ticketed Event</span>
            </td>
          </tr>
        </table>

        <!-- Holi -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:8px;">
          <tr>
            <td style="width:4px;background:#f97316;border-radius:4px;">&nbsp;</td>
            <td style="padding-left:16px;">
              <p style="margin:0 0 2px;color:#1a2744;font-size:15px;font-weight:700;">Holi &mdash; Festival of Colors &mdash; Every Spring</p>
              <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">Secaucus, NJ</p>
              <p style="margin:0 0 8px;color:#4b5563;font-size:14px;line-height:1.6;">Color play, live music, traditional food, and family-friendly fun celebrating the arrival of spring.</p>
              <span style="display:inline-block;background:#f0fdf4;color:#16a34a;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;">Free Admission</span>
            </td>
          </tr>
        </table>

        <p style="margin:20px 0 0;color:#9ca3af;font-size:13px;font-style:italic;">Follow us on social media for exact date announcements each season.</p>
      </td>
    </tr>

    <!-- ── DONATION CTA ── -->
    <tr>
      <td style="background:#1a2744;padding:36px 40px;">
        <h2 style="margin:0 0 12px;color:#ffffff;font-size:20px;font-weight:800;">Support Our Community</h2>
        <p style="margin:0 0 24px;color:#93c5fd;font-size:14px;line-height:1.7;">
          Our events are free for the community because of generous donors like you. Your contribution directly funds stages, permits, performances, and everything that makes these celebrations possible.
        </p>
        <!-- Donate button -->
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;">
          <tr>
            <td style="background:#e85d04;border-radius:10px;">
              <a href="${baseUrl}/donate" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.2px;">
                Donate Now
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 20px;color:#64748b;font-size:13px;line-height:1.6;">Every amount makes a difference. Consider a recurring monthly gift to help us plan bigger celebrations year after year.</p>
        <!-- Divider -->
        <div style="height:1px;background:rgba(255,255,255,0.1);margin-bottom:20px;"></div>
        <!-- Sponsor row -->
        <p style="margin:0 0 8px;color:#e2e8f0;font-size:14px;font-weight:600;">Interested in sponsoring?</p>
        <p style="margin:0 0 16px;color:#93c5fd;font-size:13px;line-height:1.6;">Get your business in front of thousands of attendees across all three events with logo placement, digital promotion, and on-site visibility.</p>
        <a href="${baseUrl}/sponsor" style="color:#f97316;font-size:14px;font-weight:600;text-decoration:none;">View Sponsorship Packages &rarr;</a>
      </td>
    </tr>

    <!-- ── CONTACT ── -->
    <tr>
      <td style="background:#f9fafb;padding:28px 40px;text-align:center;">
        <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">Questions or want to get involved?</p>
        <a href="mailto:info@indiancaucus.org" style="color:#1a2744;font-size:14px;font-weight:600;text-decoration:none;">info@indiancaucus.org</a>
      </td>
    </tr>

    <!-- ── FOOTER ── -->
    <tr>
      <td style="background:#111d35;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
        <!-- Social links -->
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 16px;">
          <tr>
            <td style="padding:0 10px;">
              <a href="${facebook}" style="color:#93c5fd;font-size:13px;font-weight:600;text-decoration:none;">Facebook</a>
            </td>
            <td style="color:#334155;font-size:13px;">&bull;</td>
            <td style="padding:0 10px;">
              <a href="${instagram}" style="color:#93c5fd;font-size:13px;font-weight:600;text-decoration:none;">Instagram</a>
            </td>
            <td style="color:#334155;font-size:13px;">&bull;</td>
            <td style="padding:0 10px;">
              <a href="${baseUrl}" style="color:#93c5fd;font-size:13px;font-weight:600;text-decoration:none;">Website</a>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 6px;color:#475569;font-size:12px;line-height:1.7;">Indian Caucus of Secaucus<br>Secaucus, NJ<br>501(c)(3) Nonprofit</p>
        <p style="margin:0;color:#334155;font-size:11px;">You are receiving this because you subscribed at indiancaucus.org. &nbsp;<a href="${unsubscribeUrl}" style="color:#475569;text-decoration:underline;">Unsubscribe</a></p>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`

  return html
}
