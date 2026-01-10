/**
 * Archivo de ejemplo de configuración
 *
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo a 'config.js'
 * 2. Actualiza los valores con tu información de Xano
 * 3. NO subas config.js a git (ya está en .gitignore)
 */

const CONFIG = {
    // URL base de tu API de Xano
    // Ejemplo: 'https://x8ki-letl-twmt.n7.xano.io/api:ABC123'
    XANO_API_URL: 'https://your-workspace-id.xano.io/api:your-api-group',

    // API Key (opcional, si configuraste autenticación en Xano)
    XANO_API_KEY: '',

    // Configuración de la aplicación
    APP_CONFIG: {
        // Nombre por defecto del usuario
        defaultUserName: 'Alex',

        // Tiempo de recuperación en segundos (por defecto 10 minutos)
        recoveryTimeSeconds: 600,

        // Mostrar logs de debug en consola
        debugMode: true,

        // Habilitar modo offline (guardar en localStorage si Xano falla)
        offlineMode: true,
    }
};

// Si usas módulos ES6
// export default CONFIG;
