# 🚀 Inicio Rápido - Inicia

Guía de 5 minutos para empezar a usar Inicia.

## Opción 1: Prueba Inmediata (Sin Backend)

La forma más rápida de probar la aplicación:

1. **Descarga o clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/inicia.git
   cd inicia
   ```

2. **Abre el archivo en tu navegador**

   - Doble clic en `index.html`, O
   - Arrastra `index.html` a tu navegador, O
   - Click derecho → "Abrir con" → Tu navegador favorito

3. **¡Listo!** La app funcionará sin backend. Los datos se guardarán en localStorage.

---

## Opción 2: Con Servidor Local (Recomendado)

Si quieres usar un servidor local:

### Usando Python (si lo tienes instalado):

```bash
# Python 3
python -m http.server 8000

# Luego abre: http://localhost:8000
```

### Usando Node.js (si tienes npx):

```bash
npx serve

# Luego abre la URL que te indique (normalmente http://localhost:3000)
```

### Usando VS Code:

1. Instala la extensión "Live Server"
2. Click derecho en `index.html` → "Open with Live Server"

---

## Opción 3: Con Backend de Xano (Completo)

Para guardar datos permanentemente:

1. **Sigue los primeros pasos de Opción 1 o 2**

2. **Configura Xano** (15-20 minutos)

   Ver la guía completa: [XANO_SETUP.md](XANO_SETUP.md)

3. **Actualiza la configuración**

   Edita `js/api.js` línea 13:
   ```javascript
   baseURL: 'https://TU-URL-DE-XANO.xano.io/api:ABC123',
   ```

4. **Recarga la página** y ¡listo!

---

## 🎯 Cómo Usar la App

### Primera vez:

1. Escribe algo que te pesa (ej: "Estudiar para el examen")
2. Acepta la micro-tarea simple (ej: "Pon los apuntes en la mesa")
3. Complétala y presiona "INICIAR"
4. Sigue las siguientes micro-tareas
5. Si te atascas, pulsa el botón de pánico

### Flujo normal:

```
Tarea pesada → Micro-tarea → Iniciar → Continuar → Pánico (si necesario) → Completar → Descansar
```

---

## 🔧 Solución de Problemas

### La app no carga:

- Asegúrate de abrir `index.html` (no otro archivo)
- Verifica que todos los archivos estén en las carpetas correctas
- Revisa la consola del navegador (F12) para errores

### Error de CORS con Xano:

1. Ve a Xano → API Settings
2. Habilita CORS
3. Allowed Origins: `*` o tu dominio específico

### Los datos no se guardan:

- Verifica que la URL de Xano esté correcta en `js/api.js`
- Verifica en la consola del navegador si hay errores de red
- Si usas modo local sin backend, los datos están en localStorage

### Botones no responden:

- Recarga la página (Ctrl/Cmd + R)
- Verifica que JavaScript esté habilitado
- Prueba en otro navegador

---

## 📱 Uso en Móvil

### Modo rápido (sin instalar):

1. Sube los archivos a un hosting gratuito:
   - Netlify (arrastra la carpeta)
   - Vercel (conecta tu GitHub)
   - GitHub Pages

2. Accede desde tu móvil a la URL generada

### Modo PWA (Próximamente):

La app se podrá "instalar" en tu móvil como una app nativa.

---

## ✅ Checklist de Instalación

- [ ] Archivos descargados/clonados
- [ ] `index.html` abierto en navegador
- [ ] App carga correctamente
- [ ] Puedes completar el flujo de una tarea
- [ ] (Opcional) Backend de Xano configurado
- [ ] (Opcional) URL de API actualizada en `api.js`

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa [README.md](README.md) para más detalles
2. Consulta [XANO_SETUP.md](XANO_SETUP.md) para el backend
3. Abre un issue en GitHub
4. Lee la documentación de Xano: https://docs.xano.com

---

## 🎉 ¡Ya estás listo!

Ahora puedes empezar a vencer la parálisis.

**Recuerda**: El objetivo no es "estudiar 4 horas", sino desactivar el freno del cerebro con micro-acciones indoloras.

¡Buena suerte! 🚀
