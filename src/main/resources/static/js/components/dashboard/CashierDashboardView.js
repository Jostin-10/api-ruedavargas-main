import { fromHTML, setText } from '../../utils/dom.js';

/**
 * Pantalla 4: Dashboard del Cajero
 * - Registro de ventas (Punto de Venta / Facturación de Insumos).
 * - Búsqueda de productos de acuicultura.
 * - Selección de cantidades.
 * - Cálculo del subtotal, IVA (15% Ecuador) y total en USD.
 * - Consulta de ventas realizadas y consulta de pagos.
 */
export function CashierDashboardView() {
    // Catálogo de insumos disponibles en bodega
    const INVENTORY = [
        { id: 1, code: 'BAL-35', name: 'Balanceado Camaronero 35% (Saco 25kg)', price: 34.50, stock: 1240, category: 'Alimento' },
        { id: 2, code: 'BAL-40', name: 'Iniciador Larval 40% (Saco 20kg)', price: 46.00, stock: 320, category: 'Larvicultura' },
        { id: 3, code: 'BIO-PRO', name: 'Probiótico BioAqua 5kg (Bacillus)', price: 92.00, stock: 85, category: 'Biorremediación' },
        { id: 4, code: 'CARB-CA', name: 'Carbonato de Calcio (Saco 50kg)', price: 8.75, stock: 890, category: 'Enmiendas' },
        { id: 5, code: 'MEL-200', name: 'Melaza Concentrada (Tanque 200L)', price: 78.00, stock: 45, category: 'Orgánicos' },
        { id: 6, code: 'AIR-2HP', name: 'Aireador 4 Paletas 2HP Completo', price: 420.00, stock: 24, category: 'Equipos' },
        { id: 7, code: 'ZEOL-50', name: 'Zeolita Micronizada (Saco 50kg)', price: 12.50, stock: 410, category: 'Enmiendas' },
        { id: 8, code: 'VIT-C', name: 'Vitamina C Estabilizada 1kg', price: 18.00, stock: 150, category: 'Aditivos' }
    ];

    const CLIENTS = [
        { ruc: '0992348576001', name: 'Camaronera San Vicente Cía. Ltda.', zone: 'Taura - Guayas' },
        { ruc: '0791823746001', name: 'Acuícola Jambelí del Mar S.A.', zone: 'Santa Rosa - El Oro' },
        { ruc: '1391829384001', name: 'Producción Camaronera Pedernales', zone: 'Pedernales - Manabí' },
        { ruc: '0993847261001', name: 'Agrícola & Camaronera Isla Puná', zone: 'Golfo de Guayaquil' }
    ];

    let cart = [
        { id: 1, code: 'BAL-35', name: 'Balanceado Camaronero 35% (Saco 25kg)', price: 34.50, qty: 50 },
        { id: 3, code: 'BIO-PRO', name: 'Probiótico BioAqua 5kg (Bacillus)', price: 92.00, qty: 4 }
    ];

    const SALES_HISTORY = [
        { num: 'FAC-001-0982', time: '14:32', client: 'Camaronera San Vicente', ruc: '0992348576001', items: '50 sacos Bal. 35%', subtotal: 1725.00, iva: 258.75, total: 1983.75, method: 'Transferencia Pichincha', status: 'Pagado' },
        { num: 'FAC-001-0981', time: '12:15', client: 'Acuícola Jambelí del Mar', ruc: '0791823746001', items: '10 canecas BioAqua', subtotal: 920.00, iva: 138.00, total: 1058.00, method: 'Transferencia Guayaquil', status: 'Pagado' },
        { num: 'FAC-001-0980', time: '10:45', client: 'Agrícola & Camaronera Isla Puná', ruc: '0993847261001', items: '100 sacos Carbonato', subtotal: 875.00, iva: 131.25, total: 1006.25, method: 'Cheque 30 días', status: 'Pendiente' }
    ];

    const el = fromHTML(`
        <div class="space-y-6">
            <!-- Header de Caja y Ventas -->
            <div class="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-celeste-500/20 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary shrink-0 shadow-inner">
                        <span class="material-symbols-outlined text-3xl">point_of_sale</span>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary font-label text-label-sm font-bold uppercase tracking-wider">
                                Módulo de Caja y Facturación
                            </span>
                            <span class="text-xs text-on-surface-variant font-label">Caja N° 01 · Terminal Matriz</span>
                        </div>
                        <h2 class="font-headline text-headline-md text-white font-bold mt-1">Punto de Venta de Insumos Camaroneros</h2>
                        <p class="font-body text-body-sm text-on-surface-variant">Facturación directa a fincas camaroneras, cálculo de IVA (15% Ecuador) y registro de cobros.</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-xl border border-navy-700">
                    <div class="text-right">
                        <span class="block text-[11px] text-on-surface-variant uppercase font-label">Ventas Turno Actual</span>
                        <strong class="font-headline text-headline-sm text-secondary font-mono">$4,048.00</strong>
                    </div>
                </div>
            </div>

            <!-- CONTENEDOR PRINCIPAL: Catálogo a la izquierda, Factura a la derecha -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- SECCIÓN IZQUIERDA: Catálogo y Búsqueda de Insumos (Col 7) -->
                <div class="lg:col-span-7 bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-md space-y-4">
                    <div class="flex items-center justify-between gap-3">
                        <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-celeste-400">search</span>
                            Catálogo de Insumos en Bodega
                        </h3>
                    </div>

                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-lg">search</span>
                        <input type="text" data-search-catalog placeholder="Buscar balanceado, probióticos, carbonato o químicos…"
                            class="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-navy-700 text-body-sm text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-celeste-500">
                    </div>

                    <!-- Lista de Productos en Tarjetas -->
                    <div data-catalog-grid class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1"></div>
                </div>

                <!-- SECCIÓN DERECHA: Liquidación de Factura / Ticket (Col 5) -->
                <div class="lg:col-span-5 bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-md flex flex-col justify-between space-y-4">
                    <div class="space-y-4">
                        <div class="border-b border-navy-800 pb-3 flex items-center justify-between">
                            <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                                <span class="material-symbols-outlined text-secondary">receipt_long</span>
                                Factura / Orden de Venta
                            </h3>
                            <button type="button" data-clear-cart class="text-xs font-label text-error hover:underline flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">delete</span> Limpiar
                            </button>
                        </div>

                        <!-- Selector de Cliente Comercial (Camaronera) -->
                        <div>
                            <label class="block text-xs font-label text-on-surface-variant mb-1 font-semibold">Cliente Comercial / Camaronera:</label>
                            <select data-client-select class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500 font-label">
                                ${CLIENTS.map(c => `<option value="${c.ruc}">${c.name} (${c.zone})</option>`).join('')}
                            </select>
                        </div>

                        <!-- Lista de Ítems en la Factura -->
                        <div class="space-y-2">
                            <span class="block text-xs font-label text-on-surface-variant uppercase tracking-wider">Detalle de Insumos:</span>
                            <div data-cart-items class="space-y-2 max-h-56 overflow-y-auto pr-1 divide-y divide-navy-800/60"></div>
                        </div>
                    </div>

                    <!-- Resumen de Totales e Impuestos -->
                    <div class="bg-navy-950/60 p-4 rounded-xl border border-navy-800 space-y-2 font-mono">
                        <div class="flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span>Subtotal:</span>
                            <span data-subtotal class="text-white font-bold">$0.00</span>
                        </div>
                        <div class="flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span>IVA (15% Ecuador):</span>
                            <span data-iva class="text-white font-bold">$0.00</span>
                        </div>
                        <div class="border-t border-navy-800 pt-2 flex items-center justify-between text-headline-sm font-bold text-secondary">
                            <span class="font-headline">Total USD:</span>
                            <span data-total class="text-secondary">$0.00</span>
                        </div>
                    </div>

                    <!-- Forma de Pago y Botón de Emisión -->
                    <div class="space-y-3 pt-2">
                        <div>
                            <label class="block text-xs font-label text-on-surface-variant mb-1 font-semibold">Forma de Pago:</label>
                            <select data-pay-method class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                                <option>Transferencia Bancaria (Banco Pichincha)</option>
                                <option>Transferencia Bancaria (Banco Guayaquil)</option>
                                <option>Efectivo en Caja</option>
                                <option>Cheque Comercial a 30 días</option>
                            </select>
                        </div>

                        <button type="button" data-checkout
                            class="w-full h-12 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-label text-label-md font-bold flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 transition-all">
                            <span class="material-symbols-outlined text-xl">payments</span>
                            <span>Registrar Venta & Emitir Factura</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- TABLA DE VENTAS Y PAGOS REALIZADOS EN EL TURNO -->
            <div class="bg-surface-container rounded-2xl p-6 border border-navy-700/50 shadow-md space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-celeste-400">history</span>
                            Historial de Ventas y Facturas Emitidas
                        </h3>
                        <p class="font-body text-body-sm text-on-surface-variant">Consulta de transacciones, cobros registrados y comprobantes generados.</p>
                    </div>
                    <span class="text-xs font-label text-celeste-300 bg-navy-800 px-3 py-1.5 rounded-full border border-navy-700">
                        Turno de hoy: 3 facturas emitidas
                    </span>
                </div>

                <div class="overflow-x-auto rounded-xl border border-navy-800/80">
                    <table class="w-full text-left text-body-sm">
                        <thead class="bg-navy-950/60 font-label text-label-sm text-celeste-300 uppercase tracking-wider border-b border-navy-800">
                            <tr>
                                <th class="p-3.5">N° Comprobante</th>
                                <th class="p-3.5">Hora</th>
                                <th class="p-3.5">Camaronera / Cliente</th>
                                <th class="p-3.5">Insumos Despachados</th>
                                <th class="p-3.5">Método de Pago</th>
                                <th class="p-3.5 text-right">Total USD</th>
                                <th class="p-3.5 text-center">Estado</th>
                                <th class="p-3.5 text-center">Comprobante</th>
                            </tr>
                        </thead>
                        <tbody data-sales-tbody class="divide-y divide-navy-800/50 font-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `);

    // Renderizar Catálogo de Insumos
    const catalogGrid = el.querySelector('[data-catalog-grid]');
    function renderCatalog(items) {
        catalogGrid.innerHTML = '';
        items.forEach(item => {
            const card = fromHTML(`
                <div class="p-3.5 rounded-xl bg-surface-container-low border border-navy-800 hover:border-celeste-500/50 transition-all flex flex-col justify-between group">
                    <div>
                        <div class="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                            <span class="font-mono text-celeste-400 font-bold">${item.code}</span>
                            <span class="text-[11px] bg-navy-800 px-2 py-0.5 rounded text-celeste-300">${item.category}</span>
                        </div>
                        <h4 class="font-headline text-body-sm font-bold text-white group-hover:text-celeste-300 transition-colors">${item.name}</h4>
                        <span class="text-[11px] text-on-surface-variant">Stock en bodega: <strong class="text-white">${item.stock}</strong></span>
                    </div>
                    <div class="flex items-center justify-between mt-3 pt-2 border-t border-navy-800/60">
                        <span class="font-mono font-bold text-secondary text-base">$${item.price.toFixed(2)}</span>
                        <button type="button" data-add-item
                            class="h-8 px-3 rounded-lg bg-celeste-600 hover:bg-celeste-500 text-white font-label text-xs font-bold flex items-center gap-1 transition-colors">
                            <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                            Agregar
                        </button>
                    </div>
                </div>
            `);

            card.querySelector('[data-add-item]').addEventListener('click', () => {
                addToCart(item);
            });

            catalogGrid.append(card);
        });
    }
    renderCatalog(INVENTORY);

    // Búsqueda en catálogo
    const catalogSearch = el.querySelector('[data-search-catalog]');
    catalogSearch.addEventListener('input', () => {
        const q = catalogSearch.value.toLowerCase().trim();
        const filtered = INVENTORY.filter(i => i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
        renderCatalog(filtered);
    });

    // Manejo del Carrito / Factura
    function addToCart(product) {
        const existing = cart.find(i => i.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        renderCart();
    }

    const cartContainer = el.querySelector('[data-cart-items]');
    const subtotalEl = el.querySelector('[data-subtotal]');
    const ivaEl = el.querySelector('[data-iva]');
    const totalEl = el.querySelector('[data-total]');

    function renderCart() {
        cartContainer.innerHTML = '';
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-xs text-on-surface-variant text-center py-4">No hay insumos seleccionados en esta venta.</p>';
            subtotalEl.textContent = '$0.00';
            ivaEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            return;
        }

        let subtotal = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            const row = fromHTML(`
                <div class="pt-2 pb-1 flex items-center justify-between text-xs gap-2">
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-white truncate">${item.name}</p>
                        <span class="text-on-surface-variant text-[11px] font-mono">$${item.price.toFixed(2)} c/u</span>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                        <button type="button" data-dec class="w-6 h-6 rounded bg-navy-800 text-celeste-300 hover:text-white flex items-center justify-center font-bold">-</button>
                        <span class="w-7 text-center font-mono text-white font-bold">${item.qty}</span>
                        <button type="button" data-inc class="w-6 h-6 rounded bg-navy-800 text-celeste-300 hover:text-white flex items-center justify-center font-bold">+</button>
                    </div>
                    <div class="text-right w-16 shrink-0 font-mono font-bold text-white">
                        $${itemTotal.toFixed(2)}
                    </div>
                    <button type="button" data-del class="p-1 text-on-surface-variant hover:text-error">
                        <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            `);

            row.querySelector('[data-inc]').addEventListener('click', () => { item.qty += 1; renderCart(); });
            row.querySelector('[data-dec]').addEventListener('click', () => {
                if (item.qty > 1) { item.qty -= 1; } else { cart.splice(index, 1); }
                renderCart();
            });
            row.querySelector('[data-del]').addEventListener('click', () => { cart.splice(index, 1); renderCart(); });

            cartContainer.append(row);
        });

        const iva = subtotal * 0.15; // IVA 15% Ecuador
        const total = subtotal + iva;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        ivaEl.textContent = `$${iva.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }
    renderCart();

    el.querySelector('[data-clear-cart]').addEventListener('click', () => {
        cart = [];
        renderCart();
    });

    // Acción de Checkout / Cobrar
    el.querySelector('[data-checkout]').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Agrega al menos un producto al detalle de venta.');
            return;
        }

        const clientRuc = el.querySelector('[data-client-select]').value;
        const clientObj = CLIENTS.find(c => c.ruc === clientRuc);
        const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
        const iva = subtotal * 0.15;
        const total = subtotal + iva;
        const method = el.querySelector('[data-pay-method]').value;
        const facNum = `FAC-001-098${SALES_HISTORY.length + 1}`;

        const newSale = {
            num: facNum,
            time: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
            client: clientObj ? clientObj.name : 'Cliente General',
            ruc: clientRuc,
            items: `${cart.length} tipo(s) de insumos`,
            subtotal: subtotal,
            iva: iva,
            total: total,
            method: method,
            status: 'Pagado'
        };

        SALES_HISTORY.unshift(newSale);
        renderSales();
        cart = [];
        renderCart();

        // Mostrar Comprobante Modal
        const successModal = fromHTML(`
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
                <div class="w-full max-w-md bg-surface-container rounded-2xl p-6 border border-secondary/40 shadow-2xl space-y-4 text-center">
                    <div class="w-16 h-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mx-auto">
                        <span class="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h3 class="font-headline text-headline-sm text-white font-bold">¡Venta Registrada Exitosamente!</h3>
                    <p class="font-body text-body-sm text-on-surface-variant">
                        Se ha generado el comprobante <strong>${facNum}</strong> para <strong>${newSale.client}</strong>.
                    </p>
                    <div class="bg-navy-950/60 p-3.5 rounded-xl border border-navy-800 font-mono text-sm space-y-1 text-left">
                        <div class="flex justify-between text-on-surface-variant"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
                        <div class="flex justify-between text-on-surface-variant"><span>IVA (15%):</span><span>$${iva.toFixed(2)}</span></div>
                        <div class="flex justify-between text-secondary font-bold text-base border-t border-navy-800 pt-1"><span>Total Cobrado:</span><span>$${total.toFixed(2)}</span></div>
                    </div>
                    <button type="button" data-close-fac
                        class="w-full h-11 rounded-xl bg-celeste-600 hover:bg-celeste-500 text-white font-label font-bold flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-lg">print</span>
                        Imprimir Comprobante de Despacho
                    </button>
                </div>
            </div>
        `);
        successModal.querySelector('[data-close-fac]').addEventListener('click', () => successModal.remove());
        document.body.append(successModal);
    });

    // Renderizar Historial de Ventas
    const salesTbody = el.querySelector('[data-sales-tbody]');
    function renderSales() {
        salesTbody.innerHTML = '';
        SALES_HISTORY.forEach(s => {
            const tr = fromHTML(`
                <tr class="hover:bg-navy-800/40 transition-colors">
                    <td class="p-3.5 font-label font-bold text-celeste-300">${s.num}</td>
                    <td class="p-3.5 text-on-surface-variant text-xs font-mono">${s.time}</td>
                    <td class="p-3.5 font-medium text-white">${s.client}</td>
                    <td class="p-3.5 text-on-surface-variant text-xs">${s.items}</td>
                    <td class="p-3.5 text-on-surface-variant text-xs">${s.method}</td>
                    <td class="p-3.5 text-right font-mono font-bold text-secondary">$${s.total.toFixed(2)}</td>
                    <td class="p-3.5 text-center">
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-label font-bold ${
                            s.status === 'Pagado' ? 'bg-secondary/20 text-secondary' : 'bg-yellow-500/20 text-yellow-300'
                        }">${s.status}</span>
                    </td>
                    <td class="p-3.5 text-center">
                        <button type="button" class="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-celeste-300 hover:text-white" title="Ver Detalle">
                            <span class="material-symbols-outlined text-base">visibility</span>
                        </button>
                    </td>
                </tr>
            `);
            salesTbody.append(tr);
        });
    }
    renderSales();

    return el;
}
