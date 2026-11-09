# 🖥️ MasterCook Frontend

Aplicación Single Page Application (SPA) desarrollada en **React 19** con **React Router v6** para la plataforma **MasterCook Academy**.

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configuración de Variables de Entorno
Por defecto, el frontend se conecta a los microservicios locales en los puertos `5001-5004` definidos en `.env`. Puedes consultar `.env.example` para configurar endpoints remotos (Cloud Run).

```env
REACT_APP_AUTH_URL=http://localhost:5001
REACT_APP_TALLERES_URL=http://localhost:5002
REACT_APP_RESERVAS_URL=http://localhost:5003
REACT_APP_PAGOS_URL=http://localhost:5004
```

### 3. Ejecutar en desarrollo
```bash
npm start
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Ejecutar Pruebas Automatizadas
```bash
npm test -- --watchAll=false
```

### 5. Compilar para Producción
```bash
npm run build
```

---

Para consultar la arquitectura general, microservicios backend e instrucciones completas del sistema, consulta el [README principal en la raíz](../README.md).
