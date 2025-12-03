// ===== FUNCIONES DE FIREBASE =====

let db = null;
let app = null;

// Inicializar Firebase
function inicializarFirebase() {
  try {
    // Inicializar Firebase App
    app = firebase.initializeApp(firebaseConfig);

    // Obtener referencia a Firestore
    db = firebase.firestore();

    console.log("✅ Firebase inicializado correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error al inicializar Firebase:", error);
    return false;
  }
}

// ===== FUNCIONES DE VENTAS =====

// Guardar una venta en Firebase
async function guardarVentaFirebase(venta) {
  try {
    const docRef = await db.collection("ventas").add({
      ...venta,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      fechaCreacion: new Date().toISOString()
    });

    console.log("✅ Venta guardada con ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Error al guardar venta:", error);
    return { success: false, error: error.message };
  }
}

// Obtener todas las ventas de Firebase
async function obtenerVentasFirebase() {
  try {
    const snapshot = await db.collection("ventas")
      .orderBy("timestamp", "desc")
      .get();

    const ventas = [];
    snapshot.forEach(doc => {
      ventas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Se obtuvieron ${ventas.length} ventas de Firebase`);
    return ventas;
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    return [];
  }
}

// Obtener ventas del día actual
async function obtenerVentasDelDia() {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const snapshot = await db.collection("ventas")
      .where("timestamp", ">=", hoy)
      .orderBy("timestamp", "desc")
      .get();

    const ventas = [];
    snapshot.forEach(doc => {
      ventas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Se obtuvieron ${ventas.length} ventas del día`);
    return ventas;
  } catch (error) {
    console.error("❌ Error al obtener ventas del día:", error);
    return [];
  }
}

// Eliminar una venta
async function eliminarVentaFirebase(ventaId) {
  try {
    await db.collection("ventas").doc(ventaId).delete();
    console.log("✅ Venta eliminada:", ventaId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error al eliminar venta:", error);
    return { success: false, error: error.message };
  }
}

// ===== FUNCIONES DE USUARIOS =====

// Guardar/Actualizar usuario en Firebase
async function guardarUsuarioFirebase(usuario) {
  try {
    await db.collection("usuarios").doc(usuario.nombre).set(usuario, { merge: true });
    console.log("✅ Usuario guardado:", usuario.nombre);
    return { success: true };
  } catch (error) {
    console.error("❌ Error al guardar usuario:", error);
    return { success: false, error: error.message };
  }
}

// Obtener usuario por nombre
async function obtenerUsuarioFirebase(nombreUsuario) {
  try {
    const doc = await db.collection("usuarios").doc(nombreUsuario).get();

    if (doc.exists) {
      return { success: true, usuario: doc.data() };
    } else {
      return { success: false, error: "Usuario no encontrado" };
    }
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    return { success: false, error: error.message };
  }
}

// ===== FUNCIONES DE CONTROL DE DÍA =====

// Guardar estado del día en Firebase
async function guardarEstadoDiaFirebase(estado) {
  try {
    const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    await db.collection("control_dia").doc(fecha).set({
      estado: estado, // "ABIERTO" o "CERRADO"
      fecha: fecha,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log("✅ Estado del día guardado:", estado);
    return { success: true };
  } catch (error) {
    console.error("❌ Error al guardar estado del día:", error);
    return { success: false, error: error.message };
  }
}

// Obtener estado del día actual de Firebase
async function obtenerEstadoDiaFirebase() {
  try {
    const fecha = new Date().toISOString().split('T')[0];
    const doc = await db.collection("control_dia").doc(fecha).get();

    if (doc.exists) {
      return { success: true, estado: doc.data().estado };
    } else {
      return { success: true, estado: "ABIERTO" }; // Por defecto abierto
    }
  } catch (error) {
    console.error("❌ Error al obtener estado del día:", error);
    return { success: false, error: error.message };
  }
}

// Guardar estado del día (wrapper - usa Firebase o localStorage)
async function guardarEstadoDia(estado) {
  if (MODO_ALMACENAMIENTO === "firebase") {
    return await guardarEstadoDiaFirebase(estado);
  } else {
    // Modo localStorage
    const fecha = new Date().toISOString().split('T')[0];
    const controlDia = {
      estado: estado,
      fecha: fecha
    };
    localStorage.setItem("control_dia", JSON.stringify(controlDia));
    console.log("✅ Estado del día guardado (localStorage):", estado);
    return { success: true };
  }
}

// Obtener estado del día (wrapper - usa Firebase o localStorage)
async function obtenerEstadoDia() {
  if (MODO_ALMACENAMIENTO === "firebase") {
    return await obtenerEstadoDiaFirebase();
  } else {
    // Modo localStorage
    const controlDia = JSON.parse(localStorage.getItem("control_dia"));
    const fecha = new Date().toISOString().split('T')[0];

    if (controlDia && controlDia.fecha === fecha) {
      return { success: true, estado: controlDia.estado };
    } else {
      // Si no hay datos o es de otro día, el día está abierto por defecto
      return { success: true, estado: "ABIERTO" };
    }
  }
}

// ===== FUNCIONES DE PRODUCTOS/SKUs =====

// Guardar un producto en Firebase
async function guardarProductoFirebase(producto) {
  try {
    const docRef = await db.collection("productos").doc(producto.codigo).set({
      ...producto,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      fechaCreacion: new Date().toISOString()
    });

    console.log("✅ Producto guardado:", producto.codigo);
    return { success: true };
  } catch (error) {
    console.error("❌ Error al guardar producto:", error);
    return { success: false, error: error.message };
  }
}

// Obtener todos los productos de Firebase
async function obtenerProductosFirebase() {
  try {
    const snapshot = await db.collection("productos")
      .orderBy("codigo", "asc")
      .get();

    const productos = [];
    snapshot.forEach(doc => {
      productos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Se obtuvieron ${productos.length} productos de Firebase`);
    return productos;
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return [];
  }
}

// Eliminar un producto
async function eliminarProductoFirebase(codigoProducto) {
  try {
    await db.collection("productos").doc(codigoProducto).delete();
    console.log("✅ Producto eliminado:", codigoProducto);
    return { success: true };
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    return { success: false, error: error.message };
  }
}

// Buscar producto por código
async function buscarProductoPorCodigoFirebase(codigo) {
  try {
    const doc = await db.collection("productos").doc(codigo).get();

    if (doc.exists) {
      return { success: true, producto: doc.data() };
    } else {
      return { success: false, error: "Producto no encontrado" };
    }
  } catch (error) {
    console.error("❌ Error al buscar producto:", error);
    return { success: false, error: error.message };
  }
}

// ===== FUNCIONES WRAPPER PARA COMPATIBILIDAD =====

// Guardar venta (usa Firebase o localStorage según configuración)
async function guardarVenta(venta) {
  if (MODO_ALMACENAMIENTO === "firebase") {
    return await guardarVentaFirebase(venta);
  } else {
    // Modo localStorage
    const ventasGuardadas = JSON.parse(localStorage.getItem("ventas")) || [];
    ventasGuardadas.push(venta);
    localStorage.setItem("ventas", JSON.stringify(ventasGuardadas));
    return { success: true };
  }
}

// Obtener ventas (usa Firebase o localStorage según configuración)
async function obtenerVentas() {
  if (MODO_ALMACENAMIENTO === "firebase") {
    const ventas = await obtenerVentasFirebase();
    return { success: true, ventas: ventas };
  } else {
    // Modo localStorage
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    return { success: true, ventas: ventas };
  }
}

// Guardar producto (usa Firebase o localStorage según configuración)
async function guardarProducto(producto) {
  if (MODO_ALMACENAMIENTO === "firebase") {
    return await guardarProductoFirebase(producto);
  } else {
    // Modo localStorage
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Buscar si ya existe
    const index = productos.findIndex(p => p.codigo === producto.codigo);
    if (index !== -1) {
      productos[index] = producto; // Actualizar
    } else {
      productos.push(producto); // Nuevo
    }

    localStorage.setItem("productos", JSON.stringify(productos));
    return { success: true };
  }
}

// Obtener productos (usa Firebase o localStorage según configuración)
async function obtenerProductos() {
  if (MODO_ALMACENAMIENTO === "firebase") {
    return await obtenerProductosFirebase();
  } else {
    // Modo localStorage
    return JSON.parse(localStorage.getItem("productos")) || [];
  }
}

// Eliminar producto (usa Firebase o localStorage según configuración)
async function eliminarProducto(codigoProducto) {
  if (MODO_ALMACENAMIENTO === "firebase") {
    return await eliminarProductoFirebase(codigoProducto);
  } else {
    // Modo localStorage
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const filtrados = productos.filter(p => p.codigo !== codigoProducto);
    localStorage.setItem("productos", JSON.stringify(filtrados));
    return { success: true };
  }
}

// Buscar producto por código (usa Firebase o localStorage según configuración)
async function buscarProductoPorCodigo(codigo) {
  if (MODO_ALMACENAMIENTO === "firebase") {
    return await buscarProductoPorCodigoFirebase(codigo);
  } else {
    // Modo localStorage
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const producto = productos.find(p => p.codigo === codigo);

    if (producto) {
      return { success: true, producto: producto };
    } else {
      return { success: false, error: "Producto no encontrado" };
    }
  }
}

// ===== INICIALIZACIÓN =====

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", function() {
  if (MODO_ALMACENAMIENTO === "firebase") {
    inicializarFirebase();
  }
});
