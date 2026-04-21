# ATELIER — Интернет-магазин мужской одежды

Минимальный полнофункциональный интернет-магазин мужской одежды.

**Стек:**
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Zustand + React Router + Leaflet (карта)
- **Backend:** NestJS + Prisma + JWT + bcrypt
- **БД:** PostgreSQL
- **Уведомления:** Telegram Bot API

## Структура

```
online-shop minimal/
├── backend/    # NestJS API
└── frontend/   # React SPA
```

## Функционал

### Клиент
- Регистрация / вход (email + пароль, JWT)
- Главная: каталог товаров с карточками
- Фильтры: категория, цена от/до, сортировка
- Поиск по товарам
- Страница товара (`/product/:id`) с выбором размера и количества
- Корзина (хранится в localStorage)
- Оформление заказа: имя, телефон, адрес + **выбор точки на карте** (OpenStreetMap + Nominatim, бесплатно)
- После оформления — переход на страницу "Мои заказы"
- Профиль, выход

### Админ
- Доступ только для роли `ADMIN`
- Список товаров с поиском и фильтром по категории
- Создание / редактирование / удаление товаров

### Telegram
- При оформлении заказа — сообщение в Telegram (состав заказа, имя, адрес, ссылка на карту)

### Категории мужской одежды
- Брюки (`PANTS`)
- Обувь (`SHOES`)
- Рубашки (`SHIRTS`)
- Верхняя одежда (`OUTERWEAR`)

---

## Локальный запуск

### 1. PostgreSQL
Поднимите Postgres локально (например, через Docker):
```bash
docker run --name shop-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=online_shop -p 5432:5432 -d postgres:16
```

### 2. Telegram-бот (опционально, но нужен для уведомлений)
1. В Telegram напишите [@BotFather](https://t.me/BotFather) → `/newbot` → получите токен.
2. Напишите любое сообщение вашему боту.
3. Получите `chat_id`: откройте `https://api.telegram.org/bot<TOKEN>/getUpdates` → ищите `"chat":{"id": ...}`.

### 3. Backend
```bash
cd backend
cp .env.example .env
# Заполните .env:
#   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/online_shop?schema=public
#   JWT_SECRET=<любая длинная строка>
#   TELEGRAM_BOT_TOKEN=<токен бота>
#   TELEGRAM_CHAT_ID=<ваш chat id>
#   CORS_ORIGIN=http://localhost:5173

npm install
npx prisma migrate dev --name init
npm run seed           # создаёт админа + 12 товаров
npm run start:dev
```
API будет на `http://localhost:4000/api`.

**Админ по умолчанию:** `admin@shop.com` / `admin123` (можно изменить в `.env`).

### 4. Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:4000/api

npm install
npm run dev
```
Откройте `http://localhost:5173`.

---

## Деплой

### Backend → Railway
1. Зайдите на [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**.
2. Подключите репозиторий, укажите **root directory = `backend`**.
3. Добавьте сервис **PostgreSQL** (Add → Database → PostgreSQL).
4. В переменных сервиса backend задайте:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (ссылка на переменную из Postgres-сервиса)
   - `JWT_SECRET` = любая длинная строка
   - `JWT_EXPIRES_IN` = `7d`
   - `TELEGRAM_BOT_TOKEN` = токен бота
   - `TELEGRAM_CHAT_ID` = ваш chat id
   - `CORS_ORIGIN` = URL фронтенда на Vercel (например, `https://atelier.vercel.app`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — опционально
   - `PORT` Railway задаст сам
5. После деплоя откройте Shell сервиса и выполните:
   ```bash
   npm run seed
   ```
6. Скопируйте публичный URL сервиса (`Settings → Networking → Generate Domain`) — это ваш API.

### Frontend → Vercel
1. Зайдите на [vercel.com](https://vercel.com) → **Add New Project** → импорт репозитория.
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite
4. Environment Variables:
   - `VITE_API_URL` = `https://<your-railway-backend>.up.railway.app/api`
5. Deploy.
6. После деплоя вернитесь на Railway и обновите `CORS_ORIGIN` на URL Vercel.

---

## API endpoints

### Auth
| Method | URL | Auth | Описание |
|---|---|---|---|
| POST | `/api/auth/register` | — | `{ email, password, name? }` |
| POST | `/api/auth/login` | — | `{ email, password }` |
| GET | `/api/auth/me` | Bearer | Текущий пользователь |

### Products
| Method | URL | Auth | Описание |
|---|---|---|---|
| GET | `/api/products` | — | `?search=&category=&minPrice=&maxPrice=&sort=` |
| GET | `/api/products/:id` | — | |
| POST | `/api/products` | Admin | Создать |
| PATCH | `/api/products/:id` | Admin | Обновить |
| DELETE | `/api/products/:id` | Admin | Удалить |

### Orders
| Method | URL | Auth | Описание |
|---|---|---|---|
| POST | `/api/orders` | User | `{ items, name, phone, address, lat?, lng? }` |
| GET | `/api/orders/mine` | User | Мои заказы |
| GET | `/api/orders/:id` | User | Мой заказ по id |
| GET | `/api/orders/all` | Admin | Все заказы |

---

## Что дальше (опционально)
- Загрузка изображений товаров (Cloudinary / S3) вместо URL
- Статусы заказов в админке
- Оплата (Stripe / ЮKassa)
- Email-уведомления
