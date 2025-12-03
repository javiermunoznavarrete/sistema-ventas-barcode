// ===== CONFIGURACIÓN CENTRAL DEL SISTEMA =====

// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id",
  databaseURL: "https://tu-proyecto.firebaseio.com"
};

// Configuración de roles del sistema
const ROLES = {
  VENDEDOR: {
    nombre: "vendedor",
    displayName: "Vendedor",
    redirectTo: "vendedor.html",
    icono: "fa-cash-register"
  },
  JEFE: {
    nombre: "jefe",
    displayName: "Jefe de Ventas",
    redirectTo: "jefe.html",
    icono: "fa-user-tie"
  }
};

// Configuración de IVA
const CONFIG_VENTAS = {
  IVA_PORCENTAJE: 0.19,
  MONEDA: "CLP",
  LOCALE: "es-CL"
};

// Modo de almacenamiento: 'firebase' o 'localStorage'
// Cambia a 'firebase' cuando tengas configurada tu base de datos
const MODO_ALMACENAMIENTO = "localStorage"; // Cambiar a "firebase" cuando esté configurado

// Función para obtener el formateador de moneda
function obtenerFormateadorMoneda() {
  return new Intl.NumberFormat(CONFIG_VENTAS.LOCALE, {
    style: 'currency',
    currency: CONFIG_VENTAS.MONEDA,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Exportar configuración para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, ROLES, CONFIG_VENTAS, MODO_ALMACENAMIENTO };
}
