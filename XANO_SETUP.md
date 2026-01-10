# Configuración del Backend en Xano para "Inicia"

Esta guía te ayudará a configurar el backend completo en Xano.com para la aplicación "Inicia".

## 📋 Tabla de Contenidos

1. [Crear cuenta en Xano](#crear-cuenta-en-xano)
2. [Crear las tablas de base de datos](#crear-las-tablas-de-base-de-datos)
3. [Crear los endpoints de API](#crear-los-endpoints-de-api)
4. [Configurar la aplicación web](#configurar-la-aplicación-web)

---

## 1. Crear cuenta en Xano

1. Ve a [xano.com](https://xano.com)
2. Haz clic en "Sign Up" o "Get Started"
3. Crea una cuenta gratuita
4. Crea un nuevo workspace llamado "Inicia"

---

## 2. Crear las tablas de base de datos

### Tabla 1: `users`

Esta tabla almacena información básica de los usuarios.

**Campos:**

| Campo | Tipo | Configuración |
|-------|------|--------------|
| id | int | Auto-increment, Primary Key |
| name | text | Required |
| email | text | Unique (opcional) |
| created_at | timestamp | Default: now() |

**Pasos para crear:**

1. En el panel de Xano, ve a "Database"
2. Haz clic en "+ Add Table"
3. Nombra la tabla: `users`
4. Agrega los campos según la tabla anterior
5. Guarda la tabla

---

### Tabla 2: `sessions`

Esta tabla almacena las sesiones de trabajo de cada usuario.

**Campos:**

| Campo | Tipo | Configuración |
|-------|------|--------------|
| id | int | Auto-increment, Primary Key |
| user_name | text | Required |
| original_task | text | Required |
| tasks_completed | int | Default: 0 |
| session_duration_seconds | int | Default: 0 |
| completed_at | timestamp | Default: now() |
| created_at | timestamp | Default: now() |

**Pasos para crear:**

1. En "Database", haz clic en "+ Add Table"
2. Nombra la tabla: `sessions`
3. Agrega los campos según la tabla anterior
4. Guarda la tabla

---

### Tabla 3: `task_history`

Esta tabla almacena cada evento/acción que ocurre durante una sesión.

**Campos:**

| Campo | Tipo | Configuración |
|-------|------|--------------|
| id | int | Auto-increment, Primary Key |
| session_id | int | Foreign Key → sessions.id |
| type | text | Required (valores: 'original_task', 'micro_task_accepted', 'task_started', etc.) |
| content | text | Nullable |
| level | int | Nullable (nivel de micro-tarea 0-3) |
| timestamp | timestamp | Default: now() |

**Pasos para crear:**

1. En "Database", haz clic en "+ Add Table"
2. Nombra la tabla: `task_history`
3. Agrega los campos según la tabla anterior
4. En el campo `session_id`, configura la relación:
   - Click en el campo
   - Selecciona "Foreign Key"
   - Tabla relacionada: `sessions`
   - Campo relacionado: `id`
5. Guarda la tabla

---

## 3. Crear los endpoints de API

### Endpoint 1: GET `/user/:user_id`

**Propósito:** Obtener datos de un usuario específico

**Pasos:**

1. Ve a "API" en el panel de Xano
2. Haz clic en "+ Add API Endpoint"
3. Configura:
   - Método: `GET`
   - Path: `/user/{user_id}`
4. En el editor de funciones:
   - **Input:** Agrega parámetro `user_id` (integer, path parameter)
   - **Function Stack:**
     1. Database Request → Query Type: Get Record
     2. Table: `users`
     3. Filter: `id` = `{user_id}`
     4. Response: Return the result
5. Guarda el endpoint

---

### Endpoint 2: POST `/user`

**Propósito:** Crear o actualizar un usuario

**Pasos:**

1. Crea nuevo endpoint
2. Configura:
   - Método: `POST`
   - Path: `/user`
3. En el editor de funciones:
   - **Input:**
     - `name` (text, body)
     - `email` (text, body, optional)
   - **Function Stack:**
     1. Database Request → Query Type: Add Record
     2. Table: `users`
     3. Fields:
        - `name` = `{name}`
        - `email` = `{email}`
     4. Response: Return the created record
4. Guarda el endpoint

---

### Endpoint 3: POST `/session`

**Propósito:** Guardar una sesión completa con su historial

**Pasos:**

1. Crea nuevo endpoint
2. Configura:
   - Método: `POST`
   - Path: `/session`
3. En el editor de funciones:
   - **Input:**
     - `user_name` (text, body)
     - `original_task` (text, body)
     - `tasks_completed` (integer, body)
     - `session_duration_seconds` (integer, body)
     - `task_history` (array, body)
     - `completed_at` (text, body)
   - **Function Stack:**
     1. **Database Request** → Add Record
        - Table: `sessions`
        - Fields:
          - `user_name` = `{user_name}`
          - `original_task` = `{original_task}`
          - `tasks_completed` = `{tasks_completed}`
          - `session_duration_seconds` = `{session_duration_seconds}`
          - `completed_at` = `{completed_at}`
        - Variable name: `session`

     2. **For Each Loop** (para guardar task_history)
        - Array: `{task_history}`
        - Variable name: `task_item`
        - Inside the loop:
          - **Database Request** → Add Record
            - Table: `task_history`
            - Fields:
              - `session_id` = `{session.id}`
              - `type` = `{task_item.type}`
              - `content` = `{task_item.content}`
              - `level` = `{task_item.level}`
              - `timestamp` = `{task_item.timestamp}`

     3. **Response** → Return `{session}`
4. Guarda el endpoint

---

### Endpoint 4: GET `/sessions/:user_name`

**Propósito:** Obtener todas las sesiones de un usuario

**Pasos:**

1. Crea nuevo endpoint
2. Configura:
   - Método: `GET`
   - Path: `/sessions/{user_name}`
3. En el editor de funciones:
   - **Input:** `user_name` (text, path parameter)
   - **Function Stack:**
     1. Database Request → Query Type: Query All Records
     2. Table: `sessions`
     3. Filter: `user_name` = `{user_name}`
     4. Sort: `created_at` DESC
     5. Response: Return the results
4. Guarda el endpoint

---

### Endpoint 5: GET `/stats/:user_name`

**Propósito:** Obtener estadísticas agregadas de un usuario

**Pasos:**

1. Crea nuevo endpoint
2. Configura:
   - Método: `GET`
   - Path: `/stats/{user_name}`
3. En el editor de funciones:
   - **Input:** `user_name` (text, path parameter)
   - **Function Stack:**
     1. **Database Request** → Query All Records
        - Table: `sessions`
        - Filter: `user_name` = `{user_name}`
        - Variable name: `sessions`

     2. **Function** → Custom Code
        ```javascript
        // Calcular estadísticas
        var totalSessions = sessions.length;
        var totalTasks = 0;
        var totalMinutes = 0;

        for (var i = 0; i < sessions.length; i++) {
          totalTasks += sessions[i].tasks_completed;
          totalMinutes += Math.floor(sessions[i].session_duration_seconds / 60);
        }

        return {
          total_sessions: totalSessions,
          total_tasks_completed: totalTasks,
          total_minutes: totalMinutes,
          average_tasks_per_session: totalSessions > 0 ? Math.round(totalTasks / totalSessions) : 0,
          average_minutes_per_session: totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0
        };
        ```

     3. **Response** → Return the result
4. Guarda el endpoint

---

### Endpoint 6: POST `/task-event`

**Propósito:** Registrar un evento individual de tarea (opcional, para tracking en tiempo real)

**Pasos:**

1. Crea nuevo endpoint
2. Configura:
   - Método: `POST`
   - Path: `/task-event`
3. En el editor de funciones:
   - **Input:**
     - `session_id` (integer, body)
     - `type` (text, body)
     - `content` (text, body, optional)
     - `level` (integer, body, optional)
   - **Function Stack:**
     1. Database Request → Add Record
     2. Table: `task_history`
     3. Fields:
        - `session_id` = `{session_id}`
        - `type` = `{type}`
        - `content` = `{content}`
        - `level` = `{level}`
     4. Response: Return the created record
4. Guarda el endpoint

---

## 4. Configurar la aplicación web

Una vez que hayas creado todos los endpoints en Xano:

### Paso 1: Obtener la URL de tu API

1. En Xano, ve a "API"
2. En la esquina superior derecha, verás el "API Base URL"
3. Se verá algo como: `https://x8ki-letl-twmt.n7.xano.io/api:ABC123`
4. Copia esta URL

### Paso 2: Actualizar el archivo `js/api.js`

1. Abre el archivo `js/api.js` en tu proyecto
2. Encuentra la línea:
   ```javascript
   baseURL: 'https://your-workspace-id.xano.io/api:your-api-group',
   ```
3. Reemplázala con tu URL real:
   ```javascript
   baseURL: 'https://x8ki-letl-twmt.n7.xano.io/api:ABC123',
   ```

### Paso 3: Configurar autenticación (Opcional)

Si quieres agregar autenticación a tu API:

1. En Xano, ve a "API Settings"
2. Habilita "API Key Authentication"
3. Genera una API Key
4. En `js/api.js`, actualiza:
   ```javascript
   apiKey: 'tu-api-key-aqui',
   ```

### Paso 4: Probar la conexión

1. Abre la aplicación en tu navegador (abre `index.html`)
2. Abre la consola de desarrollador (F12)
3. Completa una sesión de trabajo
4. Al finalizar, verifica en Xano → Database → `sessions` que se haya guardado la sesión

---

## 5. Características Avanzadas (Opcional)

### CORS Configuration

Si tienes problemas de CORS al conectar desde tu frontend:

1. En Xano, ve a "API Settings"
2. En "CORS Settings":
   - Allowed Origins: `*` (o tu dominio específico)
   - Allowed Methods: `GET, POST, PUT, DELETE`
   - Allowed Headers: `Content-Type, Authorization`

### Webhooks (Opcional)

Puedes configurar webhooks en Xano para:
- Enviar notificaciones cuando un usuario complete una sesión
- Integrar con herramientas de análisis
- Enviar emails de resumen

---

## 🎉 ¡Listo!

Tu backend en Xano está configurado. La aplicación "Inicia" ahora puede:

- ✅ Guardar sesiones de usuario
- ✅ Rastrear el progreso de tareas
- ✅ Generar estadísticas
- ✅ Persistir el historial de acciones

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola de desarrollador del navegador
2. Verifica que la URL de la API sea correcta
3. Asegúrate de que los endpoints estén publicados (no en draft)
4. Revisa los logs en Xano → API → Logs

---

## 📊 Estructura de Datos de Ejemplo

### Ejemplo de sesión guardada:

```json
{
  "user_name": "Alex",
  "original_task": "Estudiar para el examen de Historia",
  "tasks_completed": 5,
  "session_duration_seconds": 2700,
  "task_history": [
    {
      "type": "original_task",
      "content": "Estudiar para el examen de Historia",
      "timestamp": "2024-01-15T14:30:00Z"
    },
    {
      "type": "micro_task_accepted",
      "content": "Pon los apuntes sobre la mesa",
      "level": 0,
      "timestamp": "2024-01-15T14:31:00Z"
    },
    {
      "type": "task_started",
      "content": "Pon los apuntes sobre la mesa",
      "timestamp": "2024-01-15T14:32:00Z"
    }
  ],
  "completed_at": "2024-01-15T15:15:00Z"
}
```
