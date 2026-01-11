/**
 * Inicia - App para vencer la parálisis basada en neurociencia
 * Gestiona el flujo del usuario a través de 6 pasos para desactivar
 * la señal de alerta del Estriado Ventral (EV) y activar el Pálido Ventral (PV)
 */

// ========================================
// Estado de la Aplicación
// ========================================
const AppState = {
    currentStep: 0,
    userName: '',
    originalTask: '',
    currentMicroTask: '',
    microTaskLevel: 0,
    tasksCompleted: 0,
    sessionStartTime: null,
    sessionElapsedSeconds: 0,
    timerInterval: null,
    recoveryInterval: null,
    taskHistory: [],
};

// ========================================
// Micro-tareas por Categoría y Nivel
// ========================================
const CategoryTemplates = {
    limpieza: {
        0: ['Coge una cosa del suelo', 'Tira un papel a la basura', 'Pon un objeto en su sitio', 'Abre el armario'],
        1: ['Recoge 3 cosas del suelo', 'Vacía una papelera', 'Ordena una superficie pequeña', 'Dobla una prenda'],
        2: ['Limpia una esquina', 'Organiza un cajón', 'Haz la cama', 'Recoge toda la ropa sucia'],
        3: ['Limpia durante 5 minutos', 'Ordena una zona completa', 'Aspira una habitación', 'Friega una superficie']
    },
    transporte: {
        0: ['Busca las llaves', 'Ponte los zapatos', 'Coge una bolsa vacía', 'Mira qué hay que mover'],
        1: ['Acerca una caja a la puerta', 'Abre el maletero', 'Haz una lista de lo que llevar', 'Despeja el camino'],
        2: ['Lleva una cosa al coche', 'Empaqueta algo pequeño', 'Organiza lo que vas a mover', 'Carga una bolsa'],
        3: ['Haz un viaje al coche', 'Mueve varias cosas', 'Carga durante 5 minutos', 'Organiza el maletero']
    },
    ejercicio: {
        0: ['Ponte las zapatillas', 'Llena la botella de agua', 'Busca la ropa de deporte', 'Levántate del sofá'],
        1: ['Sal a la puerta de casa', 'Estira los brazos', 'Da 10 pasos', 'Ponte la ropa de deporte'],
        2: ['Camina hasta la esquina', 'Haz 5 sentadillas', 'Estira durante 2 minutos', 'Sube unas escaleras'],
        3: ['Camina 5 minutos', 'Haz una serie de ejercicios', 'Corre hasta el final de la calle', 'Entrena 5 minutos']
    },
    trabajo: {
        0: ['Enciende el ordenador', 'Abre el navegador', 'Siéntate en la silla', 'Coge un bolígrafo'],
        1: ['Abre el programa que necesitas', 'Lee el asunto del primer email', 'Mira tu lista de tareas', 'Abre el documento'],
        2: ['Responde un email corto', 'Escribe el primer párrafo', 'Revisa lo pendiente', 'Haz una llamada rápida'],
        3: ['Trabaja 5 minutos seguidos', 'Completa una tarea pequeña', 'Escribe media página', 'Termina un email largo']
    },
    estudio: {
        0: ['Saca el libro o apuntes', 'Siéntate en tu lugar de estudio', 'Abre el documento', 'Busca un bolígrafo'],
        1: ['Lee el título del tema', 'Mira el índice', 'Lee los títulos de sección', 'Revisa tus notas anteriores'],
        2: ['Lee el primer párrafo', 'Subraya una frase importante', 'Escribe una pregunta', 'Resume una idea'],
        3: ['Estudia 5 minutos', 'Lee una página completa', 'Haz un esquema', 'Resuelve un ejercicio']
    },
    cocina: {
        0: ['Ve a la cocina', 'Abre la nevera', 'Saca una olla', 'Mira qué ingredientes tienes'],
        1: ['Saca los ingredientes', 'Pon agua a hervir', 'Precalienta el horno', 'Lava una verdura'],
        2: ['Corta un ingrediente', 'Mezcla dos cosas', 'Pon algo al fuego', 'Prepara la mesa'],
        3: ['Cocina durante 5 minutos', 'Prepara un plato sencillo', 'Termina de cocinar algo', 'Sirve la comida']
    },
    comunicacion: {
        0: ['Coge el teléfono', 'Busca el contacto', 'Abre WhatsApp', 'Mira si tienes mensajes'],
        1: ['Escribe "hola"', 'Lee el último mensaje', 'Busca el número', 'Abre la app de llamadas'],
        2: ['Envía un mensaje corto', 'Haz una llamada de 1 minuto', 'Responde un mensaje', 'Agenda la cita'],
        3: ['Mantén una conversación', 'Haz la llamada completa', 'Resuelve el tema', 'Confirma los detalles']
    },
    general: {
        0: ['Levántate', 'Ve al lugar donde lo harás', 'Busca lo que necesitas', 'Prepara el espacio'],
        1: ['Coge lo primero que necesites', 'Mira qué hay que hacer', 'Organiza tus cosas', 'Empieza por algo pequeño'],
        2: ['Haz la parte más fácil', 'Dedica 2 minutos', 'Completa un paso', 'Avanza un poco'],
        3: ['Trabaja 5 minutos', 'Haz una parte completa', 'Avanza significativamente', 'Termina algo concreto']
    }
};

