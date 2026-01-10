# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Inicia** is a neuroscience-based web application designed to help users overcome procrastination and analysis paralysis. The app works by breaking down intimidating tasks into progressively easier "micro-tasks" to deactivate the brain's Ventral Striatum (threat detector) and activate the Ventral Pallidum (action initiator).

**Core Philosophy**: The goal is NOT to make users work for hours, but to help them START by making the first action ridiculously easy. Success is measured by initiating action, not completion.

## Running the Application

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Local server with Python
python -m http.server 8000
# Then open: http://localhost:8000

# Option 3: Local server with Node.js
npx serve
```

No build process, linting, or test runner is currently configured. This is intentional to keep the app simple and dependency-free.

## Architecture

### State Machine Pattern

The app is a **single-page application** using a step-based state machine. All steps exist in the DOM simultaneously but are shown/hidden via CSS classes:

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
    currentStep: 1,
    userName: 'Alex',
    originalTask: '',
    currentMicroTask: '',
    microTaskLevel: 0,        // 0 (easiest) to 3 (normal)
    tasksCompleted: 0,
    sessionStartTime: null,
    sessionElapsedSeconds: 0,
    timerInterval: null,      // setInterval handle
    recoveryInterval: null,   // setInterval handle
    taskHistory: [],          // Array of event objects
};
```

**Important**: There is no framework state management. All state mutations happen directly on this object. When adding features, maintain this pattern for consistency.

### Micro-Task Difficulty System

Micro-tasks are organized into 4 difficulty levels (0-3) in `MicroTaskTemplates`:

- **Level 0** (Easiest): Physical actions only - "Put materials on desk"
- **Level 1** (Easy): Passive observation - "Read just the titles"
- **Level 2** (Moderate): Light engagement - "Read first paragraph"
- **Level 3** (Normal): Active work - "Work for 5 minutes"

**Key Pattern**: When user rejects a micro-task, level DECREASES. When they accept and continue, level INCREASES. The panic button lets them reset to level 0.

### Task History Tracking

Every user interaction is logged to `AppState.taskHistory` with this structure:

```javascript
{
    type: 'original_task' | 'micro_task_accepted' | 'task_started' |
          'continued' | 'task_completed' | 'panic_activated' |
          'breathing_completed' | 'task_simplified' | 'task_skipped',
    content: 'task description',
    level: 0-3,  // micro-task difficulty
    timestamp: '2024-01-15T14:30:00Z'
}
```

This history is sent to Xano backend when session completes and used for analytics.

### Backend Integration (Optional)

The app works **offline-first**. Backend is optional for persistence:

1. **API Module**: `js/api.js` contains all backend calls
2. **Configuration**: Update `baseURL` at line 13 with your Xano workspace URL
3. **Offline Fallback**: Failed API calls save to `localStorage` under key `inicia_offline`
4. **Auto-Sync**: On page load, `syncOfflineData()` attempts to sync stored data

**Database Schema** (if using Xano):
- `users` table: Basic user info
- `sessions` table: Completed work sessions
- `task_history` table: Event log (foreign key to sessions)

Full Xano setup instructions are in `XANO_SETUP.md`.

## Key Code Patterns

### Step Transitions

All transitions use the `showStep(stepNumber)` function:

```javascript
showStep(2);        // Move to step 2
initStep2(task);    // Initialize step 2's event handlers
```

**Critical**: Each step has its own `initStepX()` function that sets up event listeners. These functions can be called multiple times, so avoid `addEventListener()` without cleanup. Use direct assignment (`onclick =`) instead.

### Timer Management

Two timers run in the app:

1. **Session Timer** (`timerInterval`): Counts up during work
2. **Recovery Timer** (`recoveryInterval`): Counts down during forced break

**Important**: Always call `stopTimer()` before transitioning away from step 4b, or timers will leak.

### Haptic Feedback

The app uses vibration for positive reinforcement:

```javascript
vibrateSuccess();  // Vibrates: [100ms, pause 50ms, 100ms]
```

Called when user clicks INICIAR button and completes micro-tasks. This is a key part of the dopamine reward system.

## Design Principles (DO NOT VIOLATE)

These are grounded in the neuroscience purpose of the app:

1. **No Visible Task Lists**: Never show pending tasks. This triggers Ventral Striatum anxiety.
2. **Reward Starting, Not Finishing**: Dopamine release happens when user clicks INICIAR, not when task completes.
3. **Never Add Pressure**: Don't add countdown timers, streaks, or guilt-inducing features.
4. **Empathetic Language**: All copy should be supportive, never demanding (e.g., "¿Qué te pesa?" not "¿Qué debes hacer?").
5. **Forced Recovery**: The 10-minute post-session lockout is mandatory to prevent chronic activation of the EV-PV circuit.
6. **Warm Color Palette**: Use variables from `:root` in `css/styles.css`. Never use red, bright blue, or clinical white.

## Color Variables

Defined in `css/styles.css` lines 7-14:

- `--color-cream`: #F5F1E8 (background)
- `--color-soft-green`: #A8D5BA (positive actions)
- `--color-gentle-gray`: #B8B8B8 (neutral options)
- `--color-panic`: #F4A261 (panic button - warm orange, NOT red)

## Customization Points

### Micro-Task Templates

Edit `MicroTaskTemplates` in `js/app.js` lines 27-56 to add new micro-task suggestions.

### Recovery Time

Default is 600 seconds (10 minutes). Change at `js/app.js` line 436:

```javascript
let recoverySeconds = 600; // Adjust this value
```

### Default User Name

Change `AppState.userName` default value at `js/app.js` line 12.

## Deployment

The app is a static site requiring no server-side processing:

**Netlify/Vercel**:
- Build command: (none)
- Publish directory: `/` (root)

**GitHub Pages**:
- Deploy from root directory
- No Jekyll processing needed

**Important**: Update the Xano API URL in `js/api.js` before deploying, or the app will only work in offline mode.

## Future Development Guidelines

When adding features:

1. **Maintain Offline-First**: All new features must work without backend
2. **Preserve Step Flow**: Don't add shortcuts that skip the step progression
3. **No Complexity Increase**: Don't add abstractions, frameworks, or build tools without strong justification
4. **Track Everything**: Log new user actions to `taskHistory` for analytics
5. **Test Micro-Task Levels**: New features shouldn't disrupt the 0-3 difficulty progression
6. **Consult Neuroscience**: Features should align with EV-PV activation/deactivation theory

## Roadmap

**v1.1** (next version):
- User authentication
- Statistics dashboard
- Dark mode
- PWA support

See README.md for full roadmap.
