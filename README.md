# 📊 Tasas Cuba - Monitor de Tasas de Cambio

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</div>

<div align="center">
  <h3>
    <a href="https://tasas-cuba.vercel.app/" target="_blank">Demo en Vivo</a> |
    <a href="#características">Características</a> |
    <a href="#instalación">Instalación</a> |
    <a href="#tecnologías">Tecnologías</a>
  </h3>
</div>

<div align="center">
  <p>Una aplicación web moderna para consultar y analizar las tasas de cambio del peso cubano (CUP) frente a diferentes monedas extranjeras.</p>
</div>

![Captura de pantalla de Tasas Cuba](/assets/banner.png)

## 📝 Descripción

**Tasas Cuba** es una aplicación web progresiva (PWA) que permite a los usuarios consultar las tasas de cambio actualizadas del peso cubano (CUP) frente a diferentes monedas como USD, Euro, MLC, entre otras. La aplicación ofrece herramientas de análisis histórico, comparación entre fechas y visualización de tendencias mediante gráficos interactivos y diversos indicadores técnicos.

La aplicación está diseñada para ser intuitiva, rápida y accesible, funcionando tanto en línea como fuera de línea gracias a sus capacidades de PWA. Los datos son proporcionados por la API de elToque, ofreciendo información actualizada sobre el mercado informal de divisas en Cuba.

## ✨ Características

### 📈 Dashboard Principal
- Visualización de tasas de cambio actualizadas
- Comparación automática con el día anterior
- Indicadores visuales de tendencia (subida/bajada)
- Selección de fecha para consultar datos históricos
- Modo offline con datos almacenados localmente

### 📊 Análisis Histórico
- **Análisis Gráfico**:
    - Visualización de tendencias a lo largo del tiempo
    - Selección de rango de fechas personalizable
    - Múltiples tipos de gráficos (área, línea)
    - Exportación de gráficos en diferentes formatos (PNG, JPEG, PDF)
    - Resumen estadístico detallado

- **Indicadores Técnicos**:
    - Media Móvil Simple (SMA)
    - Media Móvil Exponencial (EMA)
    - Bandas de Bollinger
    - Índice de Fuerza Relativa (RSI)
    - MACD (Convergencia/Divergencia de Medias Móviles)
    - Oscilador Estocástico

- **Comparación de Fechas**:
    - Comparación detallada entre dos fechas específicas
    - Cálculo automático de diferencias y porcentajes
    - Exportación de datos comparativos en múltiples formatos

- **Calculadora Monetaria**:
  - Conversión entre pesos cubanos (CUP) y las divisas disponibles.
  - Cambio de dirección de la conversión.

### 🌙 Características Generales
- Diseño responsive adaptado a dispositivos móviles y escritorio
- Tema oscuro/claro automático (basado en preferencias del sistema)
- Instalable como PWA (Progressive Web App)
- Funcionamiento offline
- Alertas de estado de conexión
- Optimización SEO

## 🛠️ Tecnologías

### Frontend
- **Next.js 15**: Framework React con renderizado híbrido (SSR/CSR)
- **React 18**: Biblioteca para interfaces de usuario
- **Postgres**: BD relacional Open-Source
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework CSS utilitario
- **Framer Motion**: Biblioteca de animaciones
- **Recharts**: Biblioteca para visualización de datos
- **shadcn/ui**: Componentes UI reutilizables y personalizables
- **date-fns**: Manipulación de fechas
- **html2canvas/jsPDF**: Exportación de gráficos

### Backend / API
- **Next.js API Routes**: Endpoints serverless
- **Fetch API**: Comunicación con servicios externos
- **API de elToque**: Fuente de datos de tasas de cambio
- **Base de datos Postgres**: BD en Postgres para persistir los datos históricos

### Optimización y Despliegue
- **next-pwa**: Soporte para Progressive Web App
- **Vercel**: Plataforma de despliegue y hosting
- **LocalStorage**: Almacenamiento local para funcionamiento offline

## 🚀 Demo en Vivo

La aplicación está desplegada y disponible en: [https://tasas-cuba.vercel.app/](https://tasas-cuba.vercel.app/)

## 📸 Capturas de Pantalla

<div align="center">
  <table>
    <tr>
      <td align="center" colspan="2"><b>Dashboard Principal</b></td>
    </tr>
    <tr>
      <td colspan="2"><img src="/assets/banner.png" alt="Dashboard"/></td>
    </tr>
    <tr>
      <td align="center"><b>Comparación de Fechas</b></td>
      <td align="center"><b>Análisis Histórico</b></td>
    </tr>
    <tr>
      <td><img src="/assets/comparison.png" alt="Comparación"/></td>
      <td><img src="/assets/graph.png" alt="Análisis Gráfico"/></td>
    </tr>
    <tr>
      <td align="center" colspan="2"><b>Calculadora Monetaria</b></td>
    </tr>
    <tr>
      <td colspan="2"><img src="/assets/calculator.png" alt="Calculator"/></td>
    </tr>
  </table>
</div>

## 📥 Instalación

### Requisitos Previos
- Node.js 18.x o superior
- npm o yarn

### Pasos para Instalación Local

1. **Clonar el repositorio**
>   ```bash
>   git clone https://github.com/usuario/tasas-cuba.git
>   cd tasas-cuba
>   ```

2. **Instalar dependencias**
>   ```bash
>   npm install
>   # o
>   yarn install
>   # o
>   pnpm install
>   ```
   
3. **Configurar variables de entorno**
> Crea un archivo `.env.local` en la raíz del proyecto con las variables que aparecen en `.env.example`

4. **Iniciar el servidor de desarrollo**
>   ```bash
>   npm run dev
>   # o
>   yarn dev
>   # o
>   pnpm run dev
>   ```
   
5. **Acceder a la aplicación**
> Abre [http://localhost:3000](http://localhost:3000) en tu navegador.


## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [elToque](https://eltoque.com) por proporcionar los datos de las tasas de cambio
- [Vercel](https://vercel.com) por el hosting gratuito

---
 
<div align="center">Hecho con ❤️ por <a href="https://eduardoprofe666.github.io" target="_blank">EduardoProfe666🎩</a></div>
