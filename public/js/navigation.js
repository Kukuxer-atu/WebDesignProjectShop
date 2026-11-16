
const toggle = document.querySelector('[data-menu-toggle]');
const closeButton = document.querySelector('[data-menu-close]');
const backdrop = document.querySelector('[data-menu-backdrop]');
const sideMenu = document.getElementById('side-menu');

function setMenuOpen(open) {
  if (!toggle || !sideMenu || !backdrop) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  sideMenu.setAttribute('aria-hidden', String(!open));
  sideMenu.inert = !open;
  sideMenu.classList.toggle('is-open', open);
  backdrop.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  if (open) {
    closeButton.focus();
  } else {
    toggle.focus();
  }
}
if (toggle) toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
if (closeButton) closeButton.addEventListener('click', () => setMenuOpen(false));
if (backdrop) backdrop.addEventListener('click', () => setMenuOpen(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle && toggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false);
});
if (sideMenu) sideMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
