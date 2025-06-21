# Sistema de Gestión de Sucursales - Para prueba Tecnica

Sistema completo de gestión de sucursales desarrollado con **React** (frontend) y **Node.js + Express** (backend). Permite administrar información de sucursales con funcionalidades CRUD completas, búsqueda avanzada y interfaz moderna.

## 📋 Características Principales

- ✨ **Gestión Completa de Sucursales**: Crear, leer, actualizar y eliminar sucursales
- 🔍 **Búsqueda Inteligente**: Buscar sucursales por ID, incluso las eliminadas
- 🎨 **Interfaz Moderna**: Diseño responsive con componentes reutilizables
- 🗄️ **Base de Datos SQL Server**: Persistencia robusta con Sequelize ORM
- 🔄 **API RESTful**: Endpoints organizados y documentados
- 📱 **Responsive Design**: Optimizado para móviles, tablets y desktop
- 🚫 **Soft Delete**: Eliminación suave con posibilidad de recuperación
- ⚡ **Tiempo Real**: Actualizaciones inmediatas en la interfaz

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express 4.21.2** - Framework web minimalista
- **Sequelize 6.37.7** - ORM para SQL Server
- **SQL Server** - Base de datos principal
- **CORS** - Manejo de políticas de origen cruzado
- **dotenv** - Gestión de variables de entorno

### Frontend
- **React 19.1.0** - Biblioteca de interfaz de usuario
- **Axios 1.10.0** - Cliente HTTP para API
- **CSS3** - Estilos modernos con variables CSS
- **Create React App** - Configuración y herramientas

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- SQL Server
- npm o yarn
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/sistema-gestion-sucursales.git
cd sistema-gestion-sucursales
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend`:
```env
# Configuración de Base de Datos
DB_NAME=SucursalesDB
DB_USER=tu_usuario_sql_server
DB_PASSWORD=tu_contraseña_sql_server
DB_HOST=localhost
DB_PORT=1433
DB_DIALECT=mssql

# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de Sincronización (opcional)
DB_FORCE_SYNC=false
DB_ALTER_SYNC=false
```

### 3. Configurar SQL Server
```sql
-- Crear la base de datos (las tablas se crean automáticamente)
CREATE DATABASE SucursalesDB;
```

### 4. Configurar el Frontend
```bash
cd frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend`:
```env
# URL de la API
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_API_TIMEOUT=10000
REACT_APP_SUCURSALES_ENDPOINT=/sucursales

# Debug (opcional)
REACT_APP_DEBUG=false
```

### 5. Ejecutar el Proyecto

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Documentación API**: http://localhost:3000/api

## 🚀 Scripts Disponibles

### Backend
```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo con nodemon
```

### Frontend
```bash
npm start          # Ejecutar en desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar tests
```

## 📡 API Endpoints

### Sucursales
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/sucursales` | Obtener todas las sucursales |
| `GET` | `/api/sucursales/:id` | Obtener sucursal por ID |
| `POST` | `/api/sucursales` | Crear nueva sucursal |
| `PUT` | `/api/sucursales/:id` | Actualizar sucursal |
| `DELETE` | `/api/sucursales/:id` | Eliminar sucursal (soft delete) |
| `PATCH` | `/api/sucursales/:id/reactivar` | Reactivar sucursal eliminada |

### Ejemplo de Uso

**Crear una nueva sucursal:**
```bash
curl -X POST http://localhost:3000/api/sucursales \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Sucursal Central",
    "direccion": "5ta Avenida 12-34, Zona 1, Ciudad de Guatemala",
    "telefono": "2234-5678",
    "activo": true
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Sucursal creada exitosamente",
  "data": {
    "id": 1,
    "nombre": "Sucursal Central",
    "direccion": "5ta Avenida 12-34, Zona 1, Ciudad de Guatemala",
    "telefono": "2234-5678",
    "activo": true,
    "createdAt": "2025-01-20T10:30:00.000Z",
    "updatedAt": "2025-01-20T10:30:00.000Z"
  }
}
```

