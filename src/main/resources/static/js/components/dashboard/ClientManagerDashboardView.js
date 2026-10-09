import { fromHTML, setText } from '../../utils/dom.js';

/**
 * Pantalla 5: Dashboard del Cliente Interno (Gestor de Camaroneras)
 * - Interfaz para el trabajador encargado de gestionar clientes de la empresa.
 * - Registrar nuevos clientes comerciales (camaroneras y distribuidores).
 * - Consultar y editar información de clientes.
 * - Revisar el historial de compras y pedidos de cada cliente comercial.
 */
export function ClientManagerDashboardView() {
    const SHRIMP_FARMS = [
        {
            id: 'CLI-001',
            name: 'Camaronera San Vicente Cía. Ltda.',
            legalName: 'SAN VICENTE AQUACULTURE S.A.',
            ruc: '0992348576001',
            zone: 'Taura, Guayas',
            hectares: 120,
            ponds: 18,
            contact: 'Ing. Gustavo Alava',
            phone: '0994112233',
            email: 'administracion@sanvicente.ec',
            creditLimit: 50000,
            status: 'Activo',
            orders: [
                { id: 'PED-412', date: '2026-10-04', items: '600 sacos Balanceado 35%, 10 canecas Probiótico', total: 21620, status: 'Despachado' },
                { id: 'PED-380', date: '2026-09-12', items: '400 sacos Balanceado 40%, 50 sacos Carbonato', total: 18837, status: 'Completado' },
                { id: 'PED-310', date: '2026-08-01', items: '500 sacos Balanceado 35%', total: 17250, status: 'Completado' }
            ]
        },
        {
            id: 'CLI-002',
            name: 'Acuícola Jambelí del Mar S.A.',
            legalName: 'ACUICOLA JAMBELI DEL SUR CIA.',
            ruc: '0791823746001',
            zone: 'Santa Rosa, El Oro',
            hectares: 85,
            ponds: 12,
            contact: 'Biól. Patricio Mora',
            phone: '0987445566',
            email: 'pmora@jambelimar.com',
            creditLimit: 35000,
            status: 'Activo',
            orders: [
                { id: 'PED-405', date: '2026-09-28', items: '300 sacos Balanceado 35%, 20 canecas Melaza', total: 11910, status: 'Completado' }
            ]
        },
        {
            id: 'CLI-003',
            name: 'Producción Camaronera Pedernales',
            legalName: 'CAMARONERA DEL PACIFICO PEDERNALES',
            ruc: '1391829384001',
            zone: 'Pedernales, Manabí',
            hectares: 210,
            ponds: 32,
            contact: 'Ing. Karla Cevallos',
            phone: '0993556677',
            email: 'compras@pedernalesaqua.ec',
            creditLimit: 80000,
            status: 'Activo',
            orders: [
                { id: 'PED-420', date: '2026-10-08', items: '1,200 sacos Balanceado 35%, 4 Aireadores 2HP', total: 43080, status: 'En preparación' }
            ]
        },
        {
            id: 'CLI-004',
            name: 'Agrícola & Camaronera Isla Puná',
            legalName: 'PUNA AQUACULTURE HOLDINGS',
            ruc: '0993847261001',
            zone: 'Isla Puná, Golfo de Guayaquil',
            hectares: 340,
            ponds: 45,
            contact: 'Econ. Jaime Estrada',
            phone: '0981223344',
            email: 'jestrada@camaronerapuna.com',
            creditLimit: 120000,
            status: 'Activo',
            orders: [
                { id: 'PED-399', date: '2026-09-20', items: '800 sacos Balanceado 35%, 150 sacos Carbonato', total: 28910, status: 'Completado' }
            ]
        }
    ];

    let selectedClient = SHRIMP_FARMS[0];

    const el = fromHTML(`
        <div class="space-y-6">
            <!-- Header del Módulo de Clientes Comerciales -->
            <div class="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-celeste-500/20 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-celeste-500/10 border border-celeste-400/30 flex items-center justify-center text-celeste-400 shrink-0 shadow-inner">
                        <span class="material-symbols-outlined text-3xl">domain</span>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-celeste-500/20 text-celeste-300 font-label text-label-sm font-bold uppercase tracking-wider">
                                Cartera de Clientes Comerciales
                            </span>
                            <span class="text-xs text-on-surface-variant font-label">Atención y Seguimiento a Camaroneras</span>
                        </div>
                        <h2 class="font-headline text-headline-md text-white font-bold mt-1">Gestión de Camaroneras y Distribuidores</h2>
                        <p class="font-body text-body-sm text-on-surface-variant">Registro de fincas, datos de piscinas, contacto técnico e historial de pedidos de balanceado.</p>
                    </div>
                </div>
                <button type="button" data-open-new-client
                    class="h-11 px-5 rounded-xl bg-celeste-600 hover:bg-celeste-500 text-white font-label text-label-sm font-bold flex items-center gap-2 transition-all shadow-md self-start md:self-auto shrink-0">
                    <span class="material-symbols-outlined text-lg">add_business</span>
                    Registrar Nueva Camaronera
                </button>
            </div>

            <!-- TARJETAS DE RESUMEN DE CARTERA -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="font-label text-label-sm text-on-surface-variant uppercase">Camaroneras Vinculadas</span>
                        <p class="font-headline text-headline-lg font-bold text-white mt-1">${SHRIMP_FARMS.length} <span class="text-xs font-normal text-celeste-400">empresas</span></p>
                        <span class="text-[11px] text-secondary font-label">100% verificadas con RUC</span>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-celeste-400">
                        <span class="material-symbols-outlined text-2xl">water</span>
                    </div>
                </div>

                <div class="bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="font-label text-label-sm text-on-surface-variant uppercase">Espejo de Agua Atendido</span>
                        <p class="font-headline text-headline-lg font-bold text-white mt-1">755 <span class="text-xs font-normal text-celeste-400">hectáreas</span></p>
                        <span class="text-[11px] text-celeste-300 font-label">107 piscinas en producción</span>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined text-2xl">crop_free</span>
                    </div>
                </div>

                <div class="bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-sm flex items-center justify-between">
                    <div>
                        <span class="font-label text-label-sm text-on-surface-variant uppercase">Línea de Crédito Global</span>
                        <p class="font-headline text-headline-lg font-bold text-white mt-1">$285,000 <span class="text-xs font-normal text-celeste-400">USD</span></p>
                        <span class="text-[11px] text-secondary font-label">Crédito a 30 días autorizado</span>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-secondary">
                        <span class="material-symbols-outlined text-2xl">account_balance</span>
                    </div>
                </div>
            </div>

            <!-- CONTENEDOR DE DIRECTORIO Y DETALLE DEL CLIENTE -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- TABLA DE CAMARONERAS (Col 7) -->
                <div class="lg:col-span-7 bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-md space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-celeste-400">format_list_bulleted</span>
                            Directorio de Camaroneras
                        </h3>
                    </div>

                    <input type="text" data-search-farms placeholder="Buscar por nombre, RUC o zona geográfica…"
                        class="w-full h-10 px-3.5 rounded-xl bg-surface-container-low border border-navy-700 text-body-sm text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-celeste-500">

                    <div class="overflow-x-auto rounded-xl border border-navy-800/80">
                        <table class="w-full text-left text-body-sm">
                            <thead class="bg-navy-950/60 font-label text-label-sm text-celeste-300 uppercase tracking-wider border-b border-navy-800">
                                <tr>
                                    <th class="p-3">Camaronera</th>
                                    <th class="p-3">RUC</th>
                                    <th class="p-3">Sector</th>
                                    <th class="p-3 text-right">Has.</th>
                                    <th class="p-3 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody data-farms-tbody class="divide-y divide-navy-800/50 font-body"></tbody>
                        </table>
                    </div>
                </div>

                <!-- FICHA TÉCNICA E HISTORIAL DE PEDIDOS (Col 5) -->
                <div class="lg:col-span-5 bg-surface-container rounded-2xl p-5 border border-navy-700/50 shadow-md space-y-4">
                    <div class="border-b border-navy-800 pb-3 flex items-center justify-between">
                        <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-secondary">assignment</span>
                            Ficha del Cliente & Pedidos
                        </h3>
                        <button type="button" data-edit-client class="text-xs font-label text-celeste-400 hover:underline flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">edit</span> Editar
                        </button>
                    </div>

                    <!-- Datos Técnicos de la Finca Seleccionada -->
                    <div data-client-details class="p-4 rounded-xl bg-surface-container-low border border-navy-800 space-y-2 text-xs">
                        <h4 data-detail-name class="font-headline text-sm font-bold text-white"></h4>
                        <p data-detail-ruc class="text-celeste-300 font-mono"></p>
                        <div class="grid grid-cols-2 gap-2 pt-2 text-on-surface-variant">
                            <div>Ubicación: <strong data-detail-zone class="text-white block"></strong></div>
                            <div>Área de Piscina: <strong data-detail-hectares class="text-white block"></strong></div>
                            <div>Contacto Técnico: <strong data-detail-contact class="text-white block"></strong></div>
                            <div>Teléfono Móvil: <strong data-detail-phone class="text-white block font-mono"></strong></div>
                        </div>
                    </div>

                    <!-- Historial de Compras y Pedidos de la Camaronera -->
                    <div class="space-y-3">
                        <h4 class="font-label text-xs uppercase tracking-wider text-celeste-400 font-bold flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-base">history_edu</span>
                            Historial de Compras y Despachos
                        </h4>
                        <div data-client-orders class="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Renderizar Directorio de Camaroneras
    const farmsTbody = el.querySelector('[data-farms-tbody]');
    function renderFarms(list) {
        farmsTbody.innerHTML = '';
        list.forEach(farm => {
            const isSelected = farm.id === selectedClient.id;
            const tr = fromHTML(`
                <tr class="hover:bg-navy-800/40 transition-colors cursor-pointer ${isSelected ? 'bg-navy-800/60' : ''}">
                    <td class="p-3">
                        <strong class="text-white block font-medium">${farm.name}</strong>
                        <span class="text-[11px] text-on-surface-variant">${farm.contact}</span>
                    </td>
                    <td class="p-3 font-mono text-xs text-celeste-300">${farm.ruc}</td>
                    <td class="p-3 text-on-surface-variant text-xs">${farm.zone}</td>
                    <td class="p-3 text-right font-mono text-white font-bold">${farm.hectares} ha</td>
                    <td class="p-3 text-center">
                        <button type="button" class="px-2.5 py-1 rounded-lg ${isSelected ? 'bg-celeste-600 text-white' : 'bg-navy-800 text-celeste-300'} font-label text-xs font-bold">
                            Ver
                        </button>
                    </td>
                </tr>
            `);

            tr.addEventListener('click', () => {
                selectedClient = farm;
                renderFarms(list);
                renderDetails();
            });

            farmsTbody.append(tr);
        });
    }
    renderFarms(SHRIMP_FARMS);

    // Búsqueda en Directorio
    const searchInput = el.querySelector('[data-search-farms]');
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        const filtered = SHRIMP_FARMS.filter(f => f.name.toLowerCase().includes(q) || f.ruc.includes(q) || f.zone.toLowerCase().includes(q));
        renderFarms(filtered);
    });

    // Renderizar Detalles e Historial
    function renderDetails() {
        setText(el, '[data-detail-name]', selectedClient.name);
        setText(el, '[data-detail-ruc]', `RUC: ${selectedClient.ruc}`);
        setText(el, '[data-detail-zone]', selectedClient.zone);
        setText(el, '[data-detail-hectares]', `${selectedClient.hectares} hectáreas (${selectedClient.ponds} piscinas)`);
        setText(el, '[data-detail-contact]', selectedClient.contact);
        setText(el, '[data-detail-phone]', selectedClient.phone);

        const ordersContainer = el.querySelector('[data-client-orders]');
        ordersContainer.innerHTML = '';

        if (!selectedClient.orders || selectedClient.orders.length === 0) {
            ordersContainer.innerHTML = '<p class="text-xs text-on-surface-variant py-2">No registra compras anteriores.</p>';
            return;
        }

        selectedClient.orders.forEach(order => {
            const card = fromHTML(`
                <div class="p-3 rounded-xl bg-surface-container-low border border-navy-800/80 space-y-1 text-xs">
                    <div class="flex items-center justify-between">
                        <strong class="font-mono text-celeste-300 font-bold">${order.id}</strong>
                        <span class="text-on-surface-variant font-mono text-[11px]">${order.date}</span>
                    </div>
                    <p class="text-white">${order.items}</p>
                    <div class="flex items-center justify-between pt-1 border-t border-navy-800/50">
                        <span class="text-on-surface-variant font-label">Monto facturado:</span>
                        <strong class="font-mono text-secondary font-bold text-sm">$${order.total.toLocaleString()}.00 USD</strong>
                    </div>
                </div>
            `);
            ordersContainer.append(card);
        });
    }
    renderDetails();

    // Modal de Registro de Nueva Camaronera
    el.querySelector('[data-open-new-client]').addEventListener('click', () => {
        const modal = fromHTML(`
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
                <div class="w-full max-w-lg bg-surface-container rounded-2xl p-6 border border-celeste-500/30 shadow-2xl space-y-4">
                    <div class="flex items-center justify-between border-b border-navy-800 pb-3">
                        <h3 class="font-headline text-headline-sm text-white font-bold flex items-center gap-2">
                            <span class="material-symbols-outlined text-celeste-400">add_business</span>
                            Registrar Cliente Comercial (Camaronera)
                        </h3>
                        <button type="button" data-close-modal class="p-1 rounded-lg text-on-surface-variant hover:text-white">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <form class="space-y-3" id="form-new-farm">
                        <div>
                            <label class="block text-xs font-label text-on-surface-variant mb-1">Nombre Comercial de la Camaronera</label>
                            <input type="text" required name="name" placeholder="Ej. Camaronera Río Guayas S.A." class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">RUC (13 dígitos Ecuador)</label>
                                <input type="text" required name="ruc" placeholder="0991234567001" maxlength="13" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500 font-mono">
                            </div>
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Sector / Ubicación</label>
                                <input type="text" required name="zone" placeholder="Ej. Taura - Guayas" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Hectáreas de Piscina</label>
                                <input type="number" required name="hectares" placeholder="150" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500 font-mono">
                            </div>
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Número de Piscinas</label>
                                <input type="number" required name="ponds" placeholder="14" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500 font-mono">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Contacto Técnico / Administrador</label>
                                <input type="text" required name="contact" placeholder="Ing. Juan Zambrano" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500">
                            </div>
                            <div>
                                <label class="block text-xs font-label text-on-surface-variant mb-1">Teléfono Móvil (Ecuador)</label>
                                <input type="tel" required name="phone" placeholder="0998765432" class="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-navy-700 text-white text-body-sm focus:outline-none focus:border-celeste-500 font-mono">
                            </div>
                        </div>
                        <div class="pt-3 flex items-center justify-end gap-2">
                            <button type="button" data-close-modal class="h-10 px-4 rounded-xl bg-navy-800 text-on-surface-variant hover:text-white font-label text-label-sm">Cancelar</button>
                            <button type="submit" class="h-10 px-5 rounded-xl bg-celeste-600 hover:bg-celeste-500 text-white font-label text-label-sm font-bold flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-base">save</span>
                                Registrar Cliente Comercial
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `);

        modal.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', () => modal.remove()));
        modal.querySelector('#form-new-farm').addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const newFarm = {
                id: `CLI-00${SHRIMP_FARMS.length + 1}`,
                name: fd.get('name'),
                legalName: fd.get('name'),
                ruc: fd.get('ruc'),
                zone: fd.get('zone'),
                hectares: parseInt(fd.get('hectares')),
                ponds: parseInt(fd.get('ponds')),
                contact: fd.get('contact'),
                phone: fd.get('phone'),
                email: 'contacto@camaronera.ec',
                creditLimit: 30000,
                status: 'Activo',
                orders: []
            };

            SHRIMP_FARMS.unshift(newFarm);
            selectedClient = newFarm;
            renderFarms(SHRIMP_FARMS);
            renderDetails();
            modal.remove();
        });
        document.body.append(modal);
    });

    return el;
}
