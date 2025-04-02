/**
 * Guía para desplegar tu aplicación Next.js
 */

// 1. Despliegue en Vercel (la opción más sencilla para Next.js)
// - Crea una cuenta en Vercel (https://vercel.com)
// - Conecta tu repositorio de GitHub/GitLab/Bitbucket
// - Configura las variables de entorno (MONGODB_URI)
// - Vercel desplegará automáticamente tu aplicación

// 2. Despliegue en Netlify
// - Crea una cuenta en Netlify (https://netlify.com)
// - Conecta tu repositorio
// - Configura el comando de construcción: "npm run build"
// - Configura el directorio de publicación: ".next"
// - Configura las variables de entorno

// 3. Despliegue en un servidor propio
// - Construye tu aplicación: npm run build
// - Inicia el servidor: npm start
// - Usa PM2 para mantener la aplicación en ejecución: pm2 start npm -- start
// - Configura un proxy inverso con Nginx o Apache

// 4. Despliegue con Docker
// - Crea un Dockerfile para tu aplicación
// - Construye la imagen: docker build -t preop-evaluation .
// - Ejecuta el contenedor: docker run -p 3000:3000 -e MONGODB_URI=tu_uri preop-evaluation

// Importante: Para cualquier método de despliegue, asegúrate de:
// 1. Configurar correctamente las variables de entorno (MONGODB_URI)
// 2. Configurar MongoDB para aceptar conexiones desde tu servidor
// 3. Implementar medidas de seguridad (HTTPS, autenticación, etc.)

