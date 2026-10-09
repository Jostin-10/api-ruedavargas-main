/**
 * Sistema Web Interno — AquaInsumos Ecuador
 * Implementación de los Paneles Internos:
 *   - Pantalla 3: Dashboard del Administrador
 *   - Pantalla 4: Dashboard del Cajero (POS & Facturación)
 *   - Pantalla 5: Dashboard del Gestor de Clientes Comerciales (Camaroneras)
 *   - Pantalla 6: Dashboard Móvil (Responsive con menú lateral retráctil)
 */
import { fromHTML, mount } from '../utils/dom.js';
import { requireAuth, getUser, logout } from '../utils/session.js';
import { SESSION_EXPIRED_EVENT } from '../services/api.js';
import { getProfile } from '../services/auth.service.js';
import { Alert } from '../components/common/Alert.js';
import { Button } from '../components/common/Button.js';
import { Footer } from '../components/common/Footer.js';
import { Sidebar } from '../components/dashboard/Sidebar.js';
import { TopNavbar } from '../components/dashboard/TopNavbar.js';
import { AdminDashboardView } from '../components/dashboard/AdminDashboardView.js';
import { CashierDashboardView } from '../components/dashboard/CashierDashboardView.js';
import { ClientManagerDashboardView } from '../components/dashboard/ClientManagerDashboardView.js';
import { ProfileCard } from '../components/dashboard/ProfileCard.js';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner.js';
import { LoadingState } from '../components/dashboard/LoadingState.js';
import { SessionExpired } from '../components/dashboard/SessionExpired.js';

const VIEW_METADATA = {
    admin: {
        title: 'Dashboard del Administrador',
        subtitle: 'Resumen operativo, métricas de venta, catálogo de insumos y personal'
    },
    cashier: {
        title: 'Dashboard del Cajero · Facturación',
        subtitle: 'Punto de venta directo, cálculo de IVA (15% Ecuador) y registro de cobros'
    },
    clients: {
        title: 'Dashboard Gestor de Camaroneras',
        subtitle: 'Cartera de clientes comerciales, fincas, hectáreas e historial de compras'
    },
    profile: {
        title: 'Ficha de Colaborador',
        subtitle: 'Datos del trabajador, credencial y permisos asignados'
    }
};

function init() {
    if (!requireAuth()) return;

    const app = document.getElementById('app');
    app.className = 'bg-surface font-body text-on-surface antialiased min-h-screen flex';

    let activeTab = 'admin';
    let profileData = null;
    let sidebarEl = null;
    let topNavEl = null;

    // Estructura Principal con Menú Lateral
    const mainShell = fromHTML(`
        <div class="flex-1 min-h-screen flex flex-col transition-all duration-300 lg:pl-72 w-full">
            <div data-top-nav></div>
            <main class="flex-1 pt-24 px-4 sm:px-8 pb-10 max-w-7xl w-full mx-auto flex flex-col gap-6">
                <div data-main-view></div>
                <div data-footer class="mt-auto pt-6"></div>
            </main>
        </div>
    `);

    // Backdrop para móvil
    const mobileBackdrop = fromHTML(`
        <div class="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-30 lg:hidden hidden transition-opacity duration-300"></div>
    `);

    app.append(mobileBackdrop, mainShell);
    mainShell.querySelector('[data-footer]').append(Footer({ company: 'AquaInsumos S.A. — Insumos para Camaroneras Ecuador' }));

    // Control de Sidebar móvil
    function toggleMobileSidebar(show) {
        if (!sidebarEl) return;
        const isCurrentlyOpen = !sidebarEl.classList.contains('-translate-x-full');
        const willShow = show !== undefined ? show : !isCurrentlyOpen;

        if (willShow) {
            sidebarEl.classList.remove('-translate-x-full');
            mobileBackdrop.classList.remove('hidden');
        } else {
            sidebarEl.classList.add('-translate-x-full');
            mobileBackdrop.classList.add('hidden');
        }
    }

    mobileBackdrop.addEventListener('click', () => toggleMobileSidebar(false));

    // Renderizado de la Vista según la Pestaña
    function renderCurrentView(tab) {
        activeTab = tab;
        const meta = VIEW_METADATA[tab] || VIEW_METADATA.admin;
        topNavEl?.updateTitle(meta.title, meta.subtitle);

        const viewSlot = mainShell.querySelector('[data-main-view]');
        viewSlot.innerHTML = '';

        if (tab === 'admin') {
            viewSlot.append(AdminDashboardView());
        } else if (tab === 'cashier') {
            viewSlot.append(CashierDashboardView());
        } else if (tab === 'clients') {
            viewSlot.append(ClientManagerDashboardView());
        } else if (tab === 'profile') {
            const profileWrapper = fromHTML(`<div class="space-y-6"></div>`);
            profileWrapper.append(
                WelcomeBanner({ profile: profileData }),
                ProfileCard({ profile: profileData })
            );
            viewSlot.append(profileWrapper);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Alerta de Sesión Expirada
    let expiredShown = false;
    window.addEventListener(SESSION_EXPIRED_EVENT, () => {
        if (expiredShown) return;
        expiredShown = true;
        document.body.append(SessionExpired({ onLogin: () => logout({ expired: true }) }));
    });

    // Carga de datos reales desde el backend
    async function loadData() {
        const viewSlot = mainShell.querySelector('[data-main-view]');
        mount(viewSlot, LoadingState());

        try {
            profileData = await getProfile();

            // Determinar vista inicial según rol
            if (profileData.role === 'CAJERO') activeTab = 'cashier';
            else if (profileData.role === 'GESTOR_CLIENTES') activeTab = 'clients';
            else activeTab = 'admin';

            // Montar Sidebar
            sidebarEl = Sidebar({
                user: profileData,
                activeTab,
                onSelectTab: (tab) => {
                    renderCurrentView(tab);
                    toggleMobileSidebar(false);
                },
                onLogout: () => logout()
            });

            // En pantallas pequeñas el sidebar inicia oculto
            sidebarEl.classList.add('-translate-x-full', 'lg:translate-x-0');
            sidebarEl.querySelector('[data-close-mobile]')?.addEventListener('click', () => toggleMobileSidebar(false));
            app.prepend(sidebarEl);

            // Montar Top Navbar
            topNavEl = TopNavbar({
                title: VIEW_METADATA[activeTab].title,
                subtitle: VIEW_METADATA[activeTab].subtitle,
                onToggleSidebar: () => toggleMobileSidebar()
            });
            mainShell.querySelector('[data-top-nav]').replaceWith(topNavEl);

            // Renderizar la pantalla activa
            renderCurrentView(activeTab);

        } catch (error) {
            if (error.status === 401) return;
            const retry = Button({ label: 'Reintentar', icon: 'refresh', variant: 'secondary', onClick: loadData });
            const wrapper = fromHTML(`<div class="flex flex-col items-start gap-4 p-6 bg-surface-container rounded-2xl"></div>`);
            wrapper.append(
                Alert({ type: 'error', title: 'Error al conectar con el servidor', message: error.message, dismissible: false }),
                retry
            );
            mount(viewSlot, wrapper);
        }
    }

    loadData();
}

init();
