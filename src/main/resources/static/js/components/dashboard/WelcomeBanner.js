import { fromHTML, setText } from '../../utils/dom.js';
import { Avatar } from '../common/Avatar.js';
import { RoleBadge } from './RoleBadge.js';
import { formatMemberSince } from '../../utils/format.js';

const GREETINGS = {
    CLIENTE: 'Monitorea tus pedidos de balanceado, probióticos y acumula AquaPuntos para tu camaronera.',
    ASESOR_TECNICO: 'Tu área técnica para formulación, dosificación y despacho de insumos está lista.',
    CAJERO: 'Tu área técnica para formulación, dosificación y despacho de insumos está lista.',
    ADMIN: 'Tienes acceso total al mando operativo y al área técnica de despacho.'
};

/**
 * Barra de bienvenida del dashboard: avatar, saludo, rol y antigüedad.
 * @param {object} props
 * @param {{ name: string, role: string, createdAt?: string }} props.profile
 */
export function WelcomeBanner({ profile }) {
    const el = fromHTML(`
        <section class="bg-surface-container-lowest rounded-2xl shadow-md p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div class="flex items-center gap-space-md min-w-0">
                <div data-avatar></div>
                <div class="flex flex-col min-w-0">
                    <div class="flex items-center gap-space-xs flex-wrap">
                        <h1 data-greeting class="font-headline text-headline-sm text-on-surface"></h1>
                        <div data-role></div>
                    </div>
                    <p data-message class="font-body text-body-sm text-on-surface-variant mt-0.5"></p>
                </div>
            </div>
            <p data-member class="font-body text-body-sm text-on-surface-variant flex items-center gap-1 shrink-0">
                <span class="material-symbols-outlined text-[16px] text-primary" aria-hidden="true">calendar_month</span>
                <span data-member-text></span>
            </p>
        </section>
    `);

    el.querySelector('[data-avatar]').append(Avatar({ name: profile.name, size: 'lg', online: true }));
    setText(el, '[data-greeting]', `Hola, ${profile.name}`);
    el.querySelector('[data-role]').append(RoleBadge({ role: profile.role }));
    setText(el, '[data-message]', GREETINGS[profile.role] ?? '');

    const memberSince = formatMemberSince(profile.createdAt);
    if (memberSince) setText(el, '[data-member-text]', `Miembro desde ${memberSince}`);
    else el.querySelector('[data-member]').remove();
    return el;
}