## 🏗️ Estructura del Proyecto

```
proyecto/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Configuración de Sequelize
│   │   ├── controllers/
│   │   │   └── sucursalcontrollers.js
│   │   ├── models/
│   │   │   └── sucursal.js          # Modelo de Sucursal
│   │   ├── routes/
│   │   │   └── sucursales.js        # Rutas de la API
│   │   ├── app.js                   # Configuración de Express
│   │   └── index.js                 # Punto de entrada
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Componentes reutilizables
│   │   │   ├── layout/              # Componentes de layout
│   │   │   └── sucursales/          # Componentes específicos
│   │   ├── hooks/                   # Custom hooks
│   │   ├── services/                # Servicios de API
│   │   ├── styles/                  # Archivos CSS
│   │   ├── utils/                   # Utilidades y helpers
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🎯 Funcionalidades Detalladas

### Gestión de Sucursales
- **Crear**: Formulario validado para nueva sucursal
- **Visualizar**: Cards responsives con información completa
- **Editar**: Modal de edición con datos pre-cargados
- **Eliminar**: Soft delete con confirmación
- **Filtrar**: Por estado (activas/inactivas/todas)

### Búsqueda Avanzada
- Buscar sucursales por ID
- Recuperar sucursales eliminadas automáticamente
- Feedback visual del estado de la búsqueda

### Validaciones
- **Nombre**: 3-100 caracteres, único
- **Dirección**: 5-255 caracteres
- **Teléfono**: Formatos guatemaltecos válidos
- **Estado**: Activo/Inactivo

### UX/UI
- Diseño moderno y limpio
- Indicadores de carga
- Mensajes de éxito/error claros
- Responsive en todos los dispositivos
- Transiciones suaves

## 🔧 Personalización

### Cambiar Colores del Tema
Edita las variables CSS en `frontend/src/styles/globals.css`:

```css
:root {
  --primary-color: #2563eb;    /* Color principal */
  --success-color: #16a34a;    /* Color de éxito */
  --danger-color: #dc2626;     /* Color de peligro */
  /* ... más variables */
}
```

### Agregar Nuevos Campos
1. Actualizar el modelo en `backend/src/models/sucursal.js`
2. Modificar el formulario en `frontend/src/components/sucursales/SucursalForm.js`
3. Actualizar las validaciones en `frontend/src/utils/validators.js`

## 🐛 Solución de Problemas

### Error de Conexión a SQL Server
```bash
# Verificar que SQL Server esté ejecutándose
services.msc
# Buscar "SQL Server" y verificar que esté iniciado

# Verificar conectividad
telnet localhost 1433
```

### Error de CORS
```javascript
// En backend/src/app.js, verificar configuración:
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

### Puerto en Uso
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000
# Terminar proceso
taskkill /PID <PID> /F
```

## 🧪 Testing

### Ejecutar Tests del Frontend
```bash
cd frontend
npm test
```

### Probar API con Postman
Importa la colección de Postman desde:
*[Enlace a colección de Postman si está disponible]*

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Autenticación y autorización
- [ ] Roles de usuario (Admin, Editor, Viewer)
- [ ] Exportación a PDF/Excel
- [ ] Dashboard con estadísticas
- [ ] Historial de cambios
- [ ] Geolocalización de sucursales
- [ ] API de notificaciones
- [ ] Tests automatizados

### Mejoras Técnicas
- [ ] Docker containerization
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo con logs
- [ ] Cache con Redis
- [ ] Documentación con Swagger

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución
- Seguir las convenciones de código existentes
- Agregar tests para nuevas funcionalidades
- Actualizar la documentación
- Usar commits descriptivos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [Dieguizus](https://github.com/Dieguizus)

## 🙏 Agradecimientos

- React team por la excelente biblioteca
- Express.js por el framework backend
- Sequelize por el ORM robusto
- Microsoft por SQL Server
- Comunidad open source

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: reyesdonaldo15@gmail.com
---

⭐ **¡No olvides dar una estrella al repo si te fue útil!** ⭐
