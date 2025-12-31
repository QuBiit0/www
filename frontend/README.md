# 🚀 Leandro Alvarez - Portfolio con IA

Portfolio personal con asistente de IA integrado usando Gemini, desplegado en GitHub Pages con API key segura mediante Cloudflare Workers.

## 🔐 Configuración de Seguridad

Este proyecto usa **Cloudflare Workers** como proxy seguro para mantener la API key de Gemini protegida. La clave **NUNCA** se expone en el frontend.

### Arquitectura:
```
Frontend (GitHub Pages) 
    ↓
Cloudflare Worker (con API key segura)
    ↓
Google Gemini API
```

## 📋 Requisitos Previos

1. **Node.js** (v16 o superior)
2. **Cuenta de Cloudflare** (gratuita): https://dash.cloudflare.com/sign-up
3. **API Key de Gemini**: https://aistudio.google.com/app/apikey

## 🛠️ Configuración Paso a Paso

### 1. Configurar el Cloudflare Worker

```bash
# Instalar Wrangler (CLI de Cloudflare)
npm install -g wrangler

# Ir a la carpeta del worker
cd cloudflare-worker

# Autenticarse con Cloudflare
wrangler login

# Configurar la API key de Gemini (se almacena de forma segura)
wrangler secret put GEMINI_API_KEY
# Cuando te lo pida, pega tu API key de Gemini

# Desplegar el worker
wrangler deploy
```

Copia la URL que te da Wrangler (algo como `https://leandro-portfolio-gemini-proxy.TU-SUBDOMAIN.workers.dev`)

### 2. Configurar el Frontend

```bash
# Volver a la raíz del proyecto
cd ..

# Crear archivo .env.local
cp .env.example .env.local

# Editar .env.local y pegar tu URL del worker
# VITE_WORKER_URL=https://leandro-portfolio-gemini-proxy.TU-SUBDOMAIN.workers.dev
```

### 3. Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

### 4. Desplegar a GitHub Pages

```bash
# Asegúrate de que todos los cambios estén committeados
git add .
git commit -m "Setup Cloudflare Worker proxy"
git push origin main
```

GitHub Actions automáticamente construirá y desplegará tu sitio.

## 🎨 Personalización

### Modificar el System Instruction del Chatbot

Edita el archivo `cloudflare-worker/worker.js` y busca la sección `systemInstruction`, o configura un secret:

```bash
cd cloudflare-worker
wrangler secret put SYSTEM_INSTRUCTION
# Pega tu instrucción personalizada
wrangler deploy
```

### Cambiar el Nombre del Worker

Edita `cloudflare-worker/wrangler.toml`:
```toml
name = "tu-nombre-personalizado"
```

## 🔒 Seguridad

### ✅ Medidas Implementadas:
- API key almacenada como secret en Cloudflare (nunca en el código)
- Cloudflare Worker actúa como proxy seguro
- CORS configurado para aceptar solo tu dominio

### 📌 Mejoras Recomendadas:

1. **Restringir CORS** (después del despliegue):
   
   En `cloudflare-worker/worker.js`, cambia:
   ```javascript
   'Access-Control-Allow-Origin': '*'
   ```
   Por:
   ```javascript
   'Access-Control-Allow-Origin': 'https://leandroalvarez.com.ar'
   ```

2. **Rate Limiting**: Considera agregar limitación de velocidad en el worker.

## 📊 Monitoreo

Ver estadísticas del Worker:
```bash
cd cloudflare-worker

# Ver logs en tiempo real
wrangler tail

# Ver métricas en el dashboard
# https://dash.cloudflare.com/
```

## 🆘 Troubleshooting

### El chatbot no responde

1. Verifica que el worker esté desplegado:
   ```bash
   cd cloudflare-worker
   wrangler deploy
   ```

2. Verifica que la API key esté configurada:
   ```bash
   wrangler secret list
   ```
   Deberías ver `GEMINI_API_KEY` en la lista.

3. Verifica los logs del worker:
   ```bash
   wrangler tail
   ```

4. Verifica que la URL del worker esté correctamente configurada en `.env.local`

### Error de CORS

Si ves errores de CORS en la consola del navegador, verifica que el worker tenga los headers CORS correctos en `worker.js`.

### El build falla en GitHub Actions

Asegúrate de que:
- `package.json` tenga todas las dependencias necesarias
- El repositorio tenga GitHub Pages habilitado (Settings → Pages)
- La rama `gh-pages` exista después del primer deploy

## 📦 Scripts Disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Construir para producción
npm run preview  # Preview del build de producción
```

## 💰 Costos

**Plan Gratuito de Cloudflare Workers:**
- ✅ 100,000 requests/día
- ✅ Sin costo
- ✅ Más que suficiente para un portfolio personal

**GitHub Pages:**
- ✅ Completamente gratuito

## 🔗 Enlaces Útiles

- [Documentación de Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [GitHub Pages](https://pages.github.com/)

## 📝 Licencia

MIT

---

Hecho con ❤️ por Leandro Alvarez
