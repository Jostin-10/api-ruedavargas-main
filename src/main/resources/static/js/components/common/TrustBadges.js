import { fromHTML, setText } from '../../utils/dom.js';

const BADGES = [
    { icon: 'verified_user', title: 'Bio-Seguridad Acuícola', subtitle: 'Normas sanitarias' },
    { icon: 'shield', title: 'Trazabilidad de Lotes', subtitle: 'Calidad garantizada' },
    { icon: 'water', title: 'Nutrición de Precisión', subtitle: 'Alto rendimiento' }
];

/** Fila de insignias de confianza que va debajo de las tarjetas de login y registro. */
export function TrustBadges({ badges = BADGES } = {}) {
    const el = fromHTML(`<div class="w-full grid grid-cols-3 gap-2 py-space-sm px-2 text-center"></div>`);

    badges.forEach(badge => {
        const item = fromHTML(`
            <div class="flex flex-col items-center justify-center text-on-surface-variant group">
                <div class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-1.5 shadow-sm group-hover:bg-secondary-container transition-colors">
                    <span data-icon class="material-symbols-outlined icon-filled text-lg" aria-hidden="true"></span>
                </div>
                <span data-title class="font-label text-label-sm font-semibold tracking-tight text-on-surface"></span>
                <span data-subtitle class="font-body text-[11px] text-on-surface-variant/80 hidden sm:inline"></span>
            </div>
        `);
        setText(item, '[data-icon]', badge.icon);
        setText(item, '[data-title]', badge.title);
        setText(item, '[data-subtitle]', badge.subtitle);
        el.append(item);
    });
    return el;
}
