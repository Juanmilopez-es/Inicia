/**
 * Inicia - App para vencer la parálisis basada en neurociencia
 * Gestiona el flujo del usuario a través de 6 pasos para desactivar
 * la señal de alerta del Estriado Ventral (EV) y activar el Pálido Ventral (PV)
 */

// ========================================
// Estado de la Aplicación
// ========================================
const AppState = {
    currentStep: 1,
    userName: 'Alex',
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
// Micro-tareas por Nivel (atomización progresiva)
// ========================================
const MicroTaskTemplates = {
    // Nivel 0 - Más fácil
    0: [
        'Pon los materiales sobre la mesa. No tienes que abrirlos.',
        'Levántate y ve hasta donde están tus materiales.',
        'Abre la aplicación o el documento relacionado. Solo ábrelo.',
        'Siéntate en tu lugar de estudio. Eso es todo.'
    ],
    // Nivel 1 - Fácil
    1: [
        'Lee solo los títulos o encabezados.',
        'Revisa la primera página sin leer en detalle.',
        'Haz una lista de 3 cosas que ya sabes del tema.',
        'Escribe solo el título de lo que vas a hacer.'
    ],
    // Nivel 2 - Moderado
    2: [
        'Lee el primer párrafo o sección.',
        'Resume en una frase lo que entiendes hasta ahora.',
        'Subraya o marca 3 conceptos clave.',
        'Escribe 2 preguntas sobre el tema.'
    ],
    // Nivel 3 - Normal
    3: [
        'Trabaja en esta sección durante 5 minutos.',
        'Completa la siguiente sub-tarea.',
        'Haz un esquema rápido de esta parte.',
        'Resuelve el siguiente problema o ejercicio.'
    ]
};

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
    const templates = MicroTaskTemplates[level] || MicroTaskTemplates[0];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate;
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
        user_name: AppState.userName,
        original_task: AppState.originalTask,
        tasks_completed: AppState.tasksCompleted,
        session_duration_seconds: AppState.sessionElapsedSeconds,
        task_history: AppState.taskHistory,
        completed_at: new Date().toISOString()
    };

    try {
        await API.saveSession(sessionData);
    } catch (error) {
        console.error('Error saving session:', error);
    }
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
function initStep2(task) {
    const taskNameEl = document.getElementById('taskName');
    const microTaskEl = document.getElementById('microTask');
    const acceptBtn = document.getElementById('acceptMicroTask');
    const rejectBtn = document.getElementById('rejectMicroTask');

    taskNameEl.textContent = `"${task}"`;

    // Generar micro-tarea de nivel 0 (lo más fácil)
    AppState.microTaskLevel = 0;
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
    rejectBtn.onclick = () => {
        // Si ya estamos en nivel 0, generamos otra tarea del mismo nivel
        if (AppState.microTaskLevel > 0) {
            AppState.microTaskLevel--;
        }

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
function initStep4() {
    const nextMicroTaskEl = document.getElementById('nextMicroTask');
    const continueBtn = document.getElementById('continueBtn');
    const finishBtn = document.getElementById('finishBtn');
    const panicBtn = document.getElementById('panicBtn');

    // Subir un nivel de dificultad
    AppState.microTaskLevel = Math.min(AppState.microTaskLevel + 1, 3);
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
    const timerEl = document.getElementById('sessionTimer');

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
    const breathingBtn = document.getElementById('breathingBtn');
    const simplifyBtn = document.getElementById('simplifyBtn');
    const skipBtn = document.getElementById('skipBtn');

    AppState.taskHistory.push({
        type: 'panic_activated',
        timestamp: new Date().toISOString()
    });

    // Ejercicio de respiración
    breathingBtn.onclick = () => {
        showStep('5b');
        initBreathingExercise();
    };

    // Simplificar tarea
    simplifyBtn.onclick = () => {
        AppState.microTaskLevel = Math.max(AppState.microTaskLevel - 1, 0);
        AppState.currentMicroTask = getMicroTask(AppState.microTaskLevel, AppState.originalTask);

        AppState.taskHistory.push({
            type: 'task_simplified',
            content: AppState.currentMicroTask,
            timestamp: new Date().toISOString()
        });

        showStep('4b');
        initStep4b();
    };

    // Saltar a algo más fácil
    skipBtn.onclick = () => {
        AppState.microTaskLevel = 0;
        AppState.currentMicroTask = getMicroTask(0, AppState.originalTask);

        AppState.taskHistory.push({
            type: 'task_skipped',
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
    initStep1();

    // Cargar datos del usuario si existen
    API.getUserData().then(userData => {
        if (userData && userData.name) {
            AppState.userName = userData.name;
            document.getElementById('userName').textContent = userData.name;
        }
    }).catch(err => {
        console.log('Using default user name');
    });
});
