// ===== INICIO DE SESIÓN =====
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario === "vendedor" && password === "123") {
        window.location.href = "vendedor.html";
    } else if (usuario === "jefe" && password === "123") {
        window.location.href = "jefe.html";
    } else {
        document.getElementById("mensaje-error").textContent = "Credenciales incorrectas";
    }
});

// ===== MOSTRAR/OCULTAR DATOS DE CLIENTE (Vendedor) =====
document.querySelectorAll('input[name="tipo"]').forEach(radio => {
    radio.addEventListener("change", function () {
        const clienteDiv = document.getElementById("datosCliente");
        if (clienteDiv) {
            clienteDiv.style.display = this.value === "factura" ? "block" : "none";
        }
    });
});

// ===== CÁLCULO DE MONTO (Vendedor) =====
function calcular() {
    const cantidadInput = document.getElementById("cantidad");
    const precioInput = document.getElementById("precio");
    const montoTotalDiv = document.getElementById("montoTotal");

    if (!cantidadInput || !precioInput || !montoTotalDiv) return;

    const cantidad = parseFloat(cantidadInput.value) || 0;
    const precio = parseFloat(precioInput.value) || 0;

    if (cantidad <= 0 || precio <= 0) {
        montoTotalDiv.innerHTML = "<p class='error'>Ingresa valores válidos.</p>";
        return;
    }

    const subtotal = cantidad * precio;
    const iva = subtotal * CONFIG_VENTAS.IVA_PORCENTAJE;
    const total = subtotal + iva;

    const formatter = obtenerFormateadorMoneda();

    montoTotalDiv.innerHTML = `
    <p>Subtotal: ${formatter.format(subtotal)}</p>
    <p>IVA (19%): ${formatter.format(iva)}</p>
    <p><strong>Total: ${formatter.format(total)}</strong></p>
  `;
}

