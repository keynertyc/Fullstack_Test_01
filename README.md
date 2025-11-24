# Prueba Técnica - Fullstack Developer (Node.js + React)

¡Bienvenido(a) a la prueba técnica para el puesto de **Desarrollador Fullstack**!

Esta prueba evaluará tus habilidades en el desarrollo de aplicaciones full-stack modernas utilizando **Node.js**, **Express**, **React**, y bases de datos. Tendrás **48 horas** para completar el desafío.

---

## 📋 Descripción del Proyecto

Desarrollarás una **plataforma de gestión de proyectos y tareas colaborativa** donde los usuarios pueden:

- Registrarse e iniciar sesión de forma segura
- Crear y gestionar proyectos
- Asignar tareas a diferentes proyectos
- Colaborar con otros usuarios en proyectos compartidos
- Filtrar, buscar y ordenar tareas por diferentes criterios
- Ver estadísticas básicas de sus proyectos

---

## 🛠️ Stack Tecnológico Requerido

### Backend

- **Runtime**: Node.js (v18 o superior)
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL **o** MongoDB (elige una)
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación API**: Swagger/OpenAPI

### Frontend

- **Framework**: React (v18 o superior)
- **Lenguaje**: TypeScript
- **Routing**: React Router v6
- **Estilos**: TailwindCSS (preferencia)

### DevOps (Opcional)

- **Containerización**: Docker + Docker Compose

**Nota**: Puedes usar cualquier otra librería o herramienta que consideres necesaria. Documenta tus decisiones técnicas en el archivo `TECHNICAL_DECISIONS.md`.

---

## 📦 Funcionalidades Requeridas

### 1. Autenticación y Usuarios

**Backend:**

- Registro de usuarios con validación
- Login con generación de JWT
- Middleware de autenticación para proteger rutas
- Hash de contraseñas
- Endpoint para obtener perfil del usuario autenticado

**Frontend:**

- Formularios de registro y login con validaciones
- Almacenamiento del token de autenticación
- Rutas protegidas que requieren autenticación
- Redirección automática según estado de autenticación

---

### 2. Gestión de Proyectos

**Backend:**

- CRUD completo de proyectos
- Solo el creador del proyecto puede editarlo o eliminarlo
- Sistema de colaboradores: añadir usuarios a proyectos
- Paginación en listado de proyectos

**Frontend:**

- Lista de proyectos con diseño responsive
- Crear, editar y eliminar proyectos
- Búsqueda y filtrado de proyectos
- Gestión de colaboradores

---

### 3. Gestión de Tareas

**Backend:**

- CRUD completo de tareas
- Las tareas pertenecen a un proyecto
- Estados: "pendiente", "en progreso", "completada"
- Prioridades: "baja", "media", "alta"
- Asignar tareas a colaboradores del proyecto
- Filtros por estado, prioridad, proyecto, usuario asignado
- Ordenamiento flexible

**Frontend:**

- Visualización de tareas (lista, kanban, o tu propuesta)
- Crear, editar y eliminar tareas
- Cambiar estado de tareas
- Filtros interactivos
- Asignación de tareas a usuarios

---

### 4. Dashboard y Estadísticas

**Backend:**

- Endpoint con estadísticas del usuario:
  - Total de proyectos
  - Total de tareas
  - Tareas por estado
  - Otras métricas relevantes

**Frontend:**

- Dashboard con visualización de estadísticas
- Resumen de actividad del usuario

---

## 📊 Criterios de Evaluación

Tu proyecto será evaluado en base a:

| Criterio                  | Peso |
| ------------------------- | ---- |
| **Funcionalidad**         | 30%  |
| **Calidad del Código**    | 25%  |
| **Arquitectura y Diseño** | 15%  |
| **Seguridad**             | 10%  |
| **UI/UX**                 | 10%  |
| **Documentación**         | 5%   |
| **Testing**               | 5%   |

### Puntos Extra (hasta +30%)

- Docker implementation completa (+10%)
- Tests exhaustivos (+5%)
- Funcionalidades adicionales (+5%)
- CI/CD pipeline (+5%)
- Deploy en producción (+5%)

---

## 📝 Instrucciones de Entrega

1. **Fork del repositorio**: Crea un fork de este repositorio

2. **Rama de trabajo**:

   ```
   test/tu-nombre-completo
   ```

3. **Estructura del proyecto**:

   ```
   /
   ├── backend/
   ├── frontend/
   ├── TECHNICAL_DECISIONS.md    # Documenta tus decisiones aquí
   ├── docker-compose.yml         # (opcional)
   └── README.md                  # Actualiza con instrucciones de ejecución
   ```

4. **Documentación requerida**:

   - Actualiza este README con instrucciones de instalación y ejecución
   - Completa el archivo `TECHNICAL_DECISIONS.md` explicando tus elecciones
   - Documenta tu API con Swagger
   - Incluye al menos 5 tests

5. **Pull Request**: Una vez completado, crea un PR hacia el repositorio original

---

## ⏱️ Tiempo

Tienes **48 horas** desde que recibes esta prueba. Gestiona tu tiempo según tus prioridades.

---

## ❓ Preguntas Frecuentes

**¿Puedo usar librerías adicionales?**
Sí, documenta tus elecciones en `TECHNICAL_DECISIONS.md`.

**¿Qué base de datos uso?**
La que prefieras (MySQL o MongoDB). No afecta la evaluación.

