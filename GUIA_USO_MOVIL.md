# Guía de Uso Móvil y Escáner de Códigos de Barras

## 📱 Compatibilidad Móvil

El sistema está completamente optimizado para dispositivos móviles (smartphones y tablets).

### ✅ Características Móviles

1. **Diseño Responsive**
   - Se adapta automáticamente a cualquier tamaño de pantalla
   - Optimizado para pantallas desde 320px hasta tablets
   - Elementos táctiles de tamaño adecuado (mínimo 44x44px)

2. **Meta Viewport Configurado**
   - Escala inicial correcta
   - No permite zoom accidental
   - Optimizado para pantallas retina

3. **Inputs Optimizados**
   - Tamaño de fuente 16px para evitar zoom en iOS
   - Padding generoso para dedos
   - Tipos de teclado apropiados

4. **Botones Grandes**
   - Fáciles de presionar con el dedo
   - Espaciado adecuado entre botones
   - Feedback visual claro

---

## 📸 Escáner de Códigos de Barras

### Requisitos

- **Dispositivo:** Smartphone o tablet con cámara
- **Navegador:** Chrome, Safari, Firefox, Edge (versiones modernas)
- **Permisos:** Acceso a la cámara (el navegador pedirá permiso)

### Formatos de Códigos Soportados

✅ **EAN-13** (código de barras estándar europeo - 13 dígitos)
✅ **EAN-8** (código de barras corto - 8 dígitos)
✅ **UPC-A** (código de barras norteamericano - 12 dígitos)
✅ **UPC-E** (UPC corto - 6 dígitos)
✅ **Code 128** (código alfanumérico)
✅ **Code 39** (código alfanumérico antiguo)
✅ **Code 93** (código alfanumérico)
✅ **ITF** (Interleaved 2 of 5)

---

## 🎯 Cómo Usar el Escáner

### Paso 1: Acceder a la Función

1. Inicia sesión como **Vendedor** (`vendedor` / `123`)
2. En el formulario de ventas, verás el campo "Código del Producto"
3. Al lado del campo hay un **botón morado con ícono de cámara** 📷

### Paso 2: Activar la Cámara

1. Haz clic en el **botón de cámara** (morado)
2. El navegador pedirá permiso para usar la cámara
3. Autoriza el acceso
4. Se abrirá el escáner en pantalla completa

### Paso 3: Escanear el Código

1. Apunta la cámara hacia el código de barras
2. Mantén el código dentro del recuadro marcado
3. Asegúrate de tener buena iluminación
4. El sistema escaneará automáticamente cuando detecte el código

### Paso 4: Resultado del Escaneo

**Si el producto está registrado:**
- ✅ El código se autocompleta
- ✅ El nombre se autocompleta
- ✅ El precio se autocompleta
- ✅ Aparece notificación: "Producto encontrado: [nombre]"
- ✅ El teléfono vibra (si está soportado)
- ✅ El cursor se mueve al campo "Cantidad"

**Si el producto NO está registrado:**
- ⚠️ Solo se llena el campo "Código"
- ⚠️ Aparece notificación: "Código escaneado. Complete los datos manualmente."
- ⚠️ El cursor se mueve al campo "Nombre"
- Debes completar manualmente: nombre, precio

---

## 💡 Consejos para un Escaneo Exitoso

### Iluminación
- ✅ Escanea en lugares bien iluminados
- ✅ Evita sombras sobre el código
- ✅ Usa la linterna del escáner si está disponible
- ❌ Evita luz directa que cause reflejos

### Distancia
- ✅ Mantén el código a 10-15 cm de la cámara
- ✅ Ajusta la distancia si no escanea
- ❌ No acerques demasiado (se verá borroso)
- ❌ No alejes mucho (el código será muy pequeño)

### Posición
- ✅ Mantén el código horizontal y centrado
- ✅ Asegúrate de que el código completo esté visible
- ❌ Evita ángulos inclinados
- ❌ No cortes parte del código

### Calidad del Código
- ✅ Códigos impresos con buena calidad
- ✅ Códigos sin arrugas ni daños
- ❌ Códigos borrosos o descoloridos pueden fallar
- ❌ Códigos en superficies curvas son más difíciles

---

## 🔧 Funciones del Escáner

