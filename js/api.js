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
        // Detectar categoría de la tarea para dar ejemplos específicos
        const taskLower = originalTask.toLowerCase();
        let category = 'general';
        let goodExamples = '';
        let badExamples = '';

        if (taskLower.match(/ordenar|limpiar|habitaci|cuarto|casa|ropa|armario|basura/)) {
            category = 'limpieza';
            goodExamples = 'Coge una prenda del suelo | Tira un papel a la basura | Pon un objeto en su sitio | Haz la cama | Abre el armario';
            badExamples = 'abrir libro, abrir página, leer capítulo, abrir aplicación';
        } else if (taskLower.match(/transport|mudan|llevar|mover|carga|kg|km|coche|furgoneta|caja/)) {
            category = 'transporte';
            goodExamples = 'Busca las llaves del coche | Abre el maletero | Acerca una caja a la puerta | Mira cuántas cajas hay | Coge una bolsa';
            badExamples = 'abrir libro, abrir página, leer, estudiar, aplicación';
        } else if (taskLower.match(/ejercicio|correr|gym|deporte|entren|caminar|bici/)) {
            category = 'ejercicio';
            goodExamples = 'Ponte las zapatillas | Llena la botella de agua | Sal a la puerta | Estira los brazos | Da 10 pasos';
            badExamples = 'abrir libro, abrir página, leer, estudiar';
        } else if (taskLower.match(/email|correo|trabajo|informe|proyecto|oficina|ordenador|documento/)) {
            category = 'trabajo';
            goodExamples = 'Enciende el ordenador | Abre el navegador | Lee el asunto del primer email | Escribe una palabra | Abre el documento';
            badExamples = 'abrir libro de texto, leer capítulo, estudiar';
        } else if (taskLower.match(/estudiar|libro|examen|apuntes|leer|universidad|deberes|tarea escolar/)) {
            category = 'estudio';
            goodExamples = 'Abre el libro | Lee solo el título | Saca los apuntes | Subraya una frase | Lee una línea';
            badExamples = '';
        } else if (taskLower.match(/cocinar|comida|cena|cocina|receta|ingrediente/)) {
            category = 'cocina';
            goodExamples = 'Saca una olla | Abre la nevera | Pon agua a hervir | Saca un ingrediente | Enciende el fuego';
            badExamples = 'abrir libro, abrir página, leer, estudiar';
        } else if (taskLower.match(/llamar|tel[eé]fono|contactar|cita|mensaje|whatsapp/)) {
            category = 'comunicación';
            goodExamples = 'Coge el teléfono | Busca el contacto | Abre WhatsApp | Escribe "hola" | Mira la hora';
            badExamples = 'abrir libro, abrir página, leer capítulo';
        } else {
            goodExamples = 'Levántate | Busca lo que necesitas | Prepara el espacio | Ve al lugar | Coge lo primero';
            badExamples = 'abrir libro, abrir página, leer capítulo, abrir aplicación';
        }

        const prompt = `TAREA: "${originalTask}"
CATEGORÍA DETECTADA: ${category}

BUENOS EJEMPLOS de micro-pasos para ${category}: ${goodExamples}
${badExamples ? `PROHIBIDO decir: ${badExamples}` : ''}

${previousTasks.length > 0 ? `Ya completados (NO repetir): ${previousTasks.join(', ')}` : ''}

Genera UN micro-paso de máximo 6 palabras, relacionado con "${originalTask}".
Solo el micro-paso, nada más:`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            maxOutputTokens: 30,
                            temperature: 0.1
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
