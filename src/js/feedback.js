import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import axios from 'axios'; 

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BASE_URL = 'https://deserts-store.b.goit.study/api/';
const END_POINT = 'feedbacks';

const feedbackSlider = document.querySelector('.feedback-swiper');
const container = document.getElementById('feedbacks-container');

function generateStarsTemplate(rating) {
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      starsHTML += `
        <svg class="star full" width="20" height="20" viewBox="0 0 24 24" fill="#080C0C" stroke="#080C0C" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
        </svg>`;
    } else if (rating > i - 1 && rating < i) {
      starsHTML += `
        <svg class="star half" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="halfGrad-${i}">
              <stop offset="50%" stop-color="#080C0C"/>
              <stop offset="50%" stop-color="transparent"/>
            </linearGradient>
          </defs>
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
                fill="url(#halfGrad-${i})" stroke="#080C0C" stroke-width="2" stroke-linejoin="round"/>
        </svg>`;
    } else {
      starsHTML += `
        <svg class="star empty" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#080C0C" stroke-width="2" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
        </svg>`;
    }
  }
  return `<div class="star-rating theme-default-star">${starsHTML}</div>`;
}

function renderFeedbacks(feedbacksArray) {
  if (!container) return;
  container.innerHTML = ''; 
  
  let slidesHTML = '';
  feedbacksArray.forEach(item => {
    const starsContainer = generateStarsTemplate(item.rate);

    slidesHTML += `
      <li class="swiper-slide">
        <div class="feedback-card">
          <div class="rating-wrapper">
            ${starsContainer}
          </div>
          <p class="feedback-text">"${item.description}"</p>
          <div class="feedback-author">${item.author}</div>
        </div>
      </li>
    `;
  });
  container.innerHTML = slidesHTML;
}

async function getFeedbacks() {
  if (!container) return;

  const loader = document.querySelector('.feedback-loader');

  try {
    const { data } = await axios(`${BASE_URL}${END_POINT}`, {
      params: {
        limit: 10,
        page: 1,
      },
    });

    const feedbacksArray = Array.isArray(data) ? data : (data.results || data.feedbacks);

    if (!Array.isArray(feedbacksArray)) {
      throw new Error('Невірний формат даних');
    }

    const validFeedbacks = feedbacksArray.filter(
      ({ rate, description, author }) => rate !== undefined && description && author
    );

    if (validFeedbacks.length === 0) {
      console.warn('Немає валідних відгуків для відображення');
      if (loader) loader.innerHTML = '<p>Відгуків поки немає</p>';
      return;
    }

    renderFeedbacks(validFeedbacks);
    container.classList.add('swiper-wrapper');

    if (loader) {
      loader.style.display = 'none';
    }

    initFeedbackSwiper();

  } catch (error) {
    console.error('Помилка завантаження відгуків:', error);
    if (loader) {
      loader.innerHTML = '<p style="color: #080c0c;">Не вдалося завантажити відгуки. Спробуйте пізніше.</p>';
      const spinner = loader.querySelector('.spinner');
      if (spinner) spinner.style.display = 'none';
    }
  }
}

function initFeedbackSwiper() {
  new Swiper(feedbackSlider, {
    modules: [Navigation, Pagination],
    watchSlidesProgress: true, 
    slidesPerView: 1,       
    spaceBetween: 20,
    grabCursor: true,
    loop: true,
    
    pagination: {
      el: '.feedback-pagination',
      clickable: true,
      dynamicBullets: true,
      renderBullet: function (index, className) {
        return `<span class="${className}"></span>`;
      }
    },
    
    navigation: {
      nextEl: '.feedback-slide-btn.button-next',
      prevEl: '.feedback-slide-btn.button-prev',
    },
    
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 24,
      }
    }
  });
}

getFeedbacks();