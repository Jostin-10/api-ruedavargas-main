import { fromHTML, setText } from '../../utils/dom.js';
import { checkPasswordRules } from '../../utils/validators.js';

/**
 * Panel de requisitos de contraseña que se actualiza en vivo (diseño de Stitch).
 * El elemento devuelto expone update(password).
 */
export function PasswordRequirements() {
    const el = fromHTML(`
        <div class="bg-surface-container-low/70 rounded-xl p-2.5 mt-2 space-y-1.5">
            <span class="block font-label text-label-sm text-outline font-semibold mb-1">Requisitos de seguridad:</span>
            <ul data-rules class="space-y-1.5"></ul>
        </div>
    `);
    const list = el.querySelector('[data-rules]');

    const items = checkPasswordRules('').map(rule => {
        const item = fromHTML(`
            <li class="flex items-center gap-2">
                <span data-icon class="material-symbols-outlined text-[16px]" aria-hidden="true"></span>
                <span data-label class="font-body text-body-sm"></span>
                <span data-status class="sr-only"></span>
            </li>
        `);
        item.dataset.rule = rule.id;
        setText(item, '[data-label]', rule.label);
        list.append(item);
        return item;
    });

    el.update = password => {
        checkPasswordRules(password).forEach((rule, index) => {
            const item = items[index];
            const iconEl = setText(item, '[data-icon]', rule.passed ? 'check_circle' : 'radio_button_unchecked');
            iconEl.classList.toggle('icon-filled', rule.passed);
            iconEl.classList.toggle('text-primary', rule.passed);
            iconEl.classList.toggle('text-outline', !rule.passed);
            const label = item.querySelector('[data-label]');
            label.classList.toggle('text-primary', rule.passed);
            label.classList.toggle('font-medium', rule.passed);
            label.classList.toggle('text-outline', !rule.passed);
            setText(item, '[data-status]', rule.passed ? '(cumplido)' : '(pendiente)');
            item.dataset.passed = String(rule.passed);
        });
    };

    el.update('');
    return el;
}
