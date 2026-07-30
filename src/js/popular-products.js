import axios from 'axios';
import iziToast from 'izitoast';
import Swiper from 'swiper';
import { getCategories, getDesserts } from './services/api/api.js';
import { Pagination, Navigation } from 'swiper/modules';

import  createMarkup  from './utils/createMarkupForProductCard';
import 'izitoast/dist/css/iziToast.min.css';
import 'swiper/css';
import 'swiper/css/pagination';

const BASE_URL = 'https://deserts-store.b.goit.study/api/';
const END_POINT = 'desserts';

const productsSection = document.querySelector('.popular-products-section');
const productsContainer = document.querySelector('.popular-products-list');
const productsLoader = document.querySelector('.js-popular-products-loader');

function showWarning(message) {
  iziToast.warning({
    title: 'Увага',
    message,
    position: 'topRight',
  });
}

function showError(message) {
  iziToast.error({
    title: 'Помилка',
    message,
    position: 'topRight',
  });
}

function showProductsLoading() {
  productsSection.classList.remove('is-hidden');
  productsSection.classList.add('is-loading');
  productsLoader?.removeAttribute('hidden');
  productsContainer.innerHTML = '';
}

function showProductsSection() {
  productsSection.classList.remove('is-hidden', 'is-loading');
  productsLoader?.setAttribute('hidden', '');
}

function hideProductsSection() {
  productsSection.classList.add('is-hidden');
  productsSection.classList.remove('is-loading');
  productsLoader?.setAttribute('hidden', '');
  productsContainer.innerHTML = '';
}

function getProductId(product) {
  return product.id || product._id;
}


async function getPopularProducts() {
  if (!productsSection || !productsContainer) {
    return;
  }

  showProductsLoading();

  try {
    const data = await getDesserts({
          page: 1,
          limit: 10,
          type: 'popular'
        });
    if (!Array.isArray(data.desserts)) {
      throw new Error('Невірний формат даних з API');
    }
    if (data.desserts.length < 3) {
      hideProductsSection();
      showWarning('Мало популярних товарів для відображення');
      return;
    }

    const validDesserts = data.desserts.filter(product => {
      const { image, category, name, description, price } = product;

      return (
        getProductId(product) &&
        image &&
        category?.name &&
        name &&
        description &&
        price !== undefined &&
        price !== null &&
        price !== ''
      );
    });

    if (validDesserts.length < 3) {
      hideProductsSection();
      showWarning('Неможливо відобразити популярні товари через неповні дані');
      return;
    }

    productsContainer.innerHTML = createMarkup(validDesserts, { slide: true });
    showProductsSection();
    initPopularProductsSwiper();
  } catch (error) {
    hideProductsSection();
    showError(error.message || 'Помилка завантаження популярних товарів');
  }
}

getPopularProducts();

function initPopularProductsSwiper() {
  new Swiper('.popular-products-swiper', {
    modules: [Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 24,
    watchOverflow: true,
    pagination: {
      el: '.popular-products-pagination',
      dynamicBullets: true,
      clickable: true,
    },
    navigation: {
      nextEl: '.popular-btn-next',
      prevEl: '.popular-btn-prev',
      disabledClass: 'popular-btn-disabled',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
}

