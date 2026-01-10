/**
 * API Module - Integración con Xano Backend
 * Maneja todas las llamadas a la API de Xano para persistir datos
 */

const API = {
    // ========================================
    // Configuración de la API
    // ========================================

    // IMPORTANTE: Reemplaza esta URL con tu URL de Xano
    // Se obtendrá después de configurar el backend en xano.com
    baseURL: 'https://your-workspace-id.xano.io/api:your-api-group',

    // Clave de API (opcional, dependiendo de tu configuración de Xano)
    apiKey: '',

    // ========================================
    // Métodos de Usuario
    // ========================================

    /**
     * Obtener datos del usuario
     * Endpoint: GET /user/:user_id
     */
    async getUserData(userId = 1) {
        try {
            const response = await fetch(`${this.baseURL}/user/${userId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    },

    /**
     * Crear o actualizar usuario
     * Endpoint: POST /user
     */
    async saveUser(userData) {
        try {
            const response = await fetch(`${this.baseURL}/user`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    },

    // ========================================
    // Métodos de Sesión
    // ========================================

    /**
     * Guardar sesión completa
     * Endpoint: POST /session
     */
    async saveSession(sessionData) {
        try {
            const response = await fetch(`${this.baseURL}/session`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(sessionData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Session saved:', data);
            return data;
        } catch (error) {
            console.error('Error saving session:', error);
            throw error;
        }
    },

    /**
     * Obtener historial de sesiones
     * Endpoint: GET /sessions/:user_name
     */
    async getSessions(userName) {
        try {
            const response = await fetch(`${this.baseURL}/sessions/${userName}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching sessions:', error);
            throw error;
        }
    },

    /**
     * Obtener estadísticas del usuario
     * Endpoint: GET /stats/:user_name
     */
    async getUserStats(userName) {
        try {
            const response = await fetch(`${this.baseURL}/stats/${userName}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    },

    // ========================================
    // Métodos de Tarea
    // ========================================

    /**
     * Registrar evento de tarea
     * Endpoint: POST /task-event
     */
    async logTaskEvent(eventData) {
        try {
            const response = await fetch(`${this.baseURL}/task-event`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error logging task event:', error);
            throw error;
        }
    },

    // ========================================
    // Utilidades
    // ========================================

    /**
     * Obtener headers para las peticiones
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        // Agregar API key si existe
        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        return headers;
    },

    /**
     * Modo offline - guardar en localStorage si la API falla
     */
    saveOffline(key, data) {
        try {
            const offlineData = JSON.parse(localStorage.getItem('inicia_offline') || '{}');
            offlineData[key] = offlineData[key] || [];
            offlineData[key].push({
                data,
                timestamp: new Date().toISOString(),
            });
            localStorage.setItem('inicia_offline', JSON.stringify(offlineData));
            console.log('Data saved offline');
        } catch (error) {
            console.error('Error saving offline data:', error);
        }
    },

    /**
     * Sincronizar datos offline
     */
    async syncOfflineData() {
        try {
            const offlineData = JSON.parse(localStorage.getItem('inicia_offline') || '{}');

            if (Object.keys(offlineData).length === 0) {
                console.log('No offline data to sync');
                return;
            }

            // Sincronizar sesiones
            if (offlineData.sessions) {
                for (const item of offlineData.sessions) {
                    await this.saveSession(item.data);
                }
            }

            // Limpiar datos offline después de sincronizar
            localStorage.removeItem('inicia_offline');
            console.log('Offline data synced successfully');
        } catch (error) {
            console.error('Error syncing offline data:', error);
        }
    }
};

// Intentar sincronizar datos offline cuando la app se carga
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        API.syncOfflineData();
    });
}

// Exportar para uso en otros módulos (si se usan módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
