# Proyecto M4 — TaskFlow

Instalación y despliegue mínimo.

Setup local:

1. Copia `.env.example` a `.env` y rellena las variables.

2. Instala dependencias y arranca:

```bash
npm install
npm run dev
```

3. Tests:

```bash
npm test
```

Deploy en Vercel:

- Crea un proyecto en Vercel y conecta tu repo.
- En Settings → Environment Variables añade los valores de `.env` (usando los mismos nombres).
- Asegúrate de añadir `SES_FROM_EMAIL` con un remitente verificado en AWS SES.

Endpoint de envío de emails (serverless): `POST /api/send-email` con JSON `{ to, subject, html }`.
