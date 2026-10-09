import { fromHTML, setText } from '../../utils/dom.js';

/**
 * Ventana de "Tu sesión ha expirado" (diseño de Stitch) con cuenta regresiva.
 * Al terminar la cuenta o pulsar el botón se llama a onLogin.
 * @param {object} props
 * @param {Function} props.onLogin
 * @param {number} [props.seconds=10]
 */
export function SessionExpired({ onLogin, seconds = 10 }) {
    const el = fromHTML(`
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-margin">
            <div role="alertdialog" aria-modal="true" aria-labelledby="expired-title" aria-describedby="expired-description"
                class="bg-surface-container-lowest max-w-md w-full rounded-2xl p-space-xl shadow-xl flex flex-col items-center text-center gap-space-md">
                <div class="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center shadow-inner">
                    <span class="material-symbols-outlined text-3xl" aria-hidden="true">timer_off</span>
                </div>
                <div class="flex flex-col gap-space-xs">
                    <h2 id="expired-title" class="font-headline text-headline-md text-on-surface">Tu sesión ha expirado</h2>
                    <p id="expired-description" class="font-body text-body-md text-on-surface-variant">
                        Por seguridad cerramos tu sesión. Vuelve a iniciar sesión para continuar.
                    </p>
                </div>
                <div class="w-full bg-surface-container-low p-space-md rounded-xl flex items-center justify-center gap-2 text-on-surface-variant font-label text-label-md">
                    <span class="material-symbols-outlined text-primary text-base" aria-hidden="true">lock</span>
                    <span>Redirigiendo en <strong data-countdown class="text-primary font-bold"></strong> s</span>
                </div>
                <button data-login type="button"
                    class="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-label text-label-lg rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-lg" aria-hidden="true">login</span>
                    Volver a iniciar sesión
                </button>
            </div>
        </div>
    `);

    let remaining = seconds;
    let done = false;
    setText(el, '[data-countdown]', String(remaining));

    const finish = () => {
        if (done) return;
        done = true;
        clearInterval(timer);
        onLogin();
    };

    const timer = setInterval(() => {
        remaining -= 1;
        setText(el, '[data-countdown]', String(Math.max(remaining, 0)));
        if (remaining <= 0) finish();
    }, 1000);

    const button = el.querySelector('[data-login]');
    button.addEventListener('click', finish);
    // Enfoca el botón cuando la ventana ya está en el documento
    queueMicrotask(() => button.focus());
    return el;
}