// ===== GUARDAR VENTA (Vendedor) =====
document.getElementById("ventaForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const venta = {
        codigo: document.getElementById("codigo").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        cantidad: parseInt(document.getElementById("cantidad").value),
        precio: parseFloat(document.getElementById("precio").value),
        tipo: document.querySelector('input[name="tipo"]:checked').value,
        fecha: new Date().toLocaleString("es-CL", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    if (venta.tipo === "factura") {
        venta.rut = document.getElementById("rut").value.trim();
        venta.razon = document.getElementById("razon").value.trim();
        venta.giro = document.getElementById("giro").value.trim();
        venta.direccion = document.getElementById("direccion").value.trim();
    }

    // Validar campos obligatorios
    if (!venta.codigo || !venta.nombre || isNaN(venta.cantidad) || isNaN(venta.precio) || venta.cantidad <= 0 || venta.precio <= 0) {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }

    if (venta.tipo === "factura") {
        if (!venta.rut || !venta.razon || !venta.giro || !venta.direccion) {
            alert("Completa todos los datos del cliente para la factura.");
            return;
        }
    }

    venta.subtotal = venta.cantidad * venta.precio;
    venta.iva = venta.subtotal * CONFIG_VENTAS.IVA_PORCENTAJE;
    venta.total = venta.subtotal + venta.iva;

    // ===== Mostrar modal de confirmación =====
    const formatter = obtenerFormateadorMoneda();

    let detalle = `
    <h3>Comprobante: ${venta.tipo === "boleta" ? "Boleta" : "Factura"}</h3>
    <p><strong>Fecha:</strong> ${venta.fecha}</p>
    <p><strong>Código:</strong> ${venta.codigo}</p>
    <p><strong>Nombre:</strong> ${venta.nombre}</p>
    <p><strong>Cantidad:</strong> ${venta.cantidad}</p>
    <p><strong>Precio Unitario:</strong> ${formatter.format(venta.precio)}</p>
    <p><strong>Subtotal:</strong> ${formatter.format(venta.subtotal)}</p>
    <p><strong>IVA (19%):</strong> ${formatter.format(venta.iva)}</p>
    <p><strong>Total:</strong> ${formatter.format(venta.total)}</p>
  `;

    if (venta.tipo === "factura") {
        detalle += `
      <p><strong>RUT:</strong> ${venta.rut}</p>
      <p><strong>Razón Social:</strong> ${venta.razon}</p>
      <p><strong>Giro:</strong> ${venta.giro}</p>
      <p><strong>Dirección:</strong> ${venta.direccion}</p>
    `;
    }

    // Crear modal
    const modalHTML = `
    <div id="confirmModal" class="modal">
      <div class="modal-content">
        <div>${detalle}</div>
        <div class="modal-buttons">
          <button class="btn-confirm" onclick="confirmarVenta()">Confirmar</button>
          <button class="btn-cancel" onclick="cerrarModal()">Cancelar</button>
        </div>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById("confirmModal").style.display = "block";

    // Guardar la venta en una variable global temporal
    window.ventaTemporal = venta;
});

async function confirmarVenta() {
    // Verificar estado del día antes de guardar
    const resultadoEstado = await obtenerEstadoDia();
    const estadoDia = resultadoEstado.success ? resultadoEstado.estado : "ABIERTO";

    if (estadoDia === "CERRADO") {
        cerrarModal();
        alert("⚠️ No se pueden registrar ventas. El día está CERRADO.\n\nPor favor contacta al jefe de ventas para que abra el día.");
        return;
    }

    const venta = window.ventaTemporal;

    // Usar la función wrapper que detecta automáticamente el modo
    const resultado = await guardarVenta(venta);

    if (resultado.success) {
        alert("✅ Venta guardada exitosamente");
        document.getElementById("ventaForm").reset();
        document.getElementById("datosCliente").style.display = "none";
        document.getElementById("montoTotal").innerHTML = "";
        cerrarModal();
    } else {
        alert("❌ Error al guardar la venta: " + (resultado.error || "Error desconocido"));
    }
}

function cerrarModal() {
    const modal = document.getElementById("confirmModal");
    if (modal) {
        modal.remove();
    }
}

// ===== CONTROL DE DÍA (Jefe) =====

// Cargar estado del día al iniciar (para jefe)
async function cargarEstadoDia() {
    const cerrarDiaBtn = document.getElementById("cerrarDia");
    const abrirDiaBtn = document.getElementById("abrirDia");
    const estadoDiaSpan = document.getElementById("estadoDia");

    if (!cerrarDiaBtn || !abrirDiaBtn || !estadoDiaSpan) return;

    const resultado = await obtenerEstadoDia();
    const estado = resultado.success ? resultado.estado : "ABIERTO";

    actualizarUIEstadoDia(estado);
}

// Actualizar la interfaz según el estado del día
function actualizarUIEstadoDia(estado) {
    const cerrarDiaBtn = document.getElementById("cerrarDia");
    const abrirDiaBtn = document.getElementById("abrirDia");
    const estadoDiaSpan = document.getElementById("estadoDia");

    if (!estadoDiaSpan) return;

    estadoDiaSpan.textContent = estado;

    if (estado === "CERRADO") {
        estadoDiaSpan.style.color = "#e74c3c";
        if (cerrarDiaBtn) cerrarDiaBtn.style.display = "none";
        if (abrirDiaBtn) abrirDiaBtn.style.display = "inline-block";
    } else {
        estadoDiaSpan.style.color = "#2575fc";
        if (cerrarDiaBtn) cerrarDiaBtn.style.display = "inline-block";
        if (abrirDiaBtn) abrirDiaBtn.style.display = "none";
    }
}

// Event listeners para botones de control de día
document.addEventListener("DOMContentLoaded", function () {
    const cerrarDiaBtn = document.getElementById("cerrarDia");
    const abrirDiaBtn = document.getElementById("abrirDia");

    if (cerrarDiaBtn && abrirDiaBtn) {
        // Cargar estado inicial
        cargarEstadoDia();

        cerrarDiaBtn.addEventListener("click", async function () {
            if (confirm("¿Estás seguro de cerrar el día? Los vendedores no podrán registrar ventas hasta que lo abras nuevamente.")) {
                const resultado = await guardarEstadoDia("CERRADO");

                if (resultado.success) {
                    actualizarUIEstadoDia("CERRADO");
                    alert("✅ Día cerrado exitosamente");
                } else {
                    alert("❌ Error al cerrar el día: " + (resultado.error || "Error desconocido"));
                }
            }
        });

        abrirDiaBtn.addEventListener("click", async function () {
            const resultado = await guardarEstadoDia("ABIERTO");

            if (resultado.success) {
                actualizarUIEstadoDia("ABIERTO");
                alert("✅ Día abierto exitosamente");
            } else {
                alert("❌ Error al abrir el día: " + (resultado.error || "Error desconocido"));
            }
        });
    }
});

// ===== BOTÓN PARA MOSTRAR/OCULTAR DETALLE DE VENTAS =====
document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggleDetalle");
    const contenedor = document.getElementById("detalleVentasContenedor");

    if (toggleBtn && contenedor) {
        toggleBtn.addEventListener("click", function () {
            const isVisible = contenedor.style.display === "block";
            contenedor.style.display = isVisible ? "none" : "block";
            toggleBtn.textContent = isVisible ? "Mostrar Resumen de Ventas" : "Ocultar Resumen de Ventas";
        });
    }
});

// ===== CARGAR REPORTES EN PANEL DE JEFE =====
async function cargarReportes() {
    const ventas = await obtenerVentas();

    if (ventas.length === 0) {
        document.getElementById("resumen-documentos").innerHTML = `<tr><td colspan="2">No hay ventas registradas</td></tr>`;
        document.getElementById("desglose-vendedores").innerHTML = `<tr><td colspan="4">No hay ventas registradas</td></tr>`;
        document.getElementById("totales-generales").innerHTML = "<p>No hay datos disponibles</p>";
        document.getElementById("detalle-ventas").innerHTML = `<tr><td colspan="9">No hay ventas registradas</td></tr>`;
        return;
    }

    let totalBoletas = 0;
    let totalFacturas = 0;

    ventas.forEach(venta => {
        if (venta.tipo === "boleta") {
            totalBoletas += venta.total;
        } else {
            totalFacturas += venta.total;
        }
    });

    const formatter = obtenerFormateadorMoneda();

    document.getElementById("resumen-documentos").innerHTML = `
    <tr><td>Boletas</td><td>${formatter.format(totalBoletas)}</td></tr>
    <tr><td>Facturas</td><td>${formatter.format(totalFacturas)}</td></tr>
  `;

    // Simulacion del vendedor del sistema
    const vendedor = { boletas: 0, facturas: 0, total: 0 };
    ventas.forEach(venta => {
        if (venta.tipo === "boleta") {
            vendedor.boletas += venta.total;
        } else {
            vendedor.facturas += venta.total;
        }
        vendedor.total += venta.total;
    });

    document.getElementById("desglose-vendedores").innerHTML = `
    <tr>
      <td>Vendedor del Sistema</td>
      <td>${formatter.format(vendedor.total)}</td>
      <td>${formatter.format(vendedor.boletas)}</td>
      <td>${formatter.format(vendedor.facturas)}</td>
    </tr>
  `;

    const ivaTotal = ventas.reduce((suma, v) => suma + v.iva, 0);
    const totalBruto = ventas.reduce((suma, v) => suma + v.total, 0);
    const totalNeto = totalBruto - ivaTotal;

    document.getElementById("totales-generales").innerHTML = `
    <p>Total Neto: ${formatter.format(Math.round(totalNeto))}</p>
    <p>Total IVA (19%): ${formatter.format(Math.round(ivaTotal))}</p>
    <p><strong>Total Bruto: ${formatter.format(totalBruto)}</strong></p>
  `;

    // Cargar detalle de ventas (sin columna de cliente)
    cargarDetalleVentas(ventas, formatter);
}

// ===== FUNCIÓN ACTUALIZADA: con tooltip para facturas =====
function cargarDetalleVentas(ventas, formatter) {
    const tbody = document.getElementById("detalle-ventas");
    tbody.innerHTML = "";

    ventas.forEach(venta => {
        // Preparar la celda de "Tipo"
        let tipoCeldaHTML;
        if (venta.tipo === "factura") {
            // Escapamos los datos para usarlos en data-tooltip (opcional, pero seguro)
            const datosCliente = `
                <strong>RUT:</strong> ${venta.rut}<br>
                <strong>Razón Social:</strong> ${venta.razon}<br>
                <strong>Giro:</strong> ${venta.giro}<br>
                <strong>Dirección:</strong> ${venta.direccion}
            `;
            tipoCeldaHTML = `
                <span class="factura-tooltip-trigger" tabindex="0">
                    FACTURA
                    <span class="factura-tooltip">${datosCliente}</span>
                </span>
            `;
        } else {
            tipoCeldaHTML = "BOLETA";
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${venta.fecha}</td>
            <td>${venta.codigo}</td>
            <td>${venta.nombre}</td>
            <td>${venta.cantidad}</td>
            <td>${formatter.format(venta.precio)}</td>
            <td>${formatter.format(venta.subtotal)}</td>
            <td>${formatter.format(venta.iva)}</td>
            <td>${formatter.format(venta.total)}</td>
            <td>${tipoCeldaHTML}</td>
        `;
        tbody.appendChild(row);
    });

    // Añadir eventos a los triggers de factura
    document.querySelectorAll('.factura-tooltip-trigger').forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            // Ocultar todos los tooltips
            document.querySelectorAll('.factura-tooltip').forEach(tt => {
                if (tt !== this.querySelector('.factura-tooltip')) {
                    tt.style.display = 'none';
                }
            });
            // Alternar este tooltip
            const tooltip = this.querySelector('.factura-tooltip');
            tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Cerrar todos los tooltips al hacer clic fuera
    document.addEventListener('click', function () {
        document.querySelectorAll('.factura-tooltip').forEach(tt => {
            tt.style.display = 'none';
        });
    });
}

