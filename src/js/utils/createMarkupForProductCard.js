import spriteUrl from '../../img/sprite.svg';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function createMarkup(arr, options = {}) {
  if (!Array.isArray(arr)) return '';

  const { slide = false } = options;
  const cardClass = slide ? 'product-card swiper-slide' : 'product-card';

  return arr
    .map(product => {
      const { image, category, name, description, price } = product;
      const productId = product._id;
      const categoryName = category.name;

      return `<li class="${cardClass}" data-id="${productId}">
            <div class="product-img-thumb">
              <img class="product-img" src="${image}" alt="${name}"/>
            </div>
            <p class="product-category">${escapeHtml(categoryName)}</p>
            <h4 class="product-name">${escapeHtml(name)}</h4>
            <p class="product-description">${escapeHtml(description)}</p>
            <div class="product-card-bottom">
              <p class="product-price">${price} грн</p>
              <button class="product-card-btn" type="button" aria-label="Open product details" data-id="${productId}">
                <svg class="product-card-svg" width="24" height="24">
                  <use href="${spriteUrl}#icon-arrow_outward"></use>
                </svg>
              </button>
            </div>
          </li>`;
    })
    .join('');
}

