import { fromHTML, setText } from '../../utils/dom.js';

/**
 * Pantalla 3: Dashboard del Administrador
 * - Resumen de empleados, productos, ventas y pedidos (Tarjetas informativas).
 * - Gestión de usuarios y asignación de roles.
 * - Gestión de productos, categorías e inventario de insumos.
 * - Consulta de ventas y reportes.
 * - Acceso a las funciones generales del sistema.
 */
export function AdminDashboardView() {
    // Datos ficticios representativos del sector camaronero ecuatoriano
    const EMPLOYEES = [
        { id: 'EMP-001', name: 'Ing. Carlos Mendoza', email: 'carlos.m@aquainsumos.ec', role: 'ADMIN', phone: '0994512301', status: 'Activo' },
        { id: 'EMP-002', name: 'Lcda. Andrea Solórzano', email: 'andrea.s@aquainsumos.ec', role: 'CAJERO', phone: '0987123490', status: 'Activo' },
        { id: 'EMP-003', name: 'Biól. Roberto Noboa', email: 'roberto.n@aquainsumos.ec', role: 'GESTOR_CLIENTES', phone: '0998765412', status: 'En campo' },
        { id: 'EMP-004', name: 'Mariana Vera', email: 'mariana.v@aquainsumos.ec', role: 'CAJERO', phone: '0991209384', status: 'Activo' },
        { id: 'EMP-005', name: 'Ing. Fernando Campuzano', email: 'fernando.c@aquainsumos.ec', role: 'GESTOR_CLIENTES', phone: '0981928374', status: 'En campo' }
    ];

    const PRODUCTS = [
        { code: 'BAL-35', name: 'Balanceado Camaronero 35% Proteína', category: 'Alimento Balanceado', presentation: 'Saco 25 kg', stock: 1240, price: 34.50, status: 'Óptimo' },
        { code: 'BAL-40', name: 'Iniciador Larval 40% Alta Digestibilidad', category: 'Larvicultura', presentation: 'Saco 20 kg', stock: 320, price: 46.00, status: 'Óptimo' },
        { code: 'BIO-PRO', name: 'Probiótico BioAqua Piscinas (Bacillus)', category: 'Biorremediación', presentation: 'Caneca 5 kg', stock: 85, price: 92.00, status: 'Bajo' },
        { code: 'CARB-CA', name: 'Carbonato de Calcio Agrícola', category: 'Enmiendas Químicas', presentation: 'Saco 50 kg', stock: 890, price: 8.75, status: 'Óptimo' },
        { code: 'MEL-200', name: 'Melaza Concentrada de Caña', category: 'Insumos Orgánicos', presentation: 'Tanque 200 L', stock: 45, price: 78.00, status: 'Crítico' },
        { code: 'AIR-2HP', name: 'Aireador de 4 Paletas Motor Eléctrico 2HP', category: 'Equipos & Aireación', presentation: 'Unidad', stock: 24, price: 420.00, status: 'Óptimo' }
    ];

    const el = fromHTML(`
        <div class="space-y-6">
            <!-- Banner de Identificación del Rol -->
            <div class="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-celeste-500/20 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-celeste-500/10 border border-celeste-400/30 flex items-center justify-center text-celeste-400 shrink-0 shadow-inner">
                        <span class="material-symbols-outlined text-3xl">admin_panel_settings</span>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-celeste-500/20 text-celeste-300 font-label text-label-sm font-bold uppercase tracking-wider">
                                Mando Administrativo General
                            </span>
                            <span class="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                        </div>
                        <h2 class="font-headline text-headline-md text-white font-bold mt-1">Control Global de Operaciones</h2>
                        <p class="font-body text-body-sm text-on-surface-variant">Supervisión integral de ventas, inventario camaronero y equipo de trabajo.</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 self-start md:self-auto">
                    <button type="button" data-refresh class="h-10 px-4 rounded-xl bg-navy-800 hover:bg-navy-700 text-celeste-300 font-label text-label-sm flex items-center gap-2 border border-navy-700 transition-colors">
                        <span class="material-symbols-outlined text-base">refresh</span>
                        Actualizar datos
                    </button>
                </div>
            </div>

            <!-- TARJETAS INFORMATIVAS (KPIs) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Personal Activo</span>
                        <p class="font-headline text-headline-lg font-bold text-white mt-1">18 <span class="text-xs font-normal text-celeste-400">colaboradores</span></p>
                        <span class="text-[11px] text-secondary flex items-center gap-1 mt-1 font-label">
                            <span class="material-symbols-outlined text-sm">check_circle</span> 100% de turnos cubiertos
                        </span>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-celeste-400 shadow-sm">
                        <span class="material-symbols-outlined text-2xl">badge</span>
                    </div>
                </div>

                <div class="bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Catálogo Insumos</span>
                        <p class="font-headline text-headline-lg font-bold text-white mt-1">142 <span class="text-xs font-normal text-celeste-400">ítems activos</span></p>
                        <span class="text-[11px] text-celeste-300 flex items-center gap-1 mt-1 font-label">
                            <span class="material-symbols-outlined text-sm">inventory_2</span> 6 categorías clave
                        </span>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-primary shadow-sm">
                        <span class="material-symbols-outlined text-2xl">layers</span>
                    </div>
                </div>

                <div class="bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Ventas del Mes</span>
                        <p class="font-headline text-headline-lg font-bold text-white mt-1">$184,520 <span class="text-xs font-normal text-celeste-400">USD</span></p>
                        <span class="text-[11px] text-secondary flex items-center gap-1 mt-1 font-label">
                            <span class="material-symbols-outlined text-sm">trending_up</span> +14.2% vs ciclo anterior
                        </span>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-secondary shadow-sm">
                        <span class="material-symbols-outlined text-2xl">payments</span>
                    </div>
                </div>

                <div class="bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="font-label text-label-sm text-on-surface-variant uppercase tracking-wider">Pedidos en Despacho</span>
                        <p class="font-headline text-headline-lg font-bold text-white mt-1">28 <span class="text-xs font-normal text-celeste-400">camaroneras</span></p>
                        <span class="text-[11px] text-celeste-300 flex items-center gap-1 mt-1 font-label">
                            <span class="material-symbols-outlined text-sm">local_shipping</span> 65 toneladas hoy
                        </span>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-tertiary shadow-sm">
                        <span class="material-symbols-outlined text-2xl">forklift</span>
                    </div>
                </div>
            </div>

            <!-- GESTIÓN DE PRODUCTOS, CATEGORÍAS E INVENTARIO -->
            <div class="bg-surface-container rounded-2xl p-6 border border-navy-700/50 shadow-md space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-celeste-400">inventory</span>
                            Gestión de Productos e Inventario de Insumos
                        </h3>
                        <p class="font-body text-body-sm text-on-surface-variant">Alimentos balanceados, larvicultura, aditivos químicos y equipos para camaroneras.</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="text" data-search-prod placeholder="Buscar por código o producto…"
                            class="h-10 px-3.5 rounded-xl bg-surface-container-low border border-navy-700 text-body-sm text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-celeste-500 w-64">
                        <button type="button" data-add-prod class="h-10 px-4 rounded-xl bg-celeste-600 hover:bg-celeste-500 text-white font-label text-label-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm shrink-0">
                            <span class="material-symbols-outlined text-lg">add_circle</span>
                            Nuevo Insumo
                        </button>
                    </div>
                </div>

                <!-- Tabla de Productos e Inventario -->
                <div class="overflow-x-auto rounded-xl border border-navy-800/80">
                    <table class="w-full text-left text-body-sm">
                        <thead class="bg-navy-950/60 font-label text-label-sm text-celeste-300 uppercase tracking-wider border-b border-navy-800">
                            <tr>
                                <th class="p-3.5">Código</th>
                                <th class="p-3.5">Insumo Camaronero</th>
                                <th class="p-3.5">Categoría</th>
                                <th class="p-3.5">Presentación</th>
                                <th class="p-3.5 text-right">Stock</th>
                                <th class="p-3.5 text-right">Precio USD</th>
                                <th class="p-3.5 text-center">Estado</th>
                                <th class="p-3.5 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody data-products-tbody class="divide-y divide-navy-800/50 font-body"></tbody>
                    </table>
                </div>
            </div>

            <!-- GESTIÓN DE EMPLEADOS Y ASIGNACIÓN DE ROLES -->
            <div class="bg-surface-container rounded-2xl p-6 border border-navy-700/50 shadow-md space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-celeste-400">manage_accounts</span>
                            Personal de la Empresa y Asignación de Roles
                        </h3>
                        <p class="font-body text-body-sm text-on-surface-variant">Control de accesos y permisos por trabajador interno.</p>
                    </div>
                    <span class="text-xs font-label text-celeste-300 bg-navy-800 px-3 py-1.5 rounded-full border border-navy-700">
                        Total de colaboradores registrados: ${EMPLOYEES.length}
                    </span>
                </div>

                <!-- Tabla de Empleados -->
                <div class="overflow-x-auto rounded-xl border border-navy-800/80">
                    <table class="w-full text-left text-body-sm">
                        <thead class="bg-navy-950/60 font-label text-label-sm text-celeste-300 uppercase tracking-wider border-b border-navy-800">
                            <tr>
                                <th class="p-3.5">ID Empleado</th>
                                <th class="p-3.5">Nombres y Apellidos</th>
                                <th class="p-3.5">Correo Corporativo</th>
                                <th class="p-3.5">Teléfono</th>
                                <th class="p-3.5">Rol en el Sistema</th>
                                <th class="p-3.5 text-center">Estado</th>
                                <th class="p-3.5 text-center">Modificar Rol</th>
                            </tr>
                        </thead>
                        <tbody data-employees-tbody class="divide-y divide-navy-800/50 font-body"></tbody>
                    </table>
                </div>
            </div>

            <!-- REPORTES DE VENTAS POR ZONA CAMARONERA ECUATORIANA -->
            <div class="bg-surface-container rounded-2xl p-6 border border-navy-700/50 shadow-md space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-secondary">analytics</span>
                            Reportes de Ventas por Zona Acuícola (Ecuador)
                        </h3>
                        <p class="font-body text-body-sm text-on-surface-variant">Distribución geográfica de despachos de alimento balanceado y aditivos.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                    <div class="p-4 rounded-xl bg-surface-container-low border border-navy-800 flex flex-col justify-between">
                        <div class="flex items-center justify-between text-xs text-on-surface-variant font-label">
                            <span>Provincia del Guayas</span>
                            <span class="text-celeste-400 font-bold">52%</span>
                        </div>
                        <p class="font-headline text-headline-md font-bold text-white my-2">$95,950 <span class="text-xs font-normal text-celeste-300">USD</span></p>
                        <div class="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
                            <div class="h-full bg-celeste-500 rounded-full" style="width: 52%"></div>
                        </div>
                        <span class="text-[11px] text-on-surface-variant mt-2">Sectores: Taura, Samborondón, Puná</span>
                    </div>

                    <div class="p-4 rounded-xl bg-surface-container-low border border-navy-800 flex flex-col justify-between">
                        <div class="flex items-center justify-between text-xs text-on-surface-variant font-label">
                            <span>Provincia de El Oro</span>
                            <span class="text-celeste-400 font-bold">28%</span>
                        </div>
                        <p class="font-headline text-headline-md font-bold text-white my-2">$51,660 <span class="text-xs font-normal text-celeste-300">USD</span></p>
                        <div class="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
                            <div class="h-full bg-secondary rounded-full" style="width: 28%"></div>
                        </div>
                        <span class="text-[11px] text-on-surface-variant mt-2">Sectores: Machala, Santa Rosa, Jambelí</span>
                    </div>

                    <div class="p-4 rounded-xl bg-surface-container-low border border-navy-800 flex flex-col justify-between">
                        <div class="flex items-center justify-between text-xs text-on-surface-variant font-label">
                            <span>Provincia de Manabí</span>
                            <span class="text-celeste-400 font-bold">14%</span>
                        </div>
                        <p class="font-headline text-headline-md font-bold text-white my-2">$25,830 <span class="text-xs font-normal text-celeste-300">USD</span></p>
                        <div class="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
                            <div class="h-full bg-primary rounded-full" style="width: 14%"></div>
                        </div>
                        <span class="text-[11px] text-on-surface-variant mt-2">Sectores: Pedernales, Bahía, Cojimíes</span>
                    </div>

                    <div class="p-4 rounded-xl bg-surface-container-low border border-navy-800 flex flex-col justify-between">
                        <div class="flex items-center justify-between text-xs text-on-surface-variant font-label">
                            <span>Santa Elena / Esmeraldas</span>
                            <span class="text-celeste-400 font-bold">6%</span>
                        </div>
                        <p class="font-headline text-headline-md font-bold text-white my-2">$11,080 <span class="text-xs font-normal text-celeste-300">USD</span></p>
                        <div class="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
                            <div class="h-full bg-tertiary rounded-full" style="width: 6%"></div>
                        </div>
                        <span class="text-[11px] text-on-surface-variant mt-2">Sectores: Chanduy, San Lorenzo</span>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Renderizar Productos
    const prodTbody = el.querySelector('[data-products-tbody]');
    function renderProducts(list) {
        prodTbody.innerHTML = '';
        list.forEach(p => {
            const tr = fromHTML(`
                <tr class="hover:bg-navy-800/40 transition-colors">
                    <td class="p-3.5 font-label font-bold text-celeste-300">${p.code}</td>
                    <td class="p-3.5 font-medium text-white">${p.name}</td>
                    <td class="p-3.5 text-on-surface-variant">${p.category}</td>
                    <td class="p-3.5 text-on-surface-variant text-xs">${p.presentation}</td>
                    <td class="p-3.5 text-right font-mono font-bold ${p.stock < 100 ? 'text-error' : 'text-white'}">${p.stock.toLocaleString()}</td>
                    <td class="p-3.5 text-right font-mono font-bold text-secondary">$${p.price.toFixed(2)}</td>
                    <td class="p-3.5 text-center">
                        <span class="px-2.5 py-1 rounded-full text-xs font-label font-semibold ${
                            p.status === 'Óptimo' ? 'bg-secondary/20 text-secondary' :
                            p.status === 'Bajo' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-error-container/40 text-error'
                        }">${p.status}</span>
                    </td>
                    <td class="p-3.5 text-center">
                        <button type="button" class="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-celeste-300 hover:text-white transition-colors" title="Ajustar Stock">
                            <span class="material-symbols-outlined text-base">edit</span>
                        </button>
                    </td>
                </tr>
            `);
            prodTbody.append(tr);
        });
    }
    renderProducts(PRODUCTS);

    // Búsqueda en vivo de productos
    const searchInput = el.querySelector('[data-search-prod]');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
        renderProducts(filtered);
    });

    // Modal para agregar nuevo insumo
    el.querySelector('[data-add-prod]').addEventListener('click', () => {
        const modal = fromHTML(`
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
                <div class="w-full max-w-lg bg-surface-container rounded-2xl p-6 border border-celeste-500/30 shadow-2xl space-y-4">
                    <div class="flex items-center justify-between border-b border-navy-800 pb-3">
                        <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-celeste-400">add_box</span>
                            Registrar Nuevo Insumo Camaronero
                        </h3>
                        <button type="button" data-close-modal class="p-1 rounded-lg text-on-surface-variant hover:text-white">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <form class="space-y-3" id="form-new-prod">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Código</label>
                                <input type="text" required name="code" placeholder="Ej. BAL-38" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                            </div>
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Categoría</label>
                                <select name="category" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                                    <option>Alimento Balanceado</option>
                                    <option>Larvicultura</option>
                                    <option>Biorremediación</option>
                                    <option>Enmiendas Químicas</option>
                                    <option>Equipos & Aireación</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-label text-on-surface-variant mb-1">Nombre Comercial del Insumo</label>
                            <input type="text" required name="name" placeholder="Ej. Balanceado Engorde 38% Pellet" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                        </div>
                        <div class="grid grid-cols-3 gap-3">
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Presentación</label>
                                <input type="text" required name="presentation" placeholder="Saco 25kg" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                            </div>
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Stock Inicial</label>
                                <input type="number" required name="stock" placeholder="500" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                            </div>
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Precio USD ($)</label>
                                <input type="number" step="0.01" required name="price" placeholder="32.00" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                            </div>
                        </div>
                        <div class="pt-3 flex items-center justify-end gap-2">
                            <button type="button" data-close-modal class="h-10 px-4 rounded-xl bg-navy-800 text-on-surface-variant hover:text-white font-label text-label-sm">Cancelar</button>
                            <button type="submit" class="h-10 px-5 rounded-xl bg-celeste-600 hover:bg-celeste-500 text-white font-label text-label-sm font-bold flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-base">save</span>
                                Guardar en Catálogo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `);
        modal.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', () => modal.remove()));
        modal.querySelector('#form-new-prod').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newP = {
                code: formData.get('code'),
                name: formData.get('name'),
                category: formData.get('category'),
                presentation: formData.get('presentation'),
                stock: parseInt(formData.get('stock')),
                price: parseFloat(formData.get('price')),
                status: 'Óptimo'
            };
            PRODUCTS.unshift(newP);
            renderProducts(PRODUCTS);
            modal.remove();
        });
        document.body.append(modal);
    });

    // Renderizar Empleados
    const empTbody = el.querySelector('[data-employees-tbody]');
    function renderEmployees() {
        empTbody.innerHTML = '';
        EMPLOYEES.forEach((emp, idx) => {
            const roleLabels = {
                ADMIN: { label: 'Administrador General', color: 'bg-primary/20 text-primary border-primary/30' },
                CAJERO: { label: 'Cajero / Facturación', color: 'bg-secondary/20 text-secondary border-secondary/30' },
                GESTOR_CLIENTES: { label: 'Gestor de Camaroneras', color: 'bg-celeste-500/20 text-celeste-300 border-celeste-500/30' }
            };
            const roleCfg = roleLabels[emp.role] || { label: emp.role, color: 'bg-navy-800 text-white border-navy-700' };

            const tr = fromHTML(`
                <tr class="hover:bg-navy-800/40 transition-colors">
                    <td class="p-3.5 font-label font-bold text-celeste-300">${emp.id}</td>
                    <td class="p-3.5 font-medium text-white flex items-center gap-2">
                        <span class="w-7 h-7 rounded-full bg-navy-800 text-celeste-300 flex items-center justify-center text-xs font-bold font-label">
                            ${emp.name.charAt(0)}
                        </span>
                        ${emp.name}
                    </td>
                    <td class="p-3.5 text-on-surface-variant font-mono text-xs">${emp.email}</td>
                    <td class="p-3.5 text-on-surface-variant font-mono text-xs">${emp.phone}</td>
                    <td class="p-3.5">
                        <span class="px-2.5 py-1 rounded-full text-xs font-label font-bold border ${roleCfg.color}">
                            ${roleCfg.label}
                        </span>
                    </td>
                    <td class="p-3.5 text-center">
                        <span class="flex items-center justify-center gap-1 text-xs text-secondary font-label">
                            <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            ${emp.status}
                        </span>
                    </td>
                    <td class="p-3.5 text-center">
                        <select data-role-select="${idx}" class="h-8 px-2 rounded-lg bg-surface-container-low border border-navy-700 text-xs font-label text-white focus:outline-none focus:border-celeste-500">
                            <option value="ADMIN" ${emp.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
                            <option value="CAJERO" ${emp.role === 'CAJERO' ? 'selected' : ''}>Cajero</option>
                            <option value="GESTOR_CLIENTES" ${emp.role === 'GESTOR_CLIENTES' ? 'selected' : ''}>Gestor Clientes</option>
                        </select>
                    </td>
                </tr>
            `);

            tr.querySelector(`[data-role-select="${idx}"]`).addEventListener('change', (e) => {
                emp.role = e.target.value;
                renderEmployees();
            });

            empTbody.append(tr);
        });
    }
    renderEmployees();

    return el;
}
