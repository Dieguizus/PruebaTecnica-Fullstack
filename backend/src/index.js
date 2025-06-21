const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        console.log('🔄 Iniciando servidor...');
        
        // Probar la conexión a la base de datos
        console.log('🔗 Probando conexión a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
        
        // Mostrar información de la base de datos
        console.log('📊 Información de la base de datos:');
        console.log('Host:', process.env.DB_HOST);
        console.log('Puerto:', process.env.DB_PORT);
        console.log('Base de datos:', process.env.DB_NAME);
        console.log('Usuario:', process.env.DB_USER);
        
        // Verificar si la tabla existe
        console.log('🔍 Verificando si la tabla sucursales existe...');
        try {
            const [results] = await sequelize.query(`
                SELECT COUNT(*) as count 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME = 'sucursales'
            `);
            
            const tablaExiste = results[0].count > 0;
            console.log('Tabla sucursales existe:', tablaExiste ? 'SÍ' : 'NO');
            
            if (!tablaExiste) {
                console.log('⚠️ La tabla no existe, será creada automáticamente');
            }
        } catch (error) {
            console.log('⚠️ No se pudo verificar la tabla, será creada si no existe');
        }
        
        // Sincronizar modelos con la base de datos
        const forceSync = process.env.DB_FORCE_SYNC === 'true';
        const alterSync = process.env.DB_ALTER_SYNC === 'true';
        
        console.log('🔧 Configuración de sincronización:');
        console.log('Force Sync (recrear tablas):', forceSync);
        console.log('Alter Sync (modificar estructura):', alterSync);
        
        if (forceSync) {
            console.log('⚠️ ADVERTENCIA: Recreando todas las tablas (se perderán los datos)');
            await sequelize.sync({ force: true });
            console.log('✅ Tablas recreadas en la base de datos');
            
            // Insertar datos de prueba
            console.log('📝 Insertando datos de prueba...');
            const Sucursal = require('./models/sucursal');
            
            const sucursalesPrueba = [
                {
                    nombre: 'Sucursal Central',
                    direccion: '5ta Avenida 12-34, Zona 1, Ciudad de Guatemala',
                    telefono: '2234-5678',
                    activo: true
                },
                {
                    nombre: 'Sucursal Norte',
                    direccion: 'Calzada Roosevelt 15-25, Zona 7, Guatemala',
                    telefono: '2345-6789',
                    activo: true
                }
            ];
            
            for (const sucursal of sucursalesPrueba) {
                await Sucursal.create(sucursal);
                console.log(`✅ Sucursal "${sucursal.nombre}" creada`);
            }
            
        } else if (alterSync) {
            console.log('🔄 Alterando tablas existentes para coincidir con los modelos');
            await sequelize.sync({ alter: true });
            console.log('✅ Tablas alteradas en la base de datos');
        } else {
            console.log('🔄 Sincronizando modelos (sin modificar estructura existente)');
            await sequelize.sync();
            console.log('✅ Modelos sincronizados con la base de datos');
        }
        
        // Verificar la estructura de la tabla creada
        console.log('🔍 Verificando estructura de la tabla sucursales:');
        try {
            const [columns] = await sequelize.query(`
                SELECT 
                    COLUMN_NAME,
                    DATA_TYPE,
                    IS_NULLABLE,
                    CHARACTER_MAXIMUM_LENGTH,
                    COLUMN_DEFAULT
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'sucursales'
                ORDER BY ORDINAL_POSITION
            `);
            
            console.log('📋 Columnas de la tabla sucursales:');
            columns.forEach(col => {
                console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE}${col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'}`);
            });
            
        } catch (error) {
            console.log('⚠️ No se pudo verificar la estructura de la tabla:', error.message);
        }
        
        // Probar una consulta simple
        console.log('🧪 Probando consulta a la tabla sucursales...');
        try {
            const Sucursal = require('./models/sucursal');
            const count = await Sucursal.count();
            console.log(`✅ Consulta exitosa: ${count} sucursales en la tabla`);
        } catch (error) {
            console.log('❌ Error en consulta de prueba:', error.message);
        }
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`📖 Endpoints disponibles:`);
            console.log(`   GET    /api/health - Health check`);
            console.log(`   GET    /api/sucursales - Obtener todas las sucursales`);
            console.log(`   GET    /api/sucursales/:id - Obtener sucursal por ID`);
            console.log(`   POST   /api/sucursales - Crear nueva sucursal`);
            console.log(`   PUT    /api/sucursales/:id - Actualizar sucursal`);
            console.log(`   DELETE /api/sucursales/:id - Desactivar sucursal`);
            console.log(`   PATCH  /api/sucursales/:id/reactivar - Reactivar sucursal`);
            console.log(`\n✅ Servidor listo para recibir peticiones`);
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        console.error('Stack completo:', error.stack);
        
        if (error.name === 'ConnectionError') {
            console.error('\n🔧 SUGERENCIAS PARA PROBLEMAS DE CONEXIÓN:');
            console.error('1. Verificar que SQL Server esté ejecutándose');
            console.error('2. Verificar las credenciales en el archivo .env');
            console.error('3. Verificar que la base de datos "sucursales_db" exista');
            console.error('4. Verificar la configuración de firewall/puertos');
        }
        
        process.exit(1);
    }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\n🔄 Cerrando servidor...');
    try {
        await sequelize.close();
        console.log('✓ Conexión a base de datos cerrada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al cerrar:', error);
        process.exit(1);
    }
});

startServer();