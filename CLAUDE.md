# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spanish-language sales management system ("Maqueta" - mockup/prototype) for a retail environment. It features role-based access with two user types: salespeople (vendedores) and sales managers (jefes de ventas). The system tracks sales transactions, manages documents (boletas/facturas), provides daily reporting, and includes product/SKU management with autocomplete functionality.

## Architecture

### Frontend Application with Optional Firebase Backend
This is primarily a client-side application with configurable data persistence:
- **No build system**: Static HTML/CSS/JS files opened directly in browser
- **Data persistence**: Configurable via `config.js` - supports both `localStorage` and Firebase Firestore
- **Authentication**: Hardcoded credentials in `scripts.js:7-10`
  - Salesperson: `usuario: "vendedor"`, `password: "123"`
  - Sales manager: `usuario: "jefe"`, `password: "123"`

### Configuration System
- `config.js` - Central configuration file containing:
  - Firebase credentials (`firebaseConfig`)
  - Role definitions (`ROLES`)
  - Sales settings (`CONFIG_VENTAS` - IVA rate, currency, locale)
  - Storage mode selector (`MODO_ALMACENAMIENTO`: "localStorage" or "firebase")
- `firebase.js` - Firebase integration layer with wrapper functions that auto-detect storage mode

### File Structure
- `index.html` - Login page (entry point)
- `vendedor.html` - Salesperson interface for recording sales
- `jefe.html` - Manager interface with reports and day controls
- `config.js` - Central configuration (Firebase, roles, sales settings)
- `firebase.js` - Firebase integration and wrapper functions
- `scripts.js` - All application logic (single shared file)
- `estilos.css` - All styles (single shared file)
- `img1.jfif` - Background image
- `INSTRUCCIONES_FIREBASE.md` - Step-by-step Firebase setup guide

### Data Flow
1. **Login** (`index.html`): Redirects to appropriate interface based on credentials

2. **Sales Entry** (`vendedor.html`):
   - **Product autocomplete**: Type in product code field to see matching products
   - Autocomplete searches by code or name, displays price
   - Selecting a product auto-fills code, name, and price fields
   - Form captures product details (code, name, quantity, price)
   - Document type selection (boleta or factura)
   - Facturas require additional client data (RUT, razón social, giro, dirección)
   - Calculates subtotal, IVA (from `CONFIG_VENTAS.IVA_PORCENTAJE`), and total
   - Shows confirmation modal before saving via `guardarVenta()` wrapper function
   - Data stored in localStorage or Firebase depending on `MODO_ALMACENAMIENTO`

3. **Manager Dashboard** (`jefe.html`):
   - **Product Management**: Create, view, and delete product SKUs
   - Products include: code, name, price, optional description
   - Product list displayed in table format
   - **Sales Reports**: Loads all sales via `obtenerVentas()` wrapper function
   - Aggregates by document type and vendor
   - Displays detailed transaction history with interactive invoice tooltips
   - Day control feature (open/close day, optionally synced with Firebase)

### Key JavaScript Functions

**Configuration (config.js)**:
- `obtenerFormateadorMoneda()` - Returns configured currency formatter for Chilean Peso

**Firebase Integration (firebase.js)**:
- `inicializarFirebase()` - Initializes Firebase app and Firestore connection
- `guardarVenta(venta)` - Wrapper that saves to localStorage or Firebase based on config
- `obtenerVentas()` - Wrapper that retrieves from localStorage or Firebase based on config
- `guardarProducto(producto)` - Wrapper that saves product to localStorage or Firebase
- `obtenerProductos()` - Wrapper that retrieves products from localStorage or Firebase
- `eliminarProducto(codigo)` - Wrapper that deletes product from localStorage or Firebase
- `buscarProductoPorCodigo(codigo)` - Wrapper that finds product by code
- Direct Firebase functions: `guardarVentaFirebase()`, `obtenerVentasFirebase()`, `obtenerVentasDelDia()`, `guardarProductoFirebase()`, `obtenerProductosFirebase()`, `eliminarProductoFirebase()`, `buscarProductoPorCodigoFirebase()`
- `guardarEstadoDia(estado)` - Saves day status to Firebase
- `obtenerEstadoDia()` - Retrieves current day status

**Application Logic (scripts.js)**:

*Sales (Vendedor)*:
- `calcular()` (scripts.js:27) - Calculates sale totals with Chilean peso formatting
- `confirmarVenta()` (scripts.js:147) - Async function that saves sale via wrapper
- `configurarAutocompletado()` (scripts.js:343) - Sets up product autocomplete on code input
- `seleccionarProducto(producto)` (scripts.js:405) - Auto-fills form when product selected from autocomplete
- `cerrarAutocompletado()` (scripts.js:417) - Closes autocomplete dropdown

