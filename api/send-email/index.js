const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, subject, html } = req.body || {}
  const FROM = process.env.SES_FROM_EMAIL

  if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return res.status(500).json({ error: 'Missing AWS SES environment variables' })
  }

  if (!FROM) {
    return res.status(500).json({ error: 'Missing SES_FROM_EMAIL env var (verified sender)' })
  }

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing to/subject/html in body' })
  }

  try {
    const client = new SESClient({ region: process.env.AWS_REGION })
    const params = {
      Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } },
      },
      Source: FROM,
    }

    await client.send(new SendEmailCommand(params))
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('SES send error', err)
    return res.status(500).json({ error: err?.message || String(err) })
  }
}
