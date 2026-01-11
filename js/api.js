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
    baseURL: 'https://x8ki-letl-twmt.n7.xano.io/api:Rws-aiYL',

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
            const response = await fetch(`${this.baseURL}/GET_/user/${userId}`, {
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
            const response = await fetch(`${this.baseURL}/POST_/user`, {
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
            const response = await fetch(`${this.baseURL}/create_session`, {
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
            const response = await fetch(`${this.baseURL}/GET_/sessions/${userName}`, {
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
            const response = await fetch(`${this.baseURL}/GET_/stats/${userName}`, {
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
    // Integración con Gemini AI
    // ========================================

    // API Key de Google Gemini
    geminiApiKey: 'AIzaSyDck7QArLJAArPD9XZYXC3m-unuf3uEYz8',

    /**
     * Generar micro-tarea personalizada usando Gemini AI
     */
    async generateMicroTask(originalTask, level, previousTasks = []) {
        const levelDescriptions = {
            0: 'Acción física mínima de 30 segundos: moverse, coger algo, abrir algo.',
            1: 'Observación rápida de 1 minuto: mirar, revisar, localizar.',
            2: 'Preparación ligera de 2 minutos: organizar, preparar herramientas.',
            3: 'Acción real breve de 3-5 minutos: hacer una pequeña parte.'
        };

        const prompt = `INSTRUCCIÓN CRÍTICA: Genera un micro-paso para ayudar a alguien a empezar esta tarea.

TAREA: "${originalTask}"

PASO 1 - ANALIZA LA TAREA:
- ¿Es sobre MOVER/TRANSPORTAR algo? → sugiere: buscar llaves, abrir maletero, acercar una caja
- ¿Es sobre LIMPIAR/ORDENAR? → sugiere: coger un trapo, tirar una cosa, mover un objeto
- ¿Es sobre EJERCICIO/DEPORTE? → sugiere: ponerse zapatillas, salir a la puerta, dar 10 pasos
- ¿Es sobre TRABAJO/ORDENADOR? → sugiere: abrir el programa, escribir una palabra
- ¿Es sobre COCINAR? → sugiere: sacar un ingrediente, encender el fuego
- ¿Es sobre LLAMAR/CONTACTAR? → sugiere: buscar el número, abrir la app de teléfono
- ¿Es sobre ESTUDIAR/LEER? → SOLO entonces sugiere algo con libros o apuntes

REGLA ABSOLUTA: Si la tarea NO menciona libros, estudiar, leer o aprender, NUNCA sugieras nada relacionado con libros, páginas, capítulos o apuntes.

NIVEL DE DIFICULTAD ${level}: ${levelDescriptions[level]}

${previousTasks.length > 0 ? `NO REPETIR estos pasos ya hechos: ${previousTasks.join(', ')}` : ''}

RESPONDE ÚNICAMENTE CON EL MICRO-PASO (máximo 10 palabras, imperativo, sin explicaciones):`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            maxOutputTokens: 50,
                            temperature: 0.3
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (generatedText) {
                // Limpiar el texto de posibles formatos
                return generatedText.trim().replace(/^["']|["']$/g, '');
            }

            throw new Error('No text generated');
        } catch (error) {
            console.error('Error generating micro-task with Gemini:', error);
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