// Función para detectar categoría de la tarea
function detectTaskCategory(task) {
    const t = task.toLowerCase();
    if (t.match(/ordenar|limpiar|habitaci|cuarto|casa|ropa|armario|basura|fregar|barrer|aspirar/)) return 'limpieza';
    if (t.match(/transport|mudan|llevar|mover|carga|kg|km|coche|furgoneta|caja|maleta/)) return 'transporte';
    if (t.match(/ejercicio|correr|gym|deporte|entren|caminar|bici|nadar|yoga/)) return 'ejercicio';
    if (t.match(/email|correo|trabajo|informe|proyecto|oficina|ordenador|documento|reunión/)) return 'trabajo';
    if (t.match(/estudiar|libro|examen|apuntes|leer|universidad|deberes|clase|tema/)) return 'estudio';
    if (t.match(/cocinar|comida|cena|cocina|receta|ingrediente|desayuno|almuerzo/)) return 'cocina';
    if (t.match(/llamar|teléfono|contactar|cita|mensaje|whatsapp|hablar con/)) return 'comunicacion';
    return 'general';
}

// Plantillas legacy para compatibilidad
const MicroTaskTemplates = CategoryTemplates.general;

// ========================================
// Utilidades
// ========================================
function showStep(stepNumber) {
    // Ocultar todos los pasos
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // Mostrar el paso actual
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        AppState.currentStep = stepNumber;
    }
}

function getMicroTask(level, taskContext = '') {
    // Detectar categoría de la tarea
    const task = taskContext || AppState.originalTask;
    const category = detectTaskCategory(task);

    // Obtener plantillas para esta categoría y nivel
    const categoryTasks = CategoryTemplates[category] || CategoryTemplates.general;
    const levelTasks = categoryTasks[level] || categoryTasks[0];

    // Filtrar tareas ya completadas para no repetir
    const completedTasks = AppState.taskHistory
        .filter(t => t.type === 'micro_task_accepted' || t.type === 'task_completed')
        .map(t => t.content);

    const availableTasks = levelTasks.filter(t => !completedTasks.includes(t));

    // Si todas las tareas de este nivel ya se hicieron, usar cualquiera
    const tasksToChoose = availableTasks.length > 0 ? availableTasks : levelTasks;

    // Seleccionar una al azar
    return tasksToChoose[Math.floor(Math.random() * tasksToChoose.length)];
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function vibrateSuccess() {
    if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
    }
}

async function saveSession() {
    const sessionData = {
        user_id: AppState.userName,
        original_task: AppState.originalTask,
        tasks_completed: AppState.tasksCompleted,
        session_duration_seconds: AppState.sessionElapsedSeconds,
        task_history: JSON.stringify(AppState.taskHistory),
        completed_at: new Date().toISOString()
    };

    try {
        const savedSession = await API.saveSession(sessionData);
        console.log('Session saved successfully:', savedSession);
    } catch (error) {
        console.error('Error saving session:', error);
        API.saveOffline('sessions', sessionData);
    }
}