*Manager Dashboard (Jefe)*:
- `cargarProductos()` (scripts.js:376) - Loads and displays product list in table
- `eliminarProductoConfirmar(codigo)` (scripts.js:408) - Confirms and deletes product
- `cancelarFormProducto()` (scripts.js:341) - Cancels product form and resets
- `cargarReportes()` (scripts.js:207) - Async function that loads and displays all reports
- `cargarDetalleVentas()` (scripts.js:277) - Renders detailed sales table with invoice tooltips

## Running the Application

Since this is a static HTML application:
```bash
# Simply open index.html in a web browser
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux
```

Or use a local development server (recommended for Firebase):
```bash
# Python 3
python -m http.server 8000

# Then visit http://localhost:8000
```

## Firebase Setup

To enable Firebase integration:
1. Follow the detailed instructions in `INSTRUCCIONES_FIREBASE.md`
2. Update `firebaseConfig` in `config.js` with your Firebase project credentials
3. Change `MODO_ALMACENAMIENTO` to `"firebase"` in `config.js`
4. Open the app and check browser console for `✅ Firebase inicializado correctamente`

**Quick toggle between storage modes:**
```javascript
// In config.js
const MODO_ALMACENAMIENTO = "localStorage"; // Local browser storage
const MODO_ALMACENAMIENTO = "firebase";     // Cloud storage with Firestore
```

## Development Notes

### Language and Localization
- All UI text is in Spanish
- Currency formatting: Chilean Peso (CLP) via `obtenerFormateadorMoneda()` from `config.js`
- Tax rate: 19% IVA (Value Added Tax) - configurable via `CONFIG_VENTAS.IVA_PORCENTAJE`
- Date formatting: `es-CL` locale (DD/MM/YYYY HH:MM)
- All formatting configuration centralized in `config.js` for easy updates

### Data Structures

**Products** stored in `localStorage.productos` or Firestore `productos` collection:
```javascript
{
  codigo: string,           // Product SKU code (uppercase)
  nombre: string,           // Product name
  precio: number,           // Unit price
  descripcion: string,      // Optional description
  // Firebase-only fields:
  timestamp?: Timestamp,    // Firestore server timestamp
  fechaCreacion?: string,   // ISO date string
  id?: string              // Firestore document ID (same as codigo)
}
```

**Sales** stored in `localStorage.ventas` or Firestore `ventas` collection:
```javascript
{
  codigo: string,        // Product code
  nombre: string,        // Product name
  cantidad: number,      // Quantity
  precio: number,        // Unit price
  tipo: "boleta"|"factura",  // Document type
  fecha: string,         // Formatted date string
  subtotal: number,      // Quantity × price
  iva: number,          // Subtotal × 0.19
  total: number,        // Subtotal + IVA
  // Only for facturas:
  rut?: string,         // Client tax ID
  razon?: string,       // Client company name
  giro?: string,        // Client business type
  direccion?: string,   // Client address
  // Firebase-only fields:
  timestamp?: Timestamp,        // Firestore server timestamp
  fechaCreacion?: string,       // ISO date string
  id?: string                   // Firestore document ID
}
```

### Modal System
- Custom modal implementation (scripts.js:133-169)
- Modal HTML injected dynamically via `insertAdjacentHTML`
- Uses global `window.ventaTemporal` to pass data between functions

### Tooltip Implementation
- Invoice details shown via CSS tooltips on click (scripts.js:277-338)
- Click handlers added after DOM rendering
- Global click listener closes all tooltips when clicking outside

## Common Patterns

### Event Listener Registration
The codebase uses optional chaining for safety when elements might not exist:
```javascript
document.getElementById("loginForm")?.addEventListener(...)
```

### Currency Formatting
Always use the centralized formatter from config:
```javascript
const formatter = obtenerFormateadorMoneda();
const precio = formatter.format(10000); // "$10.000"
```

### Data Access (Storage-Agnostic)
Use wrapper functions that auto-detect localStorage vs Firebase:
```javascript
// Saving data
const resultado = await guardarVenta(ventaObject);
if (resultado.success) {
  // Handle success
}

// Retrieving data
const ventas = await obtenerVentas(); // Returns array from localStorage or Firebase
```

### Direct LocalStorage Access (Legacy)
```javascript
const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
localStorage.setItem("ventas", JSON.stringify(ventas));
```

### Direct Firebase Access
```javascript
// Only use when you specifically need Firebase features
const resultado = await guardarVentaFirebase(venta);
const ventasDelDia = await obtenerVentasDelDia();
```

## Styling Approach

- Background image with dark overlay for readability (estilos.css:6-22)
- Gradient buttons for primary actions
- Responsive design with mobile breakpoints at 768px
- Font Awesome icons throughout
- Semi-transparent white cards (`rgba(255, 255, 255, 0.95)`) over background
