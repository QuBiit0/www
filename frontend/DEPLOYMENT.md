# 🚀 Guía Rápida de Despliegue - 5 Minutos

## ✅ Paso 1: Desplegar el Cloudflare Worker

### Opción A: Usando el script automatizado (RECOMENDADO)

```bash
cd cloudflare-worker
./deploy.bat
```

El script hará todo automáticamente. Después ejecuta:

```bash
./setup-secret.bat
```

Cuando te lo pida, pega tu API key de Gemini.

### Opción B: Manual

```bash
# Instalar Wrangler (solo la primera vez)
npm install -g wrangler

# Ir a la carpeta del worker
cd cloudflare-worker

# Login en Cloudflare

---

## ✅ Paso 2: Configurar el Frontend

```bash
# Volver a la raíz del proyecto
cd ..

# Crear .env.local
echo VITE_WORKER_URL=https://leandro-portfolio-gemini-proxy.XXXXX.workers.dev > .env.local
```

**Reemplaza `XXXXX` con tu subdomain de Cloudflare.**

---

## ✅ Paso 3: Probar Localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000 y prueba el chatbot.

---

## ✅ Paso 4: Desplegar a GitHub Pages

```bash
git add .
git commit -m "Setup Cloudflare Worker proxy for secure API key"
git push origin main
```

**¡Listo!** GitHub Actions desplegará automáticamente tu sitio.

---

## 🔐 Mejora de Seguridad (Después del despliegue)

Una vez que tu sitio esté funcionando en `leandroalvarez.com.ar`, mejora la seguridad:

```bash
cd cloudflare-worker
```

Edita `worker.js` y cambia:
```javascript
'Access-Control-Allow-Origin': '*'
```

Por:
```javascript
'Access-Control-Allow-Origin': 'https://leandroalvarez.com.ar'
```

Luego re-despliega:
```bash
wrangler deploy
```

---

## 🆘 Verificar que Todo Funciona

### Ver logs del worker en tiempo real:
```bash
cd cloudflare-worker
wrangler tail
```

### Verificar que la API key está configurada:
```bash
wrangler secret list
```

Deberías ver `GEMINI_API_KEY` en la lista.

---

## 📊 URLs Importantes

- **Dashboard de Cloudflare:** https://dash.cloudflare.com/
- **Tu sitio:** https://leandroalvarez.com.ar
- **GitHub Actions:** https://github.com/TU_USUARIO/Portafolio/actions

---

**¡Eso es todo!** Tu API key está ahora 100% segura en Cloudflare. 🎉
