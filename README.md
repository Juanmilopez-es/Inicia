# Inicia 🚀

**Vence la parálisis basándote en neurociencia**

Inicia es una aplicación web diseñada para ayudar a personas con parálisis de análisis y procrastinación, utilizando principios científicos del funcionamiento del cerebro (Estriado Ventral y Pálido Ventral).

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🧠 La Ciencia Detrás de Inicia

La aplicación está basada en investigaciones sobre el **Estriado Ventral (EV)** y el **Pálido Ventral (PV)**:

- **Estriado Ventral (EV)**: Actúa como detector de incomodidad, enviando señales de "freno" cuando percibe amenazas
- **Pálido Ventral (PV)**: Inicia el movimiento y la acción

El problema de la procrastinación no es falta de motivación, sino que el EV detecta la tarea como una "amenaza" y activa el freno. Inicia desactiva esta señal de alerta mediante:

1. **Atomización radical** de tareas
2. **Recompensa por iniciar** (no por terminar)
3. **Gestión de bloqueos** sin presión
4. **Recuperación forzada** para prevenir abulia

---

## ✨ Características

### 🎯 6 Pasos del User Journey

1. **Captura sin Juicios**: Entrada empática de la tarea que pesa
2. **El Atomizador**: Reduce la tarea a micro-acciones ridículamente fáciles
3. **Click de Inicio**: Recompensa dopamínica al empezar (no al terminar)
4. **La Inercia**: Aprovecha el momentum para continuar
5. **Botón de Pánico**: Gestión de bloqueos sin presión adicional
6. **Cierre y Recuperación**: Previene daños estructurales con descanso forzado

### 💡 Funcionalidades Técnicas

- ✅ Interfaz minimalista con colores cálidos (sin estrés visual)
- ✅ Feedback háptico en momentos clave
- ✅ Temporizador invisible (sin ansiedad por el tiempo)
- ✅ Ejercicio de respiración guiado
- ✅ Estadísticas de progreso
- ✅ Persistencia de datos en Xano
- ✅ Modo offline con sincronización automática
- ✅ Responsive design

---

## 🚀 Instalación Rápida

### Opción 1: Ejecutar localmente

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/inicia.git
   cd inicia
   ```

2. **Abre el proyecto**

   Simplemente abre `index.html` en tu navegador. No se requiere servidor web para la versión básica.

3. **Configura el backend (opcional)**

   Para persistencia de datos, sigue la [Guía de Configuración de Xano](XANO_SETUP.md)

### Opción 2: Desplegar en Netlify/Vercel

1. Haz fork del repositorio
2. Conecta tu repositorio a Netlify o Vercel
3. Despliega (build command: ninguno, publish directory: `/`)

---

## 🔧 Configuración del Backend

La aplicación funciona sin backend, pero para guardar sesiones y estadísticas:

1. Crea una cuenta en [Xano.com](https://xano.com)
2. Sigue la [Guía Completa de Configuración de Xano](XANO_SETUP.md)
3. Actualiza la URL de API en `js/api.js`

---

## 📁 Estructura del Proyecto

```
inicia/
├── index.html              # Estructura HTML principal
├── css/
│   └── styles.css          # Estilos con diseño empático
├── js/
│   ├── app.js              # Lógica principal de la aplicación
│   └── api.js              # Integración con Xano backend
├── assets/
│   └── sounds/             # (Opcional) Sonidos de feedback
├── README.md               # Este archivo
├── XANO_SETUP.md           # Guía de configuración del backend
└── LICENSE                 # Licencia MIT
```

---

## 🎨 Diseño y UX

### Paleta de Colores

- **Crema**: `#F5F1E8` - Color de fondo calmante
- **Verde Suave**: `#A8D5BA` - Acciones positivas
- **Gris Gentil**: `#B8B8B8` - Opciones neutras
- **Naranja Cálido**: `#F4A261` - Botón de pánico

### Principios de Diseño

- Sin notificaciones agresivas
- Sin listas de "tareas pendientes" visibles
- Modo túnel para eliminar distracciones
- Feedback positivo inmediato
- Recuperación forzada (bloqueo de 10 minutos)

---

## 📱 Uso de la Aplicación

### Flujo básico:

1. **Escribe** lo que te pesa (ej: "Estudiar para el examen")
2. **Acepta** la micro-tarea ultra-simple (ej: "Pon los apuntes en la mesa")
3. **Presiona** el botón INICIAR cuando completes esa micro-acción
4. **Continúa** con la siguiente micro-tarea (nivel de dificultad gradual)
5. Si te atascas, **pulsa el botón de pánico** para simplificar o respirar
6. Al terminar, **descansa 10 minutos** (la app se bloqueará)

---

## 🧪 Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Xano (No-code backend platform)
- **Storage**: LocalStorage para modo offline
- **API**: REST API con Xano

### ¿Por qué Vanilla JavaScript?

- Sin dependencias = carga ultra-rápida
- Simplicidad = fácil de mantener
- Accesibilidad = funciona en cualquier navegador

---

## 🤝 Contribuir

¡Contribuciones son bienvenidas! Si quieres mejorar Inicia:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Ideas para contribuir:

- [ ] Modo oscuro
- [ ] Múltiples usuarios con autenticación
- [ ] Dashboard de estadísticas avanzadas
- [ ] Integración con Google Calendar
- [ ] Sonidos de ambiente opcionales
- [ ] Gamificación (logros, rachas)
- [ ] Export de datos (CSV, PDF)
- [ ] Versión móvil nativa (PWA)

---

## 📊 Roadmap

### v1.0 (Actual)
- ✅ Flujo completo de 6 pasos
- ✅ Integración con Xano
- ✅ Modo offline
- ✅ Responsive design

### v1.1 (Próximamente)
- [ ] Autenticación de usuarios
- [ ] Dashboard de estadísticas
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)

### v2.0 (Futuro)
- [ ] App móvil nativa
- [ ] Integración con calendarios
- [ ] Comunidad y compartir logros
- [ ] Terapia asistida por IA

---

## 📚 Referencias Científicas

Esta aplicación está inspirada en:

- Amemori, K., Graybiel, A. M. (2012). "Localized microstimulation of primate pregenual cingulate cortex induces negative decision-making"
- Balleine, B. W., O'Doherty, J. P. (2010). "Human and rodent homologies in action control: corticostriatal determinants of goal-directed and habitual action"
- Salamone, J. D., Correa, M. (2012). "The mysterious motivational functions of mesolimbic dopamine"

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 💬 Contacto y Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/inicia/issues)
- **Email**: tu-email@ejemplo.com
- **Twitter**: [@tu_usuario](https://twitter.com/tu_usuario)

---

## 🙏 Agradecimientos

- A todos los que luchan con la parálisis de análisis
- A la comunidad científica por la investigación en neurociencia
- A los beta testers que ayudaron a refinar la experiencia

---

## ⭐ ¿Te gusta Inicia?

Si esta app te ha ayudado a vencer la parálisis:

- Dale una ⭐ al repositorio
- Compártela con alguien que la necesite
- Contribuye con mejoras

**Juntos podemos ayudar a más personas a INICIAR.**

---

Hecho con ❤️ y ciencia del cerebro