### Selección de Cámara

Si tu dispositivo tiene múltiples cámaras:
1. Verás un selector en la parte superior del escáner
2. Puedes cambiar entre cámara frontal y trasera
3. El sistema recuerda tu preferencia

### Linterna/Flash

En dispositivos compatibles:
- Aparecerá un botón de linterna 🔦
- Úsalo en ambientes oscuros
- Se apaga automáticamente al cerrar el escáner

### Cerrar el Escáner

Tres formas de cerrar:
1. **Botón X** en la esquina superior derecha
2. **Después de escanear** exitosamente (cierra automático)
3. **Clic fuera del modal** (en el fondo oscuro)

---

## 📱 Compatibilidad por Navegador

| Navegador | Móvil | Desktop | Notas |
|-----------|-------|---------|-------|
| Chrome | ✅ | ✅ | Mejor soporte |
| Safari (iOS) | ✅ | ✅ | Requiere iOS 11+ |
| Firefox | ✅ | ✅ | Requiere permisos |
| Edge | ✅ | ✅ | Compatible |
| Samsung Internet | ✅ | - | Compatible |
| Opera | ⚠️ | ⚠️ | Puede variar |

### Notas Importantes

**iOS (iPhone/iPad):**
- Requiere iOS 11 o superior
- Safari es recomendado
- Debe usarse HTTPS en producción

**Android:**
- Chrome es recomendado
- Requiere Android 5.0+
- La mayoría de navegadores modernos funcionan

**Permisos de Cámara:**
- Solo se piden cuando abres el escáner
- Puedes revocar permisos en configuración del navegador
- Si deneg aste permisos, debes habilitarlos manualmente

---

## 🛠️ Solución de Problemas

### El escáner no se abre

**Problema:** Al hacer clic en el botón de cámara no pasa nada.

**Soluciones:**
1. Verifica que estés usando un navegador compatible
2. Asegúrate de tener conexión a internet (para cargar la librería)
3. Recarga la página (F5 o Ctrl+R)
4. Limpia el caché del navegador

### No detecta el código

**Problema:** La cámara funciona pero no escanea el código.

**Soluciones:**
1. Mejora la iluminación
2. Ajusta la distancia (10-15 cm)
3. Mantén el teléfono firme
4. Asegúrate de que el código esté completo en pantalla
5. Prueba con otro código de barras
6. Verifica que el formato sea soportado

### El navegador no pide permiso de cámara

**Problema:** No aparece el popup de permisos.

**Soluciones:**
1. **Chrome:** Configuración → Privacidad → Permisos del sitio → Cámara
2. **Safari:** Configuración → Safari → Cámara → Permitir
3. Prueba con otro navegador
4. Verifica que no hayas bloqueado permisos previamente

### La cámara se ve negra

**Problema:** El escáner se abre pero la cámara está negra.

**Soluciones:**
1. Cierra otras apps que usen la cámara
2. Reinicia el navegador
3. Reinicia el dispositivo
4. Verifica que la cámara funcione en otras apps
5. Revoca y vuelve a dar permisos

### El código se escanea pero no autocompleta

**Problema:** Lee el código pero no llena los campos.

**Verificaciones:**
1. ¿El producto está registrado en el sistema?
2. ¿El código en el sistema coincide exactamente?
3. Verifica en Panel del Jefe → Productos Registrados
4. Los códigos distinguen mayúsculas/minúsculas

**Solución si el producto no está registrado:**
1. El código se llenará automáticamente
2. Completa nombre y precio manualmente
3. Después puedes pedirle al jefe que lo agregue al sistema

---

## 🎯 Flujo Completo: Venta con Escáner

### Ejemplo Práctico

```
1. Vendedor recibe cliente con producto

2. Hace clic en botón de cámara 📷

3. Apunta hacia el código de barras

4. Sistema escanea: "8412345678901" (EAN-13)

5. Producto encontrado: "Leche Entera 1L"
   ✅ Código: 8412345678901
   ✅ Nombre: Leche Entera 1L
   ✅ Precio: $1.200

6. Vendedor ingresa cantidad: 2

7. Hace clic en "Calcular Monto"
   Subtotal: $2.400
   IVA: $456
   Total: $2.856

8. Selecciona tipo: Boleta

9. Hace clic en "Guardar Venta"

10. Confirma en el modal

11. ✅ Venta guardada
```

