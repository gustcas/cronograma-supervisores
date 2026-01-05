# Cronograma de Supervisores de Perforación

Una aplicación web en React que genera cronogramas automáticos para supervisores de perforación en minería, cumpliendo reglas específicas para asegurar siempre exactamente 2 supervisores perforando.

## Descripción

Esta aplicación permite configurar parámetros como régimen de trabajo (NxM), días de inducción y total de días de perforación, y genera un cronograma visual que muestra el estado diario de cada supervisor (S1, S2, S3). Incluye validaciones para evitar errores como 3 perforando o 1 perforando después de la activación de S3.

## Requisitos

- **Node.js**: Versión 18.0.0 o superior (recomendado 18+ para compatibilidad con React 19).
- **npm**: Incluido con Node.js.

Verifica tu versión con:
```bash
node --version
npm --version
```

## Instalación

1. Clona o descarga el repositorio.
2. Navega al directorio del proyecto:
   ```bash
   cd app
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

### Desarrollo
Para iniciar el servidor de desarrollo:
```bash
npm start
```
La aplicación se abrirá en `http://localhost:3000` (o el puerto asignado, ej. 5005).

### Construcción para Producción
Para construir la aplicación optimizada:
```bash
npm run build
```
Los archivos se generan en la carpeta `build`.

### Pruebas
Para ejecutar las pruebas:
```bash
npm test
```

### Eslint
Para verificar el código:
```bash
npm run lint
```

## Despliegue

### Netlify
1. Sube el contenido de la carpeta `app` a un repositorio GitHub.
2. Conecta el repo a Netlify.
3. Configura el build:
   - Command: `npm run build`
   - Directory: `build`
4. Despliega.

### GitHub Pages
1. Instala `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Agrega al `package.json`:
   ```json
   "homepage": "https://tuusuario.github.io/tu-repo",
   "scripts": {
     "deploy": "npm run build && gh-pages -d build"
   }
   ```
3. Despliega:
   ```bash
   npm run deploy
   ```

## Casos de Prueba

La aplicación incluye validaciones para los siguientes casos obligatorios (todos deben generar cronogramas válidos sin errores):

1. Régimen 14x7 con 5 días inducción, 90 días perforación.
2. Régimen 21x7 con 3 días inducción, 90 días perforación.
3. Régimen 10x5 con 2 días inducción, 90 días perforación.
4. Régimen 14x6 con 4 días inducción, 950 días perforación.

Si se detectan errores (ej. días con ≠2 perforando), se muestran en alertas rojas.

## Tecnologías

- **React**: 19.2.3
- **Bootstrap**: 5.x (para UI moderna y responsive)
- **JavaScript**: ES6+
- **Create React App**: Para configuración inicial

## Estructura del Proyecto

```
app/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── algorithm.js      # Lógica del algoritmo de cronograma
│   ├── App.js            # Componente principal
│   ├── App.css           # Estilos personalizados
│   ├── index.js          # Punto de entrada
│   └── ...
├── package.json
└── README.md
```

## Contribuciones

Este proyecto es para evaluación técnica. No se aceptan contribuciones externas.

## Licencia

Propiedad de la empresa minera.
