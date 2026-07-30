// burger menu
const burger = document.getElementById('burgerBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');

const links = document.querySelectorAll('.mobile-link');
const mobileBtn = document.querySelector('.mobile-btn'); // кнопка в мобільному меню

// відкрити
burger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.classList.add('menu-open');
  burger.setAttribute('aria-expanded', 'true');

  mobileMenu.setAttribute('aria-hidden', 'false');
});

// закрити функція
function closeMenu() {
  mobileMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
  burger.setAttribute('aria-expanded', 'false');

  mobileMenu.setAttribute('aria-hidden', 'true');
}

// закрити по X
closeBtn.addEventListener('click', closeMenu);

// закрити по кліку на пункт
links.forEach(link => {
  link.addEventListener('click', closeMenu);
});

mobileBtn.addEventListener('click', closeMenu);

// закрити по ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMenu();
  }
});


