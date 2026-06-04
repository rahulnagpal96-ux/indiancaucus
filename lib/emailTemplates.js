const BASE = 'https://indiancaucus.org'
const FACEBOOK = 'https://www.facebook.com/IndianCaucusSEC'
const INSTAGRAM = 'https://www.instagram.com/indiancaucussec'

function footer() {
  return `
    <tr>
      <td style="background:#111d35;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
        <img src="${BASE}/logo.png" alt="Indian Caucus of Secaucus" height="36" style="height:36px;width:auto;display:block;margin:0 auto 16px;">
        <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 14px;">
          <tr>
            <td style="padding:0 10px;"><a href="${FACEBOOK}" style="color:#93c5fd;font-size:13px;font-weight:600;text-decoration:none;">Facebook</a></td>
            <td style="color:#334155;">&bull;</td>
            <td style="padding:0 10px;"><a href="${INSTAGRAM}" style="color:#93c5fd;font-size:13px;font-weight:600;text-decoration:none;">Instagram</a></td>
            <td style="color:#334155;">&bull;</td>
            <td style="padding:0 10px;"><a href="${BASE}" style="color:#93c5fd;font-size:13px;font-weight:600;text-decoration:none;">Website</a></td>
          </tr>
        </table>
        <p style="margin:0 0 6px;color:#475569;font-size:12px;">Indian Caucus of Secaucus &bull; Secaucus, NJ &bull; 501(c)(3) Nonprofit</p>
        <p style="margin:0;color:#334155;font-size:11px;">You are receiving this as a subscriber. <a href="${BASE}/unsubscribe?e={{email}}" style="color:#475569;text-decoration:underline;">Unsubscribe</a></p>
      </td>
    </tr>`
}

function header() {
  return `
    <tr>
      <td style="background:#1a2744;border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
        <img src="${BASE}/logo.png" alt="Indian Caucus of Secaucus" height="48" style="height:48px;width:auto;display:block;margin:0 auto;">
      </td>
    </tr>`
}

function wrap(rows) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#f1f3f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f3f8;">
<tr><td align="center" style="padding:32px 16px 48px;">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    ${rows}
  </table>
</td></tr>
</table>
</body></html>`
}

export function buildEventEmail({ imageUrl, title, date, location, description, ctaText, ctaUrl }) {
  return wrap(`
    ${header()}
    ${imageUrl ? `
    <tr>
      <td style="background:#ffffff;padding:0;">
        <img src="${imageUrl}" alt="${title}" style="width:100%;max-width:600px;height:auto;display:block;">
      </td>
    </tr>` : ''}
    <tr>
      <td style="background:#ffffff;padding:36px 40px 28px;">
        <h1 style="margin:0 0 16px;color:#1a2744;font-size:28px;font-weight:800;line-height:1.2;">${title}</h1>
        ${date ? `<p style="margin:0 0 8px;color:#e85d04;font-size:15px;font-weight:700;">${date}</p>` : ''}
        ${location ? `<p style="margin:0 0 20px;color:#6b7280;font-size:14px;">${location}</p>` : ''}
        <p style="margin:0 0 28px;color:#374151;font-size:15px;line-height:1.7;">${(description || '').replace(/\n/g, '<br>')}</p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#e85d04;border-radius:10px;">
              <a href="${ctaUrl || BASE + '/events'}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">${ctaText || 'Learn More'}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
        <p style="margin:0 0 12px;color:#4b5563;font-size:14px;">Help make this event possible</p>
        <a href="${BASE}/donate" style="color:#1a2744;font-size:14px;font-weight:700;text-decoration:none;">Donate &rarr;</a>
      </td>
    </tr>
    ${footer()}
  `)
}

export function buildNewsletterEmail({ imageUrl, headline, body, ctaText, ctaUrl }) {
  return wrap(`
    ${header()}
    ${imageUrl ? `
    <tr>
      <td style="background:#ffffff;padding:0;">
        <img src="${imageUrl}" alt="${headline}" style="width:100%;max-width:600px;height:auto;display:block;">
      </td>
    </tr>` : ''}
    <tr>
      <td style="background:#ffffff;padding:36px 40px;">
        <h1 style="margin:0 0 20px;color:#1a2744;font-size:26px;font-weight:800;line-height:1.2;">${headline}</h1>
        <div style="color:#374151;font-size:15px;line-height:1.8;">${(body || '').replace(/\n/g, '<br>')}</div>
        ${ctaText && ctaUrl ? `
        <table cellpadding="0" cellspacing="0" style="margin-top:28px;">
          <tr>
            <td style="background:#1a2744;border-radius:10px;">
              <a href="${ctaUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">${ctaText}</a>
            </td>
          </tr>
        </table>` : ''}
      </td>
    </tr>
    ${footer()}
  `)
}

export function buildDonationEmail({ imageUrl, headline, body, ctaText, goalAmount, raised }) {
  return wrap(`
    ${header()}
    ${imageUrl ? `
    <tr>
      <td style="background:#ffffff;padding:0;">
        <img src="${imageUrl}" alt="${headline}" style="width:100%;max-width:600px;height:auto;display:block;">
      </td>
    </tr>` : ''}
    <tr>
      <td style="background:#ffffff;padding:36px 40px 28px;">
        <h1 style="margin:0 0 16px;color:#1a2744;font-size:26px;font-weight:800;line-height:1.2;">${headline}</h1>
        <div style="color:#374151;font-size:15px;line-height:1.8;margin-bottom:28px;">${(body || '').replace(/\n/g, '<br>')}</div>
        <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr>
            <td style="background:#e85d04;border-radius:10px;">
              <a href="${BASE}/donate" style="display:inline-block;padding:16px 40px;color:#ffffff;font-size:16px;font-weight:800;text-decoration:none;">${ctaText || 'Donate Now'}</a>
            </td>
          </tr>
        </table>
        <p style="margin:0;color:#9ca3af;font-size:13px;">Every dollar directly funds our community events. Tax-deductible 501(c)(3).</p>
      </td>
    </tr>
    <tr>
      <td style="background:#1a2744;padding:24px 40px;text-align:center;">
        <a href="${BASE}/sponsor" style="color:#f97316;font-size:14px;font-weight:600;text-decoration:none;">Interested in sponsoring an event? View packages &rarr;</a>
      </td>
    </tr>
    ${footer()}
  `)
}
