import { fromHTML, setText } from '../../utils/dom.js';
import { formatMemberSince } from '../../utils/format.js';
import { ROLE_INFO } from './RoleBadge.js';

/**
 * Tarjeta "Datos de Perfil" con los datos reales de GET /api/auth/profile.
 * @param {object} props
 * @param {{ name, email, role, employeeId?, createdAt? }} props.profile
 */
export function ProfileCard({ profile }) {
    const el = fromHTML(`
        <section class="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md flex flex-col gap-space-md">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl" aria-hidden="true">badge</span>
                <h2 class="font-headline text-headline-sm text-on-surface">Datos de Perfil</h2>
            </div>
            <dl data-rows class="flex flex-col gap-space-sm font-body text-body-sm"></dl>
        </section>
    `);

    const rows = [
        { icon: 'person', label: 'Nombre y apellido', value: profile.name },
        { icon: 'alternate_email', label: 'Email registrado', value: profile.email },
        { icon: 'verified_user', label: 'Rol', value: ROLE_INFO[profile.role]?.label ?? profile.role },
        { icon: 'id_card', label: 'ID de empleado', value: profile.employeeId },
        { icon: 'calendar_month', label: 'Miembro desde', value: formatMemberSince(profile.createdAt) }
    ].filter(row => row.value);

    const list = el.querySelector('[data-rows]');
    rows.forEach(row => {
        const item = fromHTML(`
            <div class="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded-xl">
                <span data-icon class="material-symbols-outlined text-on-surface-variant text-lg mt-0.5" aria-hidden="true"></span>
                <div class="flex flex-col min-w-0">
                    <dt data-label class="font-label text-label-sm text-on-surface-variant"></dt>
                    <dd data-value class="text-on-surface font-semibold truncate"></dd>
                </div>
            </div>
        `);
        setText(item, '[data-icon]', row.icon);
        setText(item, '[data-label]', row.label);
        setText(item, '[data-value]', row.value).title = row.value;
        list.append(item);
    });
    return el;
}
