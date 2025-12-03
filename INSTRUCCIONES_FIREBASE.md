# Instrucciones para Configurar Firebase

## Paso 1: Crear un Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto (ejemplo: "sistema-ventas")
4. Sigue los pasos del asistente
5. Una vez creado, ve al panel del proyecto

## Paso 2: Configurar Firestore Database

1. En el menú lateral, ve a **Build** → **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona el modo:
   - **Modo de prueba** (para desarrollo): Permite leer/escribir por 30 días
   - **Modo de producción**: Requiere configurar reglas de seguridad
4. Selecciona la ubicación (ejemplo: `southamerica-east1` para Chile)
5. Haz clic en "Habilitar"

## Paso 3: Obtener la Configuración de Firebase

1. En el panel de Firebase, haz clic en el ícono de **engranaje ⚙️** → **Configuración del proyecto**
2. Desplázate hacia abajo hasta "Tus apps"
3. Haz clic en el ícono **</>** (Web)
4. Registra tu app (ejemplo: "Sistema Ventas Web")
5. **NO** marques "También configurar Firebase Hosting"
6. Haz clic en "Registrar app"
7. Copia la configuración que aparece (se ve así):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  databaseURL: "https://tu-proyecto.firebaseio.com"
};
```

## Paso 4: Configurar el Archivo config.js

1. Abre el archivo `config.js` en tu proyecto
2. Reemplaza los valores de `firebaseConfig` con los que copiaste de Firebase
3. Cambia `MODO_ALMACENAMIENTO` de `"localStorage"` a `"firebase"`:

```javascript
const MODO_ALMACENAMIENTO = "firebase"; // Cambiar de "localStorage" a "firebase"
```

4. Guarda el archivo

## Paso 5: Configurar Reglas de Seguridad (Opcional pero Recomendado)

Para producción, configura las reglas de seguridad en Firestore:

1. Ve a **Firestore Database** → pestaña **Reglas**
2. Reemplaza el contenido con estas reglas básicas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura de ventas
    match /ventas/{ventaId} {
      allow read, write: if true; // Cambiar esto por autenticación real
    }

    // Permitir lectura/escritura de usuarios
    match /usuarios/{usuarioId} {
      allow read, write: if true; // Cambiar esto por autenticación real
    }

    // Permitir lectura/escritura de control de día
    match /control_dia/{diaId} {
      allow read, write: if true; // Cambiar esto por autenticación real
    }
  }
}
```

3. Haz clic en "Publicar"

**⚠️ IMPORTANTE**: Las reglas anteriores permiten acceso total. Para producción real, implementa autenticación de Firebase.

## Paso 6: Probar la Conexión

1. Abre `index.html` en tu navegador
2. Abre la **Consola de Desarrollador** (F12)
3. Deberías ver el mensaje: `✅ Firebase inicializado correctamente`
4. Si ves errores, verifica:
   - Que la configuración en `config.js` sea correcta
   - Que tengas conexión a internet
   - Que Firestore esté habilitado en Firebase Console

## Estructura de Datos en Firestore

El sistema creará estas colecciones automáticamente:

### Colección: `ventas`
```javascript
{
  codigo: "ABC123",
  nombre: "Producto Ejemplo",
  cantidad: 5,
  precio: 10000,
  subtotal: 50000,
  iva: 9500,
  total: 59500,
  tipo: "boleta", // o "factura"
  fecha: "24/01/2025 14:30",
  timestamp: [Firestore Timestamp],
  fechaCreacion: "2025-01-24T14:30:00.000Z",
  // Solo para facturas:
  rut: "12.345.678-9",
  razon: "Empresa S.A.",
  giro: "Comercio",
  direccion: "Calle 123"
}
```

### Colección: `usuarios` (para futuro)
```javascript
{
  nombre: "vendedor",
  password: "123",
  rol: "vendedor"
}
```

### Colección: `control_dia`
```javascript
{
  estado: "ABIERTO", // o "CERRADO"
  fecha: "2025-01-24",
  timestamp: [Firestore Timestamp]
}
```

## Migrar Datos desde localStorage (Opcional)

Si ya tienes datos en localStorage y quieres migrarlos a Firebase:

1. Abre la Consola de Desarrollador (F12) en la página de jefe
2. Ejecuta este código:

```javascript
// Obtener ventas de localStorage
const ventasLocal = JSON.parse(localStorage.getItem("ventas")) || [];

// Migrar a Firebase
ventasLocal.forEach(async (venta) => {
  await guardarVentaFirebase(venta);
});

console.log("Migración completada");
```

## Solución de Problemas

### Error: "Firebase is not defined"
- Verifica que los scripts de Firebase se carguen antes que `config.js` y `firebase.js`
- Revisa la consola del navegador para ver si hay errores de red

### Error: "Permission denied"
- Revisa las reglas de seguridad en Firestore
- Asegúrate de que las colecciones tengan permisos de lectura/escritura

### Las ventas no se guardan
- Abre la consola del navegador y busca mensajes de error
- Verifica que `MODO_ALMACENAMIENTO` esté configurado como `"firebase"`
- Revisa que la configuración de Firebase sea correcta

### Cambiar entre localStorage y Firebase
Para volver a usar localStorage temporalmente:
```javascript
const MODO_ALMACENAMIENTO = "localStorage";
```

## Próximos Pasos Recomendados

1. **Implementar autenticación real** con Firebase Authentication
2. **Configurar reglas de seguridad** basadas en usuarios autenticados
3. **Agregar validación de RUT** chileno para facturas
4. **Implementar backup automático** de datos
5. **Crear panel de administración** para gestionar usuarios
