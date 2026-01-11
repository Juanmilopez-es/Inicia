# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Inicia** is a neuroscience-based web application designed to help users overcome procrastination and analysis paralysis. The app works by breaking down intimidating tasks into progressively easier "micro-tasks" to deactivate the brain's Ventral Striatum (threat detector) and activate the Ventral Pallidum (action initiator).

**Core Philosophy**: The goal is NOT to make users work for hours, but to help them START by making the first action ridiculously easy. Success is measured by initiating action, not completion.

**Production URL**: https://amigoia.com (deployed via GitHub Pages)

## Running the Application

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Local server with Python
python3 -m http.server 8000
# Then open: http://localhost:8000

# Option 3: Local server with Node.js
npx serve
```

No build process, linting, or test runner is configured. This is intentional to keep the app simple and dependency-free.

## Architecture

### State Machine Pattern

The app is a **single-page application** using a step-based state machine. All steps exist in the DOM simultaneously but are shown/hidden via CSS classes:

- **Step 0**: Welcome - User enters their name (stored in localStorage)
- **Step 1**: Capture - User inputs their overwhelming task
- **Step 2**: Atomizer - App suggests ridiculously easy micro-task
- **Step 3**: Start - Big circular button to confirm action started
- **Step 4**: Inercia - Offer next micro-task (slightly harder)
- **Step 4b**: In Progress - Timer view while user works
- **Step 5**: Panic - User stuck; offers breathing exercise or simplification
- **Step 5b**: Breathing - Guided 30-second breathing animation
- **Step 6**: Recovery - Session complete, forced 10-minute break

### Global State Management

The entire app state lives in a single `AppState` object in `js/app.js`:

```javascript
const AppState = {
    currentStep: 0,
    userName: '',              // Captured in Step 0
    originalTask: '',
    currentMicroTask: '',
    microTaskLevel: 0,         // 0 (easiest) to 3 (normal)
    tasksCompleted: 0,
    sessionStartTime: null,
    sessionElapsedSeconds: 0,
    timerInterval: null,
    recoveryInterval: null,
    taskHistory: [],
};
```

**Important**: There is no framework state management. All state mutations happen directly on this object.

### Category-Based Micro-Task System

Micro-tasks are organized by **task category** and **difficulty level** in `CategoryTemplates`:

**Categories** (detected automatically via `detectTaskCategory()`):
- `limpieza` - cleaning/organizing (ordenar, limpiar, habitación)
- `transporte` - moving/transport (llevar, mover, kg, km, coche)
- `ejercicio` - exercise (correr, gym, deporte)
- `trabajo` - work (email, informe, proyecto)
- `estudio` - study (libro, examen, apuntes)
- `cocina` - cooking (cocinar, comida, receta)
- `comunicacion` - communication (llamar, mensaje, whatsapp)
- `general` - fallback for unrecognized tasks

**Difficulty Levels** (0-3):
- **Level 0** (Easiest): Physical actions only - "Coge una cosa del suelo"
- **Level 1** (Easy): Quick observation - "Recoge 3 cosas del suelo"
- **Level 2** (Moderate): Light engagement - "Limpia una esquina"
- **Level 3** (Normal): Active work - "Limpia durante 5 minutos"

**Key Pattern**: When user rejects a micro-task, level DECREASES. When they accept and continue, level INCREASES. The panic button offers level reset.

### Backend Integration (Optional)

The app works **offline-first**. Backend is optional for persistence:

- **API Module**: `js/api.js` contains Xano backend calls
- **Xano Base URL**: `https://x8ki-letl-twmt.n7.xano.io/api:Rws-aiYL`
- **Offline Fallback**: Failed API calls save to `localStorage` under key `inicia_offline`

## Key Code Patterns

### Step Transitions

All transitions use the `showStep(stepNumber)` function:

```javascript
showStep(2);        // Move to step 2
initStep2(task);    // Initialize step 2's event handlers
```

**Critical**: Each step has its own `initStepX()` function that sets up event listeners. Use direct assignment (`onclick =`) instead of `addEventListener()` to avoid duplicate handlers.

### Timer Management

Two timers run in the app:

1. **Session Timer** (`timerInterval`): Counts up during work (step 4b)
2. **Recovery Timer** (`recoveryInterval`): Counts down during forced break (step 6)

**Important**: `startTimer()` automatically calls `stopTimer()` first to prevent timer leaks. Timer is also stopped when entering panic mode (step 5).

### Haptic Feedback

```javascript
vibrateSuccess();  // Vibrates: [100ms, pause 50ms, 100ms]
```

Called when user clicks INICIAR button and completes micro-tasks.

## Design Principles (DO NOT VIOLATE)

These are grounded in the neuroscience purpose of the app:

1. **No Visible Task Lists**: Never show pending tasks. This triggers Ventral Striatum anxiety.
2. **Reward Starting, Not Finishing**: Dopamine release happens when user clicks INICIAR, not when task completes.
3. **Never Add Pressure**: Don't add countdown timers, streaks, or guilt-inducing features.
4. **Empathetic Language**: All copy should be supportive, never demanding.
5. **Forced Recovery**: The 10-minute post-session lockout is mandatory.
6. **Warm Color Palette**: Use CSS variables. Never use red, bright blue, or clinical white.

## Color Variables

Defined in `css/styles.css`:

- `--color-cream`: #F5F1E8 (background)
- `--color-soft-green`: #A8D5BA (positive actions)
- `--color-gentle-gray`: #B8B8B8 (neutral options)
- `--color-panic`: #F4A261 (panic button - warm orange, NOT red)

## Deployment

The app is deployed to GitHub Pages at https://amigoia.com:

```bash
# Push to gh-pages branch to deploy
git push origin gh-pages
```

- Custom domain configured via CNAME file
- HTTPS enforced via GitHub Pages settings
- No build process required

## Future Development Guidelines

1. **Maintain Offline-First**: All new features must work without backend
2. **Preserve Step Flow**: Don't add shortcuts that skip the step progression
3. **No Complexity Increase**: Don't add frameworks or build tools without strong justification
4. **Track Everything**: Log new user actions to `taskHistory` for analytics
5. **Category-Aware**: When adding micro-task templates, add them to the appropriate category in `CategoryTemplates`
