import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const gallery = document.querySelector('.contact-us-gallery');
const galleryList = document.querySelector('.contact-us-gallery-list');

const mediaQuery = window.matchMedia('(min-width: 768px)');

let swiper;
let init = false;

function swiperCreate() {
  if (mediaQuery.matches) {
    if (!init) {
      init = true;
      swiper = new Swiper(gallery, {
        modules: [Navigation, Pagination],

        watchSlidesProgress: true,
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
            pagination: {
              el: '.about-us-pagination',
              clickable: true,
            },
            navigation: {
              nextEl: '.about-us-slide-btn.button-next',
              prevEl: '.about-us-slide-btn.button-prev',
            },
          },
        },
      });
    }
  } else if (init) {
    swiper.destroy();
    init = false;
  }
}

swiperCreate();
mediaQuery.addEventListener('change', swiperCreate);