---

## 📊 Ventajas del Escáner Móvil

| Ventaja | Descripción |
|---------|-------------|
| **Rapidez** | Escanear es 10x más rápido que escribir |
| **Precisión** | Elimina errores de digitación |
| **Comodidad** | No necesitas recordar códigos |
| **Profesional** | Sistema moderno y eficiente |
| **Multiplataforma** | Funciona en cualquier smartphone |

---

## 🔒 Seguridad y Privacidad

### Permisos de Cámara

- ✅ Solo se usa para escanear códigos
- ✅ No se graban videos ni fotos
- ✅ No se envía información a servidores externos
- ✅ El procesamiento es 100% local en tu dispositivo
- ✅ Puedes revocar permisos en cualquier momento

### Datos del Escáner

- La librería html5-qrcode es de código abierto
- No recopila información personal
- Todo el procesamiento es en el navegador
- No requiere registro ni cuenta

---

## 📱 Uso en Diferentes Dispositivos

### iPhone/iPad

1. Abre Safari (recomendado)
2. Navega a la aplicación
3. Login como vendedor
4. Usa el escáner normalmente
5. Autoriza acceso a cámara cuando se solicite

**Opcional:** Agregar a pantalla de inicio
- Abre en Safari
- Toca el botón "Compartir"
- Selecciona "Agregar a pantalla de inicio"
- La app se comportará como nativa

### Android

1. Abre Chrome (recomendado)
2. Navega a la aplicación
3. Login como vendedor
4. Usa el escáner normalmente
5. Autoriza acceso a cámara cuando se solicite

**Opcional:** Agregar a pantalla de inicio
- Abre en Chrome
- Toca los tres puntos
- Selecciona "Agregar a pantalla de inicio"
- Funciona como app instalada

### Tablet

- Funciona igual que en smartphones
- Pantalla más grande facilita el escaneo
- Ideal para mostrar al cliente el total

---

## 💻 Uso en Desktop (Computadora)

El escáner también funciona en computadoras con webcam:

1. Abre el navegador (Chrome recomendado)
2. Login como vendedor
3. Haz clic en el botón de cámara
4. Autoriza acceso a webcam
5. Sostén el producto frente a la cámara

**Nota:** En desktop es más práctico escribir el código, pero el escáner puede usarse si:
- Tienes muchos productos para escanear
- Usas un lector de código de barras USB (no requiere escáner)
- Prefieres no escribir

---

## 🎓 Mejores Prácticas

### Para Vendedores

1. **Mantén el teléfono firme** mientras escaneas
2. **Usa buena iluminación** para escaneos más rápidos
3. **Práctica** con varios productos para ganar velocidad
4. **Limpia la lente** de la cámara regularmente
5. **Cierra otras apps** para mejor rendimiento

### Para Jefes

1. **Registra todos los productos** con sus códigos exactos
2. **Verifica los códigos** antes de guardar productos
3. **Usa códigos estándar** (EAN-13 preferiblemente)
4. **Capacita a los vendedores** en el uso del escáner
5. **Ten códigos impresos** de respaldo por si falla el escáner

---

## 🆘 Soporte

### Si tienes problemas:

1. **Revisa esta guía** - La mayoría de problemas están cubiertos
2. **Prueba en otro navegador** - Chrome suele funcionar mejor
3. **Verifica permisos** - La cámara debe estar autorizada
4. **Actualiza el navegador** - Usa la versión más reciente
5. **Contacta soporte técnico** - Si nada funciona

### Información del Sistema

Para reportar un problema, incluye:
- Modelo del dispositivo (ej: iPhone 12, Samsung Galaxy S21)
- Navegador y versión (ej: Chrome 120, Safari 16)
- Sistema operativo (ej: iOS 17, Android 13)
- Descripción del problema
- Capturas de pantalla si es posible

---

## ✨ Conclusión

El escáner de códigos de barras convierte tu smartphone en una herramienta profesional de punto de venta. Con práctica, podrás registrar ventas en segundos, mejorando la experiencia del cliente y reduciendo errores.

**¡Felices ventas! 🎉**