// ===== AUTOCOMPLETADO DE PRODUCTOS (Vendedor) =====

let productosCache = []; // Cache de productos para autocompletado
let estadoDiaActual = "ABIERTO"; // Cache del estado del día

// Cargar productos al iniciar la página de vendedor
if (document.getElementById("ventaForm")) {
    document.addEventListener("DOMContentLoaded", async function() {
        productosCache = await obtenerProductos();
        configurarAutocompletado();
        await cargarEstadoDiaVendedor();
    });
}

// Cargar y mostrar estado del día para el vendedor
async function cargarEstadoDiaVendedor() {
    const resultado = await obtenerEstadoDia();
    estadoDiaActual = resultado.success ? resultado.estado : "ABIERTO";

    const estadoDiaTexto = document.getElementById("estadoDiaTexto");
    const estadoDiaVendedor = document.getElementById("estadoDiaVendedor");

    if (estadoDiaTexto && estadoDiaVendedor) {
        estadoDiaTexto.textContent = estadoDiaActual;

        if (estadoDiaActual === "CERRADO") {
            estadoDiaVendedor.classList.add("dia-cerrado");
            estadoDiaVendedor.classList.remove("dia-abierto");
        } else {
            estadoDiaVendedor.classList.add("dia-abierto");
            estadoDiaVendedor.classList.remove("dia-cerrado");
        }
    }
}