// ========================================
// Paso 0: Bienvenida y Nombre
// ========================================
function initStep0() {
    const nameInput = document.getElementById('userNameInput');
    const nameBtn = document.getElementById('nameSubmitBtn');

    nameBtn.onclick = () => {
        const name = nameInput.value.trim();
        if (name) {
            AppState.userName = name;
            localStorage.setItem('inicia_userName', name);
            document.getElementById('userName').textContent = name;
            showStep(1);
            initStep1();
        } else {
            nameInput.style.borderColor = '#F4A261';
            nameInput.focus();
        }
    };

    // Enter key support
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            nameBtn.click();
        }
    });

    nameInput.addEventListener('input', () => {
        nameInput.style.borderColor = '';
    });
}

// ========================================
// Paso 1: Captura sin Juicios
// ========================================
function initStep1() {
    const taskInput = document.getElementById('taskInput');
    const captureBtn = document.getElementById('captureBtn');
    const userNameEl = document.getElementById('userName');

    // Cargar nombre de usuario si existe
    userNameEl.textContent = AppState.userName;

    captureBtn.addEventListener('click', () => {
        const task = taskInput.value.trim();

        if (!task) {
            taskInput.style.borderColor = '#F4A261';
            taskInput.focus();
            return;
        }

        AppState.originalTask = task;
        AppState.taskHistory.push({
            type: 'original_task',
            content: task,
            timestamp: new Date().toISOString()
        });

        // Transición al Paso 2
        showStep(2);
        initStep2(task);
    });

    // Reset border color on input
    taskInput.addEventListener('input', () => {
        taskInput.style.borderColor = '';
    });
}

// ========================================
// Paso 2: El Atomizador
// ========================================
async function initStep2(task) {
    const taskNameEl = document.getElementById('taskName');
    const microTaskEl = document.getElementById('microTask');
    const acceptBtn = document.getElementById('acceptMicroTask');
    const rejectBtn = document.getElementById('rejectMicroTask');

    taskNameEl.textContent = `"${task}"`;

    // Generar micro-tarea de nivel 0 (lo más fácil)
    AppState.microTaskLevel = 0;
    microTaskEl.textContent = 'Pensando...';
    AppState.currentMicroTask = getMicroTask(0, task);
    microTaskEl.textContent = AppState.currentMicroTask;

    // Botón Aceptar
    acceptBtn.onclick = () => {
        AppState.taskHistory.push({
            type: 'micro_task_accepted',
            content: AppState.currentMicroTask,
            level: AppState.microTaskLevel,
            timestamp: new Date().toISOString()
        });

        showStep(3);
        initStep3();
    };

    // Botón Rechazar (atomizar aún más)
    rejectBtn.onclick = async () => {
        // Si ya estamos en nivel 0, generamos otra tarea del mismo nivel
        if (AppState.microTaskLevel > 0) {
            AppState.microTaskLevel--;
        }

        microTaskEl.textContent = 'Pensando algo más fácil...';
        AppState.currentMicroTask = getMicroTask(AppState.microTaskLevel, task);
        microTaskEl.textContent = AppState.currentMicroTask;

        AppState.taskHistory.push({
            type: 'micro_task_rejected',
            content: AppState.currentMicroTask,
            level: AppState.microTaskLevel,
            timestamp: new Date().toISOString()
        });
    };
}

// ========================================
// Paso 3: Click de Inicio (Activación del PV)
// ========================================
function initStep3() {
    const startBtn = document.getElementById('startBtn');
    const currentMicroTaskEl = document.getElementById('currentMicroTask');

    currentMicroTaskEl.textContent = AppState.currentMicroTask;

    startBtn.onclick = () => {
        // Efecto de vibración
        vibrateSuccess();

        // Animación de brillo
        startBtn.style.animation = 'glow 0.5s ease';

        setTimeout(() => {
            AppState.sessionStartTime = Date.now();
            AppState.tasksCompleted++;

            AppState.taskHistory.push({
                type: 'task_started',
                content: AppState.currentMicroTask,
                timestamp: new Date().toISOString()
            });

            // Transición al Paso 4 (Inercia)
            showStep(4);
            initStep4();
        }, 500);
    };
}

