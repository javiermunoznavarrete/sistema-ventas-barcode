# Guía de Uso - Gestión de Productos y Autocompletado

## Para el Jefe de Ventas

### Cómo Crear Productos (SKUs)

1. **Acceder al Panel de Jefe**:
   - Iniciar sesión con usuario: `jefe` / contraseña: `123`
   - Serás redirigido al panel de control

2. **Agregar un Nuevo Producto**:
   - En la sección "Gestión de Productos (SKUs)", haz clic en el botón **"Agregar Nuevo Producto"**
   - Se desplegará un formulario con los siguientes campos:
     - **Código SKU** (obligatorio): El código único del producto (se convertirá automáticamente a mayúsculas)
     - **Nombre del Producto** (obligatorio): Descripción del producto
     - **Precio Unitario** (obligatorio): Precio del producto en pesos chilenos
     - **Descripción** (opcional): Información adicional sobre el producto

3. **Guardar el Producto**:
   - Completa todos los campos obligatorios
   - Haz clic en **"Guardar Producto"**
   - Verás un mensaje de confirmación: "✅ Producto guardado exitosamente"
   - El producto aparecerá inmediatamente en la tabla de productos

4. **Ver Productos Registrados**:
   - Todos los productos se muestran en la tabla "Productos Registrados"
   - Columnas: Código SKU, Nombre, Precio, Descripción, Acciones

5. **Eliminar un Producto**:
   - En la tabla de productos, haz clic en el botón **"Eliminar"** del producto que deseas borrar
   - Se mostrará una confirmación: "¿Estás seguro de eliminar el producto [CÓDIGO]?"
   - Confirma para eliminar permanentemente el producto

### Ejemplos de Productos

```
Código: LECHE-1L
Nombre: Leche Entera 1 Litro
Precio: 1200
Descripción: Leche entera marca Colún

Código: PAN-HAL
Nombre: Pan Hallulla
Precio: 800
Descripción: Pan fresco del día

Código: ARROZ-5K
Nombre: Arroz Grado 2 - 5kg
Precio: 4500
Descripción: Saco de arroz de 5 kilos
```

## Para el Vendedor

### Cómo Usar el Autocompletado

1. **Acceder a la Interfaz de Vendedor**:
   - Iniciar sesión con usuario: `vendedor` / contraseña: `123`
   - Serás redirigido al formulario de registro de ventas

2. **Buscar un Producto**:
   - En el campo **"Código del Producto"**, comienza a escribir
   - El autocompletado funciona buscando por:
     - **Código del producto** (ej: escribe "LECHE" para ver todos los productos con "LECHE" en el código)
     - **Nombre del producto** (ej: escribe "Pan" para ver todos los productos con "Pan" en el nombre)

3. **Seleccionar un Producto**:
   - Aparecerá una lista desplegable con productos que coinciden con tu búsqueda
   - Cada producto muestra:
     - **Código** (en azul y negrita)
     - **Nombre**
     - **Precio** (en verde)
   - Haz clic en el producto deseado
   - Los campos se completarán automáticamente:
     - Código del Producto
     - Nombre del Producto
     - Precio Unitario
   - El cursor se moverá automáticamente al campo "Cantidad"

4. **Uso con Teclado** (opcional):
   - Escribe en el campo de código
   - Si solo hay una coincidencia, presiona **Enter** para seleccionarla
   - Usa la **Flecha Abajo** para navegar por las opciones

5. **Completar la Venta**:
   - Ingresa la cantidad
   - Haz clic en "Calcular Monto" para ver el total
   - Selecciona el tipo de documento (Boleta o Factura)
   - Haz clic en "Guardar Venta"

### Ejemplo de Flujo Completo

```
1. Escribir en "Código del Producto": "leche"
   → Aparece: LECHE-1L - Leche Entera 1 Litro [$1.200]

2. Hacer clic en la opción
   → Se completan automáticamente:
     - Código: LECHE-1L
     - Nombre: Leche Entera 1 Litro
     - Precio: 1200

3. Ingresar cantidad: 5

4. Calcular Monto
   → Subtotal: $6.000
   → IVA (19%): $1.140
   → Total: $7.140

5. Seleccionar "Boleta"

6. Guardar Venta
```

## Ventajas del Sistema

### Para el Jefe
- ✅ **Control centralizado**: Gestiona todos los productos desde un solo lugar
- ✅ **Precios consistentes**: Los vendedores usan siempre los precios correctos
- ✅ **Actualización inmediata**: Los cambios están disponibles al instante para todos
- ✅ **Menos errores**: Reduce errores de digitación en nombres y precios

### Para el Vendedor
- ✅ **Más rápido**: No necesitas recordar códigos exactos
- ✅ **Búsqueda flexible**: Busca por código o nombre
- ✅ **Sin errores de precio**: El precio se completa automáticamente
- ✅ **Interfaz intuitiva**: Similar al autocompletado de Google

## Almacenamiento

Los productos se guardan de la misma forma que las ventas:

- **Modo localStorage**: Los productos se guardan en el navegador local
- **Modo Firebase**: Los productos se sincronizan en la nube

El modo se configura en `config.js` con la variable `MODO_ALMACENAMIENTO`.

## Notas Importantes

1. **Códigos Únicos**: Cada producto debe tener un código SKU único
   - Si intentas guardar un producto con un código existente, se actualizará el producto anterior

2. **Mayúsculas Automáticas**: Los códigos se convierten automáticamente a mayúsculas
   - "leche-1l" se guardará como "LECHE-1L"

3. **Búsqueda Case-Insensitive**: El autocompletado no distingue entre mayúsculas y minúsculas
   - Puedes escribir "leche", "LECHE" o "Leche" y obtendrás los mismos resultados

4. **Productos Sin Registrar**: Si un producto no existe en el sistema, el vendedor puede:
   - Ingresar el código y nombre manualmente
   - El jefe puede agregarlo al sistema después

5. **Eliminación de Productos**:
   - Eliminar un producto NO elimina las ventas históricas que lo usaron
   - Solo evita que aparezca en el autocompletado futuro

## Solución de Problemas

### El autocompletado no aparece
- Verifica que haya productos registrados en el sistema
- Asegúrate de estar escribiendo en el campo "Código del Producto"
- Intenta recargar la página

### Los productos no se guardan
- Verifica que todos los campos obligatorios estén completos
- Revisa la consola del navegador (F12) para ver mensajes de error
- Confirma que `MODO_ALMACENAMIENTO` esté configurado correctamente en `config.js`

### El precio no se autocompleta
- Verifica que el producto tenga un precio asignado en la gestión de productos
- Intenta editar y volver a guardar el producto

### Productos duplicados
- Cada código SKU debe ser único
- Si ves duplicados, elimina uno y vuelve a crearlo con la información correcta
