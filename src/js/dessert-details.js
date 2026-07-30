import axios from 'axios';

let currentDessertId = null;
const BASE_URL = 'https://deserts-store.b.goit.study/api/desserts/';

const popularContainer = document.querySelector('.popular-products-list');
const dessertContainer = document.querySelector('.js-dessert-grid');

const overlay = document.querySelector('.overlay-details');
const modalCloseBtn = document.querySelector('.modal-details-close');
const openOrderBtn = document.querySelector('.js-open-order-btn');

const modalImg = document.querySelector('.modal-img');
const modalTitle = document.querySelector('.modal-details-title');
const modalPrice = document.querySelector('.modal-price');
const modalRating = document.querySelector('.modal-rating');
const modalDescription = document.querySelector('.modal-description');
const modalIngredients = document.querySelector('.modal-ingredients');

function generateStars(rating) {
  const numericRating = Number(rating) || 5;
  const totalStars = 5;

  const fullStarsCount = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.25 && numericRating % 1 < 0.75;
  const extraFullStar = numericRating % 1 >= 0.75 ? 1 : 0;

  const finalFullStars = fullStarsCount + extraFullStar;
  const emptyStarsCount = totalStars - finalFullStars - (hasHalfStar ? 1 : 0);

  return (
    '★'.repeat(finalFullStars) +
    (hasHalfStar ? '⯪' : '') +
    '☆'.repeat(emptyStarsCount)
  );
}

let scrollTimeout;
function initScrollbarFade() {
  const scrollContainer = document.querySelector('.modal-content-wrapper');
  if (!scrollContainer) return;

  scrollContainer.addEventListener('scroll', () => {
    scrollContainer.classList.add('is-scrolling');
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      scrollContainer.classList.remove('is-scrolling');
    }, 1200);
  });
}

async function openDetailsById(id) {
  if (!id || id === 'undefined') {
    console.error('Помилка: Спроба відкрити модалку без дійсного ID десерту.');
    return;
  }

  currentDessertId = id;
  try {
    const response = await axios.get(`${BASE_URL}${id}`);
    const dessert = response.data;

    if (modalImg) {
      modalImg.src = dessert.image;
      modalImg.alt = dessert.name;
    }
    if (modalTitle) modalTitle.textContent = dessert.name;
    if (modalPrice) modalPrice.textContent = `${dessert.price} грн`;
    if (modalDescription) modalDescription.textContent = dessert.description;
    if (modalRating) modalRating.textContent = generateStars(dessert.rating);
    if (modalIngredients)
      modalIngredients.innerHTML = `<strong>Склад:</strong> ${dessert.composition}`;

    openModal();
  } catch (error) {
    console.error(
      `Не вдалося завантажити десерт за адресою ${BASE_URL}${id}:`,
      error
    );
  }
}

export async function handleDessertClick(event) {
  const targetBtn = event.target.closest(
    '.dessert-card__btn, .product-card-btn'
  );
  const targetCard = event.target.closest('.dessert-card');

  if (!targetBtn && !targetCard) return;

  const id =
    targetBtn?.dataset.id || targetBtn?.dataset.uuid || targetCard?.dataset.id;

  if (id) {
    openDetailsById(id);
  }
}

function handleOrderClick() {
  if (!currentDessertId) return;

  const orderEvent = new CustomEvent('open-order', {
    detail: { dessertId: currentDessertId },
  });

  document.dispatchEvent(orderEvent);
  console.log(
    `Подія 'open-order' успішно надіслана для ID: ${currentDessertId}`
  );

  closeModal();
}

function openModal() {
  overlay.classList.add('is-open');
  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');

  modalCloseBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', handleBackdropClick);
  window.addEventListener('keydown', handleEscapeKey);
  if (openOrderBtn) openOrderBtn.addEventListener('click', handleOrderClick);
}

function closeModal() {
  overlay.classList.remove('is-open');

  document.documentElement.classList.remove('no-scroll');
  document.body.classList.remove('no-scroll');

  modalCloseBtn.removeEventListener('click', closeModal);
  overlay.removeEventListener('click', handleBackdropClick);
  window.removeEventListener('keydown', handleEscapeKey);
  if (openOrderBtn) openOrderBtn.removeEventListener('click', handleOrderClick);

  clearModal();
  currentDessertId = null;
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) closeModal();
}

function handleEscapeKey(event) {
  if (event.code === 'Escape') closeModal();
}

function clearModal() {
  if (modalImg) {
    modalImg.removeAttribute('src');
    modalImg.alt = '';
  }
  if (modalTitle) modalTitle.textContent = '';
  if (modalPrice) modalPrice.textContent = '';
  if (modalDescription) modalDescription.textContent = '';
  if (modalRating) modalRating.textContent = '';
  if (modalIngredients) modalIngredients.innerHTML = '';
}

// ================= ГЛОБАЛЬНІ СЛУХАЧІ СТОРІНКИ =================

if (dessertContainer) {
  dessertContainer.addEventListener('click', handleDessertClick);
}
if (popularContainer) {
  popularContainer.addEventListener('click', handleDessertClick);
}

initScrollbarFade();

document.addEventListener('open-details', event => {
  const id = event.detail.dessertId;
  if (id) {
    openDetailsById(id);
  }
});