// Configurar el autocompletado
function configurarAutocompletado() {
    const inputCodigo = document.getElementById("codigo");
    const inputNombre = document.getElementById("nombre");
    const inputPrecio = document.getElementById("precio");
    const autocompleteList = document.getElementById("autocomplete-list");

    if (!inputCodigo) return;

    // Autocompletado mientras escribe
    inputCodigo.addEventListener("input", function() {
        const valor = this.value.toUpperCase();
        cerrarAutocompletado();

        if (!valor) return;

        // Filtrar productos que coincidan
        const coincidencias = productosCache.filter(p =>
            p.codigo.toUpperCase().includes(valor) ||
            p.nombre.toUpperCase().includes(valor)
        );

        if (coincidencias.length === 0) return;

        // Mostrar lista de coincidencias
        coincidencias.forEach(producto => {
            const item = document.createElement("div");
            item.classList.add("autocomplete-item");
            item.innerHTML = `
                <strong>${producto.codigo}</strong> - ${producto.nombre}
                <span class="autocomplete-precio">${obtenerFormateadorMoneda().format(producto.precio)}</span>
            `;

            item.addEventListener("click", function() {
                seleccionarProducto(producto);
            });

            autocompleteList.appendChild(item);
        });
    });

    // Cerrar autocompletado al hacer clic fuera
    document.addEventListener("click", function(e) {
        if (e.target !== inputCodigo) {
            cerrarAutocompletado();
        }
    });

    // Navegar con teclado (opcional)
    inputCodigo.addEventListener("keydown", function(e) {
        const items = autocompleteList.getElementsByClassName("autocomplete-item");

        if (e.key === "ArrowDown" && items.length > 0) {
            e.preventDefault();
            items[0].focus();
        } else if (e.key === "Enter" && items.length === 1) {
            e.preventDefault();
            items[0].click();
        }
    });
}

