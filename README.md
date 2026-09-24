# TaskFlow | Proyecto M4

Aplicación SPA para gestionar tareas por usuario. Está construida con React, TypeScript y Vite, con autenticación y persistencia en Firebase, una función serverless para AWS SES y pruebas con Vitest.

## Demo y repositorio

- Repositorio: https://github.com/Joaquin-Orozco/ProyectoM4_Joaquin-Orozco
- Deploy: se genera automáticamente al conectar el repositorio con Vercel.

## Funcionalidades

- Registro, login y cierre de sesión con Firebase Authentication.
- Rutas protegidas para dashboard, tareas y perfil.
- Crear tareas con título, descripción y prioridad.
- Cambiar estado entre pendiente, en progreso y completada.
- Eliminar tareas.
- Filtros: todas, activas y completadas.
- Tareas aisladas por `userId` en Firestore.
- Envío de un resumen por email mediante `/api/send-email` y AWS SES.
- Modo demo local con `localStorage` cuando todavía no existen variables Firebase.

## Tecnologías

- React + TypeScript
- Vite
- React Router
- Firebase Authentication y Firestore
- AWS SES mediante Vercel Functions
- Vitest + Testing Library

## Instalación local

Requiere Node.js 18 o superior.

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

En macOS/Linux, usa `cp .env.example .env` en lugar de `Copy-Item`.

## Variables de entorno

Completa `.env` localmente. Nunca subas ese archivo a GitHub.

### Firebase, expuestas al cliente

Estas variables llevan prefijo `VITE_` porque son la configuración pública de la app web de Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

En Firebase habilita Authentication con Email/Password, crea Firestore y publica las reglas incluidas en `firestore.rules`.

### AWS SES, solo servidor

Estas variables no deben llevar `VITE_`:

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
SES_FROM_EMAIL=correo-remitente-verificado@example.com
```

En AWS SES debes verificar el remitente. Si tu cuenta está en sandbox, también debes verificar los destinatarios de prueba. Para producción, solicita salir del sandbox.

## Tests y build

```bash
npm test
npm run build
```

La prueba principal valida el acceso inicial. Las funciones de persistencia y aislamiento deben ampliarse con mocks de Firebase en futuras iteraciones.

## Deploy en Vercel

1. Importa `ProyectoM4_Joaquin-Orozco` desde GitHub.
2. Usa Vite como framework preset.
3. Añade las variables de `.env.example` en Project Settings → Environment Variables para Preview y Production.
4. Ejecuta un nuevo deploy.

`vercel.json` deja la SPA en `/index.html` y conserva `/api/*` para las funciones serverless.

## Endpoint de email

La aplicación envía un `POST` a `/api/send-email` con este formato:

```json
{
	"to": "destinatario@example.com",
	"subject": "Resumen de tareas",
	"html": "<p>Contenido del resumen</p>"
}
```

Las credenciales AWS nunca se incluyen en el bundle del navegador.

## Uso de IA

La IA se utilizó como asistente para revisar estructura, configuración, errores de compilación y documentación. El código debe revisarse y comprenderse antes de presentar la entrega; las decisiones finales sobre arquitectura, seguridad y despliegue corresponden al autor del proyecto.