// ========================================
// Paso 4: La Inercia
// ========================================
async function initStep4() {
    const nextMicroTaskEl = document.getElementById('nextMicroTask');
    const continueBtn = document.getElementById('continueBtn');
    const finishBtn = document.getElementById('finishBtn');
    const panicBtn = document.getElementById('panicBtn');

    // Subir un nivel de dificultad
    AppState.microTaskLevel = Math.min(AppState.microTaskLevel + 1, 3);
    nextMicroTaskEl.textContent = 'Pensando siguiente paso...';
    const nextTask = getMicroTask(AppState.microTaskLevel, AppState.originalTask);
    nextMicroTaskEl.textContent = nextTask;

    // Botón Continuar
    continueBtn.onclick = () => {
        AppState.currentMicroTask = nextTask;
        AppState.taskHistory.push({
            type: 'continued',
            content: nextTask,
            timestamp: new Date().toISOString()
        });

        showStep('4b');
        initStep4b();
    };

    // Botón Terminar
    finishBtn.onclick = () => {
        stopTimer();
        showStep(6);
        initStep6();
    };

    // Botón de Pánico
    panicBtn.onclick = () => {
        showStep(5);
        initStep5();
    };
}

// ========================================
// Paso 4b: En Progreso
// ========================================
function initStep4b() {
    const currentTaskDisplay = document.getElementById('currentTaskDisplay');
    const completeTaskBtn = document.getElementById('completeTaskBtn');
    const panicBtn2 = document.getElementById('panicBtn2');

    currentTaskDisplay.textContent = AppState.currentMicroTask;

    // Iniciar temporizador
    startTimer();

    // Botón Completar Tarea
    completeTaskBtn.onclick = () => {
        AppState.tasksCompleted++;
        AppState.taskHistory.push({
            type: 'task_completed',
            content: AppState.currentMicroTask,
            timestamp: new Date().toISOString()
        });

        vibrateSuccess();
        showStep(4);
        initStep4();
    };

    // Botón de Pánico
    panicBtn2.onclick = () => {
        showStep(5);
        initStep5();
    };
}

function startTimer() {
    // Detener cualquier timer previo antes de iniciar uno nuevo
    stopTimer();

    const timerEl = document.getElementById('sessionTimer');
    if (!timerEl) return;

    // Actualizar inmediatamente
    timerEl.textContent = formatTime(AppState.sessionElapsedSeconds);

    AppState.timerInterval = setInterval(() => {
        AppState.sessionElapsedSeconds++;
        timerEl.textContent = formatTime(AppState.sessionElapsedSeconds);
    }, 1000);
}

function stopTimer() {
    if (AppState.timerInterval) {
        clearInterval(AppState.timerInterval);
        AppState.timerInterval = null;
    }
}

// ========================================
// Paso 5: Gestión del Bloqueo
// ========================================
function initStep5() {
    // Detener el timer mientras está en modo pánico
    stopTimer();

    const breathingBtn = document.getElementById('breathingBtn');
    const simplifyBtn = document.getElementById('simplifyBtn');
    const skipBtn = document.getElementById('skipBtn');

    AppState.taskHistory.push({
        type: 'panic_activated',
        timestamp: new Date().toISOString()
    });

    // Ejercicio de respiración - calma al usuario
    breathingBtn.onclick = () => {
        showStep('5b');
        initBreathingExercise();
    };

    // Dame otro paso - mantiene el nivel pero da una tarea diferente
    simplifyBtn.onclick = () => {
        AppState.currentMicroTask = getMicroTask(AppState.microTaskLevel, AppState.originalTask);

        AppState.taskHistory.push({
            type: 'task_changed',
            content: AppState.currentMicroTask,
            level: AppState.microTaskLevel,
            timestamp: new Date().toISOString()
        });

        showStep('4b');
        initStep4b();
    };

    // Empezar más fácil - va al nivel 0 (más fácil)
    skipBtn.onclick = () => {
        AppState.microTaskLevel = 0;
        AppState.currentMicroTask = getMicroTask(0, AppState.originalTask);

        AppState.taskHistory.push({
            type: 'task_reset_to_easy',
            content: AppState.currentMicroTask,
            timestamp: new Date().toISOString()
        });

        showStep('4b');
        initStep4b();
    };
}