// Seleccionar un producto del autocompletado
function seleccionarProducto(producto) {
    document.getElementById("codigo").value = producto.codigo;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("precio").value = producto.precio;

    cerrarAutocompletado();

    // Enfocar el campo de cantidad
    document.getElementById("cantidad").focus();
}

// Cerrar lista de autocompletado
function cerrarAutocompletado() {
    const autocompleteList = document.getElementById("autocomplete-list");
    if (autocompleteList) {
        autocompleteList.innerHTML = "";
    }
}

// ===== GESTIÓN DE PRODUCTOS (Jefe) =====

// Toggle del formulario de productos
document.getElementById("toggleFormProducto")?.addEventListener("click", function() {
    const contenedor = document.getElementById("formProductoContenedor");
    const isVisible = contenedor.style.display === "block";
    contenedor.style.display = isVisible ? "none" : "block";
    this.textContent = isVisible ? "Agregar Nuevo Producto" : "Ocultar Formulario";
});

// Función para cancelar formulario de producto
function cancelarFormProducto() {
    document.getElementById("formProductoContenedor").style.display = "none";
    document.getElementById("productoForm").reset();
    document.getElementById("toggleFormProducto").textContent = "Agregar Nuevo Producto";
}

// Guardar producto
document.getElementById("productoForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();

    const producto = {
        codigo: document.getElementById("prodCodigo").value.trim().toUpperCase(),
        nombre: document.getElementById("prodNombre").value.trim(),
        precio: parseFloat(document.getElementById("prodPrecio").value),
        descripcion: document.getElementById("prodDescripcion").value.trim() || ""
    };

    // Validar
    if (!producto.codigo || !producto.nombre || isNaN(producto.precio) || producto.precio <= 0) {
        alert("Por favor completa todos los campos obligatorios correctamente.");
        return;
    }

    const resultado = await guardarProducto(producto);

    if (resultado.success) {
        alert("✅ Producto guardado exitosamente");
        cancelarFormProducto();
        cargarProductos(); // Recargar la lista
    } else {
        alert("❌ Error al guardar el producto: " + (resultado.error || "Error desconocido"));
    }
});

