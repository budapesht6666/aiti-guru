# Правила агента — Aiti Guru

## Стек технологий

| Инструмент          | Версия / команда                                                |
| ------------------- | --------------------------------------------------------------- |
| **Vite**            | `npm create vite@latest` → шаблон `react-ts`                    |
| **React**           | последняя стабильная                                            |
| **TypeScript**      | `strict: true` в `tsconfig.json` — никаких `any`                |
| **react-hook-form** | `npm install react-hook-form` — все формы только через него     |
| **shadcn/ui**       | `npx shadcn@latest init -t vite`                                |
| **Zustand**         | `npm install zustand` — весь глобальный стейт только через него |
| **TanStack Table**  | `npm install @tanstack/react-table` — таблица товаров           |
| **Tailwind CSS**    | входит в shadcn init, не устанавливать отдельно                 |

Браузер-таргет: актуальная версия Google Chrome.

---

## Инициализация проекта

```bash
npm create vite@latest . -- --template react-ts
npm install
npx shadcn@latest init -t vite
```

---

## Структура проекта

```
src/
  api/          # функции для запросов к DummyJSON (products, auth)
  components/   # переиспользуемые UI-компоненты
  pages/        # LoginPage, ProductsPage
  store/        # Zustand-сторы: useAuthStore, useProductStore
  types/        # TypeScript-интерфейсы для API и стора
  lib/          # utils.ts и прочие утилиты
```

---

## API — DummyJSON

- **Список товаров**: `GET https://dummyjson.com/products?sortBy=price&order=asc&limit=20&skip=0`
- **Поиск**: `GET https://dummyjson.com/products/search?q=<term>`
- **Редактирование товара**: `PATCH https://dummyjson.com/products/{id}`
- **Авторизация**: `POST https://dummyjson.com/auth/login` body `{ username, password }`
- Защищённые запросы: заголовок `Authorization: Bearer <accessToken>`
- Все ответы типизировать через интерфейсы в `src/types/`

---

## Zustand — правила стора

Создавать сторы с явными TypeScript-интерфейсами через `create<State>()()`:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

// Пример: persist с динамическим выбором storage (localStorage vs sessionStorage)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
      // storage выбирается при логине в зависимости от чекбокса "Запомнить меня"
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

- `useAuthStore` — `token`, `setToken(token, remember)`, `logout`; `persist` переключает storage по флагу `remember`
- `useProductStore` — `products`, `localProducts`, `isLoading`, `sortBy`, `order`, `currentPage`, `total`, `search`
  - Экшны: `fetchProducts`, `addProduct`, `updateProduct`, `setSort` (сброс `currentPage=1`), `setPage`, `setSearch` (сброс `currentPage=1`)
  - `total` берётся из поля `total` ответа DummyJSON; `skip = (currentPage-1) * 20`
- Для отладки: `devtools` middleware, `enabled: process.env.NODE_ENV === 'development'`

---

## Аутентификация

- Форма: поля `username` и `password` через `react-hook-form`, валидация `required`
- Чекбокс «Запомнить меня»:
  - установлен → хранить токен в `localStorage` (сессия живёт после закрытия браузера)
  - не установлен → хранить токен в `sessionStorage` (сбрасывается при закрытии вкладки)
- При ошибке API: вызывать `setError` из `useForm` для отображения текста ошибки под полем
- После успешного входа — редирект на страницу товаров

```typescript
const {
  register,
  handleSubmit,
  setError,
  formState: { errors },
} = useForm<LoginForm>();

// При ошибке API:
setError('root', { message: 'Неверный логин или пароль' });
```

---

## Таблица товаров — shadcn + TanStack Table

Установить компоненты:

```bash
npx shadcn@latest add table
npx shadcn@latest add progress
```

Таблица строится через `@tanstack/react-table` + shadcn `Table`-компоненты.
Столбцы **строго по макету Figma**: ☐ чекбокс | Фото + Наименование + Категория(subtext) | Вендор | Артикул | Оценка (x.x/5) | Цена, ₽ | Actions (синяя кнопка + ⋯ меню)

```typescript
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
```

- Состояние сортировки (`SortingState`) синхронизировать с Zustand-стором
- При изменении сортировки — перезапрашивать данные из API с параметрами `sortBy` и `order`
- Во время загрузки — показывать shadcn `<Progress>` поверх или над таблицей

---

## Поиск товаров

- Инпут с debounce **300 мс** (использовать `useDebounce` хук или `setTimeout`/`clearTimeout`)
- При изменении запроса вызывать `GET /products/search?q=<term>` и обновлять стор

---

## Добавление товара

Установить компонент:

```bash
npx shadcn@latest add dialog
# или
npx shadcn@latest add sheet
```

- Кнопка «Добавить» открывает shadcn `Dialog` или `Sheet`
- Форма через `react-hook-form`: поля **Наименование**, **Цена** (number), **Вендор**, **Артикул** — все `required`
- **API-запрос не делать** — добавлять товар только в локальный стейт Zustand
- После добавления показывать Toast через **sonner**:

```bash
npx shadcn@latest add sonner
```

```typescript
import { toast } from 'sonner';
toast.success('Товар успешно добавлен');
```

Добавить `<Toaster />` в корень приложения (`main.tsx` или `App.tsx`).

---

## Редактирование товара

- Синяя кнопка `+` в строке таблицы открывает shadcn `Sheet` справа, предзаполненный данными товара
- Форма через `react-hook-form`: поля **Наименование**, **Цена** (number), **Вендор**, **Артикул** — все `required`
- При сохранении: `PATCH https://dummyjson.com/products/{id}` через `updateProduct` в `src/api/products.ts`
- После успешного ответа — обновить товар в Zustand-сторе (не перезапрашивать список)
- Показать `toast.success('Товар успешно обновлён')`
- Локально добавленные товары (id начинаются с `local-`) — обновлять только в Zustand без API-запроса

---

## Логика интерфейса

- Рейтинг < 3 → ячейка с классом `text-red-500` (или `text-destructive` из token-системы shadcn)
- Все интерактивные состояния (hover, focus, disabled) должны быть визуально очевидны

---

## Дизайн

- Реализация визуально соответствует макету Figma:
  https://www.figma.com/design/MbyxPG0ZgG9NhFGVq56xMt/Aiti-Guru-%D1%82%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D0%BE%D0%B5-%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5?node-id=1-299
- Использовать CSS-переменные и токены shadcn (`--primary`, `--muted`, `--destructive` и т.д.)
- Не отступать от макета без явной причины

---

## Правила кода

- Строгая типизация: `strict: true`, никаких `any`, явные типы для всех props и состояний
- Компоненты — функциональные с именованным экспортом (`export function Component`)
- Запросы к API — только через функции в `src/api/`, никогда напрямую из компонентов
- Глобальный стейт — только в Zustand, локальный UI-стейт — `useState`
- Не добавлять комментарии, docstrings и лишние абстракции без необходимости
- Валидировать только на границах системы: API-ответы и пользовательский ввод

## Самое главное

- сайт должен быть адаптивным, хорошо отображаться как на десктоп так и на мобилке
- используешь библиотеку, API -> посмотри в свежие доки mcp context7
- используешь ссылку на figma -> используй mcp Figma Remote
- **перед реализацией любого экрана** — обязательно прочитать макет через mcp Figma Remote и составить маппинг: какой Figma-компонент → какой shadcn-компонент, точные отступы, цвета и размеры
- тут лежат возможные mcp сервера -> C:\Users\Pavel\AppData\Roaming\Code\User\mcp.json
