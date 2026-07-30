import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getCategories, getDesserts } from './services/api/api.js';
import  createMarkup  from './utils/createMarkupForProductCard';

let state = {
  page: 1,
  category: '',
  total: 0,
  loading: false,
};

const PAGE_LIMIT = 8;

const els = {
  grid: document.querySelector('.js-dessert-grid'),
  loader: document.querySelector('.js-dessert-loader'),
  loadMore: document.querySelector('.js-load-more'),
  categories: document.querySelector('.js-categories'),
  customSelect: document.querySelector('.js-custom-select'),
};

const trigger = els.customSelect?.querySelector('.custom-select__trigger');
const dropdown = els.customSelect?.querySelector('.custom-select__dropdown');
const label = els.customSelect?.querySelector('.custom-select__label');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setDropdownOpen(open) {
  els.customSelect?.classList.toggle('open', open);
  trigger?.setAttribute('aria-expanded', String(open));
}

function syncCategoryUI(catId) {
  els.categories?.querySelectorAll('.dessert-list__cat-btn').forEach(btn => {
    btn.classList.toggle('is-active', (btn.dataset.cat || '') === catId);
  });

  dropdown?.querySelectorAll('.custom-select__option').forEach(opt => {
    opt.classList.toggle('is-active', (opt.dataset.cat || '') === catId);
  });

  const activeOpt = dropdown?.querySelector(`.custom-select__option[data-cat="${catId}"]`);
  if (label && activeOpt) label.textContent = activeOpt.textContent.trim();
}

function renderDessertCard(dessert) {
  return `
    <li class="dessert-card" data-id="${dessert._id}">
      <div class="dessert-card__img-wrap">
        <img class="dessert-card__img" src="${escapeHtml(dessert.image)}" alt="${escapeHtml(dessert.name)}" loading="lazy">
      </div>
      <div class="dessert-card__body">
        <p class="dessert-card__category">${escapeHtml(dessert.category?.name || 'No category')}</p>
        <h3 class="dessert-card__name">${escapeHtml(dessert.name)}</h3>
        <div class="dessert-card__description">
          <span>${escapeHtml(dessert.description)}</span>
        </div>
        <div class="dessert-card__footer">
          <span class="dessert-card__price">${Number(dessert.price).toFixed(0)} грн</span>
          <button type="button" class="dessert-card__btn" aria-label="Відкрити ${escapeHtml(dessert.name)}">
            <svg width="20" height="20">
              <use href="/img/sprite.svg#icon-arrow_outward"></use>
            </svg>
          </button>
        </div>
      </div>
    </li>
  `;
}

function renderCustomOptions(cats) {
  if (!dropdown) return;

  dropdown.innerHTML = [
    `<li class="custom-select__option is-active" data-cat="">Всі десерти</li>`,
    ...cats.map(c =>
      `<li class="custom-select__option" data-cat="${c._id}">${escapeHtml(c.name)}</li>`
    )
  ].join('');
}

function renderCategoryButtons(cats) {
  if (!els.categories) return;

  els.categories.innerHTML = [
    `<li>
      <button class="dessert-list__cat-btn is-active" data-cat="">
        Всі десерти
      </button>
    </li>`,
    ...cats.map(c => `
      <li>
        <button class="dessert-list__cat-btn" data-cat="${c._id}">
          ${escapeHtml(c.name)}
        </button>
      </li>
    `)
  ].join('');
}

const ui = {
  showLoader() {
    els.loader?.removeAttribute('hidden');
  },
  hideLoader() {
    els.loader?.setAttribute('hidden', '');
  },
  toggleLoadMore() {
    if (els.loadMore) {
      els.loadMore.hidden = state.page * PAGE_LIMIT >= state.total;
    }
  },
};

async function loadDesserts(reset = false) {
  if (state.loading) return;

  try {
    state.loading = true;

    if (reset) {
      state.page = 1;
      if (els.grid) els.grid.innerHTML = '';
    }

    ui.showLoader();
    if (els.loadMore) els.loadMore.hidden = true;

    const data = await getDesserts({
      page: state.page,
      limit: PAGE_LIMIT,
      category: state.category,
    });

    state.total = data.totalItems ?? data.length ?? 0;
    const items = Array.isArray(data.desserts) ? data.desserts : Array.isArray(data) ? data : [];

    els.grid?.insertAdjacentHTML(
      'beforeend',
      createMarkup(items)
    );

    ui.toggleLoadMore();
  } catch (err) {
    console.error('[loadDesserts]', err);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load desserts',
    });
  } finally {
    state.loading = false;
    ui.hideLoader();
  }
}

async function loadCategories() {
  try {
    const cats = await getCategories();
    renderCustomOptions(cats);
    renderCategoryButtons(cats);
  } catch (err) {
    console.error('[loadCategories]', err);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load categories',
    });
  }
}

trigger?.addEventListener('click', () => {
  const isOpen = els.customSelect?.classList.contains('open');
  setDropdownOpen(!isOpen);
});

dropdown?.addEventListener('click', e => {
  const opt = e.target.closest('.custom-select__option');
  if (!opt) return;

  const newCategory = opt.dataset.cat || '';

if (newCategory === state.category) {
  setDropdownOpen(false);
  return;
}
  state.category = opt.dataset.cat || '';
  state.page = 1;

  syncCategoryUI(state.category);
  loadDesserts(true);
  setDropdownOpen(false);
});

document.addEventListener('click', e => {
  if (!els.customSelect?.contains(e.target)) {
    setDropdownOpen(false);
  }
});

els.categories?.addEventListener('click', e => {
  const btn = e.target.closest('.dessert-list__cat-btn');
  if (!btn) return;

  const newCategory = btn.dataset.cat || '';

if (newCategory === state.category) {
  return;
}

  state.category = btn.dataset.cat || '';
  state.page = 1;

  syncCategoryUI(state.category);
  loadDesserts(true);
});

els.loadMore?.addEventListener('click', () => {
  state.page += 1;
  loadDesserts();
});

(async function init() {
  await loadCategories();
  await loadDesserts(true);
})();