// ========================================
// Paso 5b: Ejercicio de Respiración
// ========================================
function initBreathingExercise() {
    const breathingCircle = document.getElementById('breathingCircle');
    const breathingInstruction = document.getElementById('breathingInstruction');
    const breathingTimer = document.getElementById('breathingTimer');

    let timeRemaining = 30;
    let breathPhase = 'in'; // 'in' o 'out'
    let breathCycle = 0;

    const breathingInterval = setInterval(() => {
        timeRemaining--;
        breathingTimer.textContent = `${timeRemaining}s`;

        // Cambiar fase cada 4 segundos
        if (breathCycle % 4 === 0) {
            breathPhase = breathPhase === 'in' ? 'out' : 'in';

            if (breathPhase === 'in') {
                breathingInstruction.textContent = 'Inhala';
                breathingCircle.className = 'breathing-circle breathe-in';
            } else {
                breathingInstruction.textContent = 'Exhala';
                breathingCircle.className = 'breathing-circle breathe-out';
            }
        }

        breathCycle++;

        if (timeRemaining <= 0) {
            clearInterval(breathingInterval);

            AppState.taskHistory.push({
                type: 'breathing_completed',
                timestamp: new Date().toISOString()
            });

            // Volver al paso 4b
            setTimeout(() => {
                showStep('4b');
                initStep4b();
            }, 500);
        }
    }, 1000);
}

// ========================================
// Paso 6: Cierre y Recuperación
// ========================================
function initStep6() {
    const tasksCompletedEl = document.getElementById('tasksCompleted');
    const totalTimeEl = document.getElementById('totalTime');
    const recoveryTimerEl = document.getElementById('recoveryTimer');
    const newSessionBtn = document.getElementById('newSessionBtn');
    const newSessionText = document.getElementById('newSessionText');

    // Mostrar estadísticas
    tasksCompletedEl.textContent = AppState.tasksCompleted;
    totalTimeEl.textContent = Math.floor(AppState.sessionElapsedSeconds / 60);

    // Guardar sesión
    saveSession();

    // Temporizador de recuperación (10 minutos)
    let recoverySeconds = 600; // 10 minutos

    AppState.recoveryInterval = setInterval(() => {
        recoverySeconds--;
        const mins = Math.floor(recoverySeconds / 60);
        const secs = recoverySeconds % 60;
        recoveryTimerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

        if (recoverySeconds <= 0) {
            clearInterval(AppState.recoveryInterval);
            newSessionBtn.disabled = false;
            newSessionText.textContent = 'Empezar nueva sesión';
            newSessionBtn.classList.remove('primary-btn');
            newSessionBtn.classList.add('success-btn');
        }
    }, 1000);

    // Botón nueva sesión
    newSessionBtn.onclick = () => {
        if (!newSessionBtn.disabled) {
            resetApp();
        }
    };
}

function resetApp() {
    // Reset state
    AppState.currentStep = 1;
    AppState.originalTask = '';
    AppState.currentMicroTask = '';
    AppState.microTaskLevel = 0;
    AppState.tasksCompleted = 0;
    AppState.sessionStartTime = null;
    AppState.sessionElapsedSeconds = 0;
    AppState.taskHistory = [];

    // Clear intervals
    stopTimer();
    if (AppState.recoveryInterval) {
        clearInterval(AppState.recoveryInterval);
    }

    // Reset UI
    document.getElementById('taskInput').value = '';

    showStep(1);
}

// ========================================
// Inicialización
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay nombre guardado en localStorage
    const savedName = localStorage.getItem('inicia_userName');

    if (savedName) {
        // Usuario ya tiene nombre, ir directo al Step 1
        AppState.userName = savedName;
        document.getElementById('userName').textContent = savedName;
        showStep(1);
        initStep1();
    } else {
        // Primera vez, mostrar Step 0 para pedir nombre
        showStep(0);
        initStep0();
    }
});