// Cargar lista de productos
async function cargarProductos() {
    const productos = await obtenerProductos();
    const tbody = document.getElementById("lista-productos");

    if (!tbody) return;

    if (productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No hay productos registrados</td></tr>`;
        return;
    }

    const formatter = obtenerFormateadorMoneda();
    tbody.innerHTML = "";

    productos.forEach(producto => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${formatter.format(producto.precio)}</td>
            <td>${producto.descripcion || "-"}</td>
            <td>
                <button onclick='editarProducto(${JSON.stringify(producto)})' class="btn-editar">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="eliminarProductoConfirmar('${producto.codigo}')" class="btn-eliminar">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Eliminar producto con confirmación
async function eliminarProductoConfirmar(codigo) {
    if (confirm(`¿Estás seguro de eliminar el producto ${codigo}?`)) {
        const resultado = await eliminarProducto(codigo);

        if (resultado.success) {
            alert("✅ Producto eliminado exitosamente");
            cargarProductos();
        } else {
            alert("❌ Error al eliminar el producto: " + (resultado.error || "Error desconocido"));
        }
    }
}

// Abrir modal de edición con datos del producto
function editarProducto(producto) {
    document.getElementById("editCodigoOriginal").value = producto.codigo;
    document.getElementById("editCodigo").value = producto.codigo;
    document.getElementById("editNombre").value = producto.nombre;
    document.getElementById("editPrecio").value = producto.precio;
    document.getElementById("editDescripcion").value = producto.descripcion || "";

    document.getElementById("modalEditarProducto").style.display = "block";
}

// Cerrar modal de edición
function cerrarModalEdicion() {
    document.getElementById("modalEditarProducto").style.display = "none";
    document.getElementById("formEditarProducto").reset();
}

// Guardar cambios del producto editado
document.getElementById("formEditarProducto")?.addEventListener("submit", async function(e) {
    e.preventDefault();

    const productoEditado = {
        codigo: document.getElementById("editCodigoOriginal").value,
        nombre: document.getElementById("editNombre").value.trim(),
        precio: parseFloat(document.getElementById("editPrecio").value),
        descripcion: document.getElementById("editDescripcion").value.trim() || ""
    };

    // Validar
    if (!productoEditado.nombre || isNaN(productoEditado.precio) || productoEditado.precio <= 0) {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }

    const resultado = await guardarProducto(productoEditado);

    if (resultado.success) {
        alert("✅ Producto actualizado exitosamente");
        cerrarModalEdicion();
        cargarProductos();

        // Actualizar cache de productos para autocompletado
        productosCache = await obtenerProductos();
    } else {
        alert("❌ Error al actualizar el producto: " + (resultado.error || "Error desconocido"));
    }
});

// Ejecutar reportes si estamos en la página de jefe
if (document.getElementById("resumen-documentos")) {
    document.addEventListener("DOMContentLoaded", function() {
        cargarReportes();
        cargarProductos();
    });
}

// ===== CERRAR SESIÓN =====
function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        // Redirigir al login
        window.location.href = "index.html";
    }
}

// ===== ESCÁNER DE CÓDIGOS DE BARRAS (Vendedor) =====

let html5Qrcode = null;
let escanerActivo = false;

// Abrir el escáner
async function abrirEscaner() {
    const modal = document.getElementById("modalEscaner");
    if (!modal) return;

    modal.style.display = "block";

    // Crear contenedor del video si no existe
    const readerDiv = document.getElementById("reader");
    if (!readerDiv) return;

    try {
        // Inicializar el escáner con soporte para códigos de barras
        html5Qrcode = new Html5Qrcode("reader", {
            formatsToSupport: [
                0,  // QR_CODE
                9,  // EAN_13 (más común en productos)
                10, // EAN_8
                5,  // CODE_128
                3,  // CODE_39
                4,  // CODE_93
                14, // UPC_A
                15, // UPC_E
                8,  // ITF
            ],
            verbose: true  // Activar logs para debug
        });

        // Configuración optimizada para detección de códigos de barras
        const config = {
            fps: 30,  // Aumentado para más intentos por segundo
            qrbox: { width: 400, height: 150 },  // Más ancho, menos alto (típico de códigos de barras)
            aspectRatio: 1.777778,  // 16:9 estándar
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: true  // Usar API nativa si está disponible
            }
        };

        // Iniciar el escáner
        console.log("🔍 Iniciando escáner con config:", config);
        await html5Qrcode.start(
            { facingMode: "environment" }, // Usar cámara trasera en móviles
            config,
            onScanSuccess,
            onScanFailure
        );

        escanerActivo = true;
        console.log("✅ Escáner iniciado correctamente");
        mostrarNotificacion("📷 Escáner activo. Apunta al código de barras.", "info");

    } catch (err) {
        console.error("Error al iniciar el escáner:", err);

        // Si falla con environment, intentar con cualquier cámara
        try {
            await html5Qrcode.start(
                { facingMode: "user" }, // Intentar con cámara frontal
                {
                    fps: 30,
                    qrbox: { width: 400, height: 150 },
                    aspectRatio: 1.777778,
                    experimentalFeatures: {
                        useBarCodeDetectorIfSupported: true
                    }
                },
                onScanSuccess,
                onScanFailure
            );
            escanerActivo = true;
            console.log("✅ Escáner iniciado con cámara frontal");
            mostrarNotificacion("📷 Escáner activo (cámara frontal).", "info");
        } catch (err2) {
            console.error("Error al iniciar con cámara frontal:", err2);
            mostrarNotificacion("❌ Error al acceder a la cámara. Verifica los permisos.", "warning");
            cerrarEscaner();
        }
    }
}

// Cuando se escanea exitosamente
async function onScanSuccess(decodedText, decodedResult) {
    console.log(`Código escaneado: ${decodedText}`, decodedResult);

    // Vibrar si está disponible (feedback táctil)
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }

    // Detener el escáner antes de procesar
    await cerrarEscaner();

    // Poner el código en el campo
    document.getElementById("codigo").value = decodedText.toUpperCase();

    // Buscar el producto automáticamente
    const resultado = await buscarProductoPorCodigo(decodedText.toUpperCase());

    if (resultado.success) {
        // Auto-completar el producto
        seleccionarProducto(resultado.producto);

        // Mostrar notificación de éxito
        mostrarNotificacion(`✅ Producto encontrado: ${resultado.producto.nombre}`, "success");
    } else {
        // El código no está registrado, solo llenar el campo de código
        mostrarNotificacion(`⚠️ Código escaneado. Complete los datos manualmente.`, "warning");

        // Enfocar el campo de nombre
        document.getElementById("nombre").focus();
    }
}

// Cuando falla el escaneo (no es un error, solo intenta continuamente)
let intentosEscaneo = 0;

function onScanFailure(error) {
    // Contar intentos (solo para debug)
    intentosEscaneo++;

    // Mostrar cada 100 intentos que está buscando activamente
    if (intentosEscaneo % 100 === 0) {
        console.log(`🔍 Buscando código... (${intentosEscaneo} intentos)`);
    }

    // Ignorar errores de "No MultiFormat Readers" que son normales
    if (error && !error.includes("NotFoundException")) {
        console.warn(`⚠️ Error de escaneo: ${error}`);
    }
}

// Cerrar el escáner
async function cerrarEscaner() {
    const modal = document.getElementById("modalEscaner");

    // Detener el escáner
    if (html5Qrcode && escanerActivo) {
        try {
            await html5Qrcode.stop();
            console.log("✅ Escáner detenido");
        } catch (error) {
            console.error("Error al detener el escáner:", error);
        }
        escanerActivo = false;
    }

    // Resetear contador de intentos
    intentosEscaneo = 0;

    // Limpiar el HTML del reader
    const readerDiv = document.getElementById("reader");
    if (readerDiv) {
        readerDiv.innerHTML = "";
    }

    // Cerrar el modal
    if (modal) {
        modal.style.display = "none";
    }

    html5Qrcode = null;
}

// Mostrar notificación temporal
function mostrarNotificacion(mensaje, tipo = "info") {
    // Crear elemento de notificación
    const notif = document.createElement("div");
    notif.className = `notificacion notificacion-${tipo}`;
    notif.innerHTML = mensaje;

    document.body.appendChild(notif);

    // Mostrar con animación
    setTimeout(() => {
        notif.classList.add("notificacion-visible");
    }, 100);

    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notif.classList.remove("notificacion-visible");
        setTimeout(() => {
            notif.remove();
        }, 300);
    }, 3000);
}