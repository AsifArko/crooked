# Contact Form Setup Guide

## SMTP Configuration

The contact form requires SMTP configuration to send emails. You'll need to set up the following environment variables in your `.env.local` file:

```bash
# SMTP Server Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Contact Email (where you want to receive contact form submissions)
CONTACT_EMAIL=contact@asifarko.com
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Alternative SMTP Providers

You can use other SMTP providers by changing the `SMTP_HOST` and `SMTP_PORT`:

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server
```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `/contact`
3. Fill out the contact form
4. Check your email for the submission

## Troubleshooting

- **Authentication failed**: Check your SMTP credentials
- **Connection timeout**: Verify SMTP host and port
- **Email not received**: Check spam folder and SMTP settings
