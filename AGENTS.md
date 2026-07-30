# AGENTS.md

> Этот файл помогает AI-агентам быстро ориентироваться в проекте. Обновляйте при значительных изменениях структуры.

## Обзор проекта

Многостраничный фронтенд-сайт для магазина десертов. Vanilla JS + Vite, данные из REST API, деплой на GitHub Pages.

## Стек технологий

- **Язык:** JavaScript (ES Modules, vanilla)
- **Сборщик:** Vite 5
- **CSS:** Vanilla CSS, mobile-first
- **HTTP-клиент:** axios
- **UI-библиотеки:** Swiper, iziToast, MicroModal, SweetAlert2, accordion-js

## Структура проекта

```
Know-the-game/
├── src/                         # Корень Vite
│   ├── index.html               # Главная страница
│   ├── main.js                  # Точка входа — импортирует все JS-модули
│   ├── js/                      # JS-модули по секциям страницы
│   │   ├── header.js
│   │   ├── popular-products.js
│   │   ├── dessert-list.js
│   │   ├── dessert-details.js
│   │   ├── about-us.js
│   │   ├── feedback.js
│   │   ├── faq-section.js
│   │   ├── footer-jear.js
│   │   ├── order-modal.js
│   │   ├── services/
│   │   │   └── api/
│   │   │       └── api.js       # Единый axios-клиент для API
│   │   └── utils/
│   │       └── createMarkupForProductCard.js
│   ├── css/                     # CSS по компонентам (один файл на секцию)
│   ├── partials/                # HTML-фрагменты (vite-plugin-html-inject)
│   ├── img/                     # Статические изображения
│   └── public/                  # Публичные ассеты
├── .ai-factory/                 # AI-контекст проекта
│   ├── DESCRIPTION.md
│   ├── ARCHITECTURE.md
│   ├── config.yaml
│   └── rules/
│       └── base.md
├── .github/workflows/deploy.yml # CI/CD — деплой на GitHub Pages
├── vite.config.js               # Конфигурация Vite
├── package.json
└── .prettierrc.json
```

## Ключевые точки входа

| Файл | Назначение |
|------|-----------|
| `src/main.js` | Точка входа — импортирует все секции |
| `src/js/services/api/api.js` | Все API-запросы (axios.create) |
| `vite.config.js` | Конфигурация сборки Vite |
| `.github/workflows/deploy.yml` | Деплой на GitHub Pages |

## Документация

| Документ | Путь | Описание |
|----------|------|----------|
| README | README.md | Ссылка на репозиторий |

## AI-контекст

| Файл | Назначение |
|------|-----------|
| AGENTS.md | Карта проекта для AI-агентов |
| .ai-factory/DESCRIPTION.md | Описание проекта, стек, архитектура |
| .ai-factory/ARCHITECTURE.md | Архитектурные решения и паттерны |
| .ai-factory/rules/base.md | Соглашения кодовой базы |

## Правила для агентов

- Декомпозируй команды git: не объединяй несколько git-операций в одну строку
  - Неправильно: `git checkout main && git pull`
  - Правильно: сначала `git checkout main`, затем `git pull origin main`
- API: все запросы к `https://deserts-store.b.goit.study/api` — через `src/js/services/api/api.js`
- CSS: каждая секция имеет свой CSS-файл, mobile-first медиазапросы
- Уведомления об ошибках — через iziToast, не через `alert()`