**¿Es obligatorio Docker?**
No, pero suma puntos extra.

**¿Puedo usar librerías de UI?**
Sí. Recomendamos TailwindCSS para estilos, pero también puedes usar otras librerías de componentes (Material-UI, Ant Design, etc.).

---

## 🎉 ¡Buena suerte!

Recuerda: evaluamos no solo que funcione, sino **cómo está construido**. Demuestra tu criterio técnico y mejores prácticas.

Si tienes dudas sobre los requisitos, no dudes en contactarnos.

---

# 📖 Execution Instructions

## Prerequisites

- Node.js v22 (use nvm: `nvm use`)
- MySQL 8.0 or Docker
- npm or yarn

## Installation

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd Fullstack_Test_01

# Start all services with Docker Compose
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - API Documentation: http://localhost:3000/api-docs
```

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Use Node.js 22
nvm use

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# Update DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET

# Run database migrations
npm run migrate

# Seed database with test users (optional - auto-runs on server start)
npm run seed

# Start development server
npm run dev

# Or build and start production
npm run build
npm start
```

#### Frontend Setup

```bash
cd frontend

# Use Node.js 22
nvm use

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API URL (default: http://localhost:3000/api)

# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```

## Configuration

### Backend Environment Variables

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=project_management
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

## Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## API Documentation

Once the backend is running, access the Swagger documentation at:

- **Swagger UI**: http://localhost:3000/api-docs

## Test Credentials

The application includes seeded test users that are automatically created on first startup:

**Test User 1:**

- Email: `user1@example.com`
- Password: `123user1`

**Test User 2:**

- Email: `user2@example.com`
- Password: `123user2`

You can also create new accounts at: http://localhost:5173/register

## Project Structure

```
├── backend/                # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── database/      # DB connection and migrations
│   │   ├── middlewares/   # Auth, validation, error handling
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Helper functions
│   │   └── validators/    # Zod schemas
│   └── __tests__/         # Jest tests
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # API client and utilities
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   └── types/         # TypeScript types
│   └── tests/             # Vitest tests
└── docker-compose.yml     # Docker orchestration
```

## Requirements Compliance

This implementation fulfills **100% of the required functionalities**:

### ✅ 1. Authentication & Users

- **Backend**: User registration with validation ✓ | JWT login ✓ | Auth middleware ✓ | Password hashing ✓ | Profile endpoint ✓
- **Frontend**: Login/register forms with validation ✓ | Token storage ✓ | Protected routes ✓ | Auto-redirect ✓

### ✅ 2. Project Management

- **Backend**: Full CRUD ✓ | Owner-only edit/delete ✓ | Collaborator system ✓ | Pagination ✓
- **Frontend**: Responsive list ✓ | CRUD operations ✓ | Search & filters ✓ | Collaborator management ✓

### ✅ 3. Task Management

- **Backend**: Full CRUD ✓ | Status (pending/in_progress/completed) ✓ | Priority (low/medium/high) ✓ | Task assignment ✓ | Filters & sorting ✓
- **Frontend**: Task visualization ✓ | CRUD operations ✓ | Status changes ✓ | Interactive filters ✓ | User assignment ✓

### ✅ 4. Dashboard & Statistics

- **Backend**: Statistics endpoint (projects, tasks, status breakdown) ✓
- **Frontend**: Stats visualization ✓ | Activity summary ✓

### ✅ Bonus Points (All Implemented)

- **Docker** (+10%): Complete Docker Compose setup ✓
- **Tests** (+5%): Backend (Jest) + Frontend (Vitest) with 24 tests ✓
- **CI/CD** (+5%): GitHub Actions pipeline with automated tests & deployment ✓
- **Production Deploy** (+5%): Deployment guides for Railway/Vercel/AWS ✓

## Features Implemented

✅ User authentication (JWT)
✅ Project management (CRUD with owner permissions)
✅ Task management (CRUD with status & priority)
✅ Collaborator management (add/remove users)
✅ Task filtering and sorting (by status, priority, project, user)
✅ Dashboard with statistics (projects, tasks, breakdowns)
✅ Pagination (projects and tasks)
✅ Database seeding with test users
✅ API documentation (Swagger/OpenAPI at /api-docs)
✅ Comprehensive tests (24 tests: 5 backend + 5 frontend suites)
✅ Docker support (complete Docker Compose setup)
✅ CI/CD Pipeline (GitHub Actions with automated tests)
✅ Production deployment ready (guides for Railway/Vercel/AWS)
✅ Security best practices (JWT, bcrypt, Helmet, CORS, rate limiting)

## Tech Stack

**Backend:**

- Node.js 22 + Express + TypeScript
- MySQL with mysql2
- JWT authentication
- Zod validation
- Jest + Supertest for testing
- Swagger for API documentation

**Frontend:**

- React 18 + TypeScript + Vite
- Zustand for state management
- React Router v6 for routing
- Axios for HTTP requests
- TailwindCSS + shadcn/ui for styling
- React Hook Form for forms
- Vitest + React Testing Library for testing

**DevOps:**

- Docker + Docker Compose
- GitHub Actions for CI/CD
- Automated testing pipeline
- Production deployment ready (Railway/Vercel/AWS)

## CI/CD & Deployment

The project includes a complete CI/CD pipeline with GitHub Actions that:

- ✅ Runs automated tests on every push
- ✅ Builds backend and frontend
- ✅ Deploys to production on main branch

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
