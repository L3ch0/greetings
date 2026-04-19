# Інструкція для Claude Code: сайт-привітання з Днем народження

## 0. ПЕРСОНАЛІЗАЦІЯ (заповни перед запуском)

```yaml
# Інформація про адресата
recipient_name: "<<ІМ'Я>>"                    # напр. "Anna"
recipient_nickname: "<<ПЕСТЛИВЕ_ІМ'Я>>"       # напр. "Сонечко", можна лишити порожнім
age: <<ВІК>>                                  # число, напр. 25
birthday_date: "<<ДД.ММ.РРРР>>"               # опціонально

# Естетика
aesthetic: "<<ВАЙБ>>"                         # один із: minimalism | pastel-romance | dark-romance | retro | cosmic | custom
primary_color: "#<<HEX>>"                     # напр. #FFB5C5 (рожевий пастель)
accent_color: "#<<HEX>>"                      # напр. #FFD700 (золотий для полум'я/акцентів)
background_color: "#<<HEX>>"                  # напр. #FFF5F7
text_color: "#<<HEX>>"                        # напр. #2D1B2E
font_heading: "<<GOOGLE_FONT>>"               # напр. "Playfair Display"
font_body: "<<GOOGLE_FONT>>"                  # напр. "Inter"

# Сцена 1: торт
candles_count: <<ЧИСЛО>>                      # скільки свічок на торті (зазвичай = вік, але можна менше, напр. 5-10)
cake_tiers: 2                                 # кількість ярусів торта (2 або 3)

# Сцена 2: подарунки
gifts:
  - type: "memory"
    title: "<<ЗАГОЛОВОК_1>>"                  # напр. "Наша перша зустріч"
    content: "<<ТЕКСТ_СПОГАДУ>>"
    image: "<<ОПЦ_ШЛЯХ_ДО_ФОТО>>"             # напр. "/images/first-date.jpg" або null

  - type: "compliment"
    title: "<<ЗАГОЛОВОК_2>>"                  # напр. "Що я в тобі люблю"
    content: "<<ТЕКСТ_КОМПЛІМЕНТУ>>"

  - type: "promise"
    title: "<<ЗАГОЛОВОК_3>>"                  # напр. "Моя обіцянка"
    content: "<<ТЕКСТ_ОБІЦЯНКИ>>"             # напр. "Везу тебе в Карпати на вихідні"

  - type: "photo"
    title: "<<ЗАГОЛОВОК_4>>"
    image: "<<ШЛЯХ_ДО_ФОТО>>"
    caption: "<<ПІДПИС>>"

  - type: "voice"
    title: "<<ЗАГОЛОВОК_5>>"
    audio: "<<ШЛЯХ_ДО_MP3>>"                  # напр. "/audio/message.mp3"

  - type: "quote"
    title: "<<ЗАГОЛОВОК_6>>"
    content: "<<ВІРШ_ЦИТАТА_ЖАРТ>>"

  # додай/прибери блоки за потребою; рекомендовано 5-7

# Фінал
final_message: "<<ФІНАЛЬНЕ_ПРИВІТАННЯ>>"      # з'являється після відкриття всіх коробок

# Деплой
deploy_subdomain: "<<SUBDOMAIN>>"             # напр. "for-anna" → for-anna.vercel.app
```

---

## 1. Мета проєкту

Односторінковий сайт-привітання з двома сценами:
1. **Сцена 1** — 3D-торт зі свічками; користувач по черзі клікає на полум'я → свічки гаснуть → після останньої запускається конфеті й відбувається плавний перехід.
2. **Сцена 2** — сітка подарункових коробок; клік по коробці відкриває її з анімацією й показує вміст (спогад/фото/голос/обіцянка). Після відкриття всіх коробок з'являється фінальне повідомлення.

Без мікрофону, без бекенду, без бази даних. Усе статичне.

---

## 2. Стек технологій (точні версії)

| Призначення | Пакет | Версія |
|---|---|---|
| Фреймворк | `next` | ^14.2.0 (App Router) |
| Мова | `typescript` | ^5.4.0 |
| Стилі | `tailwindcss` | ^3.4.0 |
| 3D-рендер | `three` | ^0.163.0 |
| React-обгортка для Three | `@react-three/fiber` | ^8.16.0 |
| Хелпери (OrbitControls, Text, etc.) | `@react-three/drei` | ^9.105.0 |
| Анімації UI | `framer-motion` | ^11.0.0 |
| Конфеті | `canvas-confetti` | ^1.9.3 |
| Звуки (опц.) | `howler` | ^2.2.4 |
| Типи для howler | `@types/howler` | ^2.2.11 |
| Типи для confetti | `@types/canvas-confetti` | ^1.6.4 |

**Хостинг:** Vercel (автодеплой з git push; безкоштовний домен `*.vercel.app`).

**Чому саме це:**
- Next.js + Vercel — один клік деплой, SSR не потрібен, але App Router дає гарну структуру.
- R3F + drei — пишемо 3D декларативно як React-компоненти; у 5-10 разів менше коду ніж сирий Three.js.
- Framer Motion — декларативні анімації коробок (`layout`, `AnimatePresence`, `whileHover`).
- Tailwind — швидкий стайлінг без окремих CSS-файлів.

---

## 3. Структура проєкту

```
birthday-site/
├── app/
│   ├── layout.tsx              # глобальний layout + шрифти
│   ├── page.tsx                # головна: керує станом сцени (cake | gifts | final)
│   └── globals.css             # tailwind + глобальні стилі
├── components/
│   ├── CakeScene.tsx           # обгортка <Canvas> + камера + світло
│   ├── Cake.tsx                # 3D-модель торта (яруси)
│   ├── Candle.tsx              # одна свічка + полум'я + хендлер кліку
│   ├── Flame.tsx               # sprite-полум'я з анімацією
│   ├── GiftsScene.tsx          # сітка коробок
│   ├── GiftBox.tsx             # одна коробка (закрита/відкрита) + модалка вмісту
│   ├── GiftContent.tsx         # рендер вмісту за type (memory/compliment/...)
│   ├── FinalMessage.tsx        # фінальний екран
│   └── SceneTransition.tsx     # fade-перехід між сценами
├── lib/
│   ├── config.ts               # експортує заповнений об'єкт із розділу 0
│   └── types.ts                # TypeScript-типи (Gift, GiftType, ...)
├── public/
│   ├── images/                 # фото для подарунків
│   └── audio/                  # mp3 для voice-подарунків
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── package.json
```

---

## 4. Порядок імплементації (суворо за цим порядком)

1. **Ініціалізація:** `npx create-next-app@latest birthday-site --ts --tailwind --app --no-src-dir --import-alias "@/*"`
2. Встановити всі залежності з розділу 2 одним `npm install` командою.
3. Створити `lib/types.ts` і `lib/config.ts` з типізованими даними з розділу 0.
4. Налаштувати `tailwind.config.ts` із кастомними кольорами й шрифтами (розділ 5).
5. `app/layout.tsx` — підключити Google Fonts (через `next/font/google`), metadata.
6. `app/page.tsx` — машина станів: `'cake' | 'transition' | 'gifts' | 'final'`.
7. `components/CakeScene.tsx` + `Cake.tsx` + `Candle.tsx` + `Flame.tsx` (розділ 6).
8. Тест: торт рендериться, свічки гасять, викликається `onAllExtinguished`.
9. `components/SceneTransition.tsx` — fade через Framer Motion.
10. `components/GiftsScene.tsx` + `GiftBox.tsx` + `GiftContent.tsx` (розділ 7).
11. `components/FinalMessage.tsx` (розділ 8).
12. Фінальний полір: звуки (опц.), оптимізація, responsive (розділ 9).
13. Деплой на Vercel (розділ 10).

---

## 5. Дизайн-система

**Tailwind config** — додати до `theme.extend`:
```ts
colors: {
  primary: '<<primary_color>>',
  accent: '<<accent_color>>',
  bg: '<<background_color>>',
  ink: '<<text_color>>',
},
fontFamily: {
  heading: ['<<font_heading>>', 'serif'],
  body: ['<<font_body>>', 'sans-serif'],
},
```

**Глобальні правила:**
- Заголовки — `font-heading`, розмір `text-4xl` і більше на sm+, `text-3xl` на мобільних.
- Основний текст — `font-body`, `leading-relaxed`.
- Заокруглення — `rounded-2xl` для карток, `rounded-full` для кнопок.
- Тіні м'які: `shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]`.
- Transitions — за замовчуванням 300ms ease-out.

---

## 6. Сцена 1 — 3D-торт

### 6.1. CakeScene.tsx
- Повноекранний `<Canvas>` від R3F.
- Камера: `position={[0, 3, 6]}`, `fov={45}`, дивиться на `[0, 1, 0]`.
- OrbitControls з `enableZoom={false}`, `enablePan={false}`, `minPolarAngle={Math.PI/3}`, `maxPolarAngle={Math.PI/2.2}` (легке обертання, без перевертання).
- Світло:
  - `ambientLight` intensity 0.4.
  - `directionalLight` position `[5, 8, 5]` intensity 1, castShadow.
  - Опційно `pointLight` на кожній свічці з кольором `accent_color`, intensity 0.3, поки полум'я горить.
- Фон `<Canvas>` — градієнт через CSS (transparent canvas над div з `bg-gradient-to-b from-primary/30 to-bg`).

### 6.2. Cake.tsx
- 2-3 ярусні циліндри (`<cylinderGeometry>`), кожен вужчий за попередній:
  - нижній: radius 1.5, height 0.6
  - середній: radius 1.1, height 0.5
  - верхній (якщо 3 яруси): radius 0.7, height 0.4
- Матеріал: `<meshStandardMaterial color={primary_color}>`, trохи `roughness={0.6}`.
- Декор: тонкі тори (`<torusGeometry>`) по краях кожного ярусу в `accent_color` — імітація кремових візерунків.
- Приймає пропси для позиції й генерує масив позицій свічок на верхньому ярусі (рівномірно по колу).

### 6.3. Candle.tsx
- Проп: `position`, `isLit`, `onClick`.
- Тіло свічки — тонкий циліндр (radius 0.04, height 0.25), колір білий або пастель.
- Ґніт — темний маленький циліндр на верху.
- Над ним — `<Flame>` якщо `isLit === true`.
- Хітбокс кліку — **тільки полум'я** (див. 6.4), не тіло свічки.

### 6.4. Flame.tsx
- Реалізація через **`<Billboard>`** з drei + `<meshBasicMaterial>` на плейні з текстурою полум'я (SVG-gradient → PNG або згенерувати через drei `<Html>` з CSS).
- **Простіший варіант без текстур:** дві накладені сфери з emissive-матеріалом:
  - Зовнішня: `sphereGeometry` radius 0.08, колір `#FFA500`, emissive `#FF6B00`, emissiveIntensity 2, transparent, opacity 0.6.
  - Внутрішня: `sphereGeometry` radius 0.04, колір `#FFFF00`, emissive `#FFEE00`, emissiveIntensity 3.
- Анімація через `useFrame`: scale коливається `1 + sin(t*8)*0.15`, легке обертання.
- `onClick={onExtinguish}` — обробник. Курсор `cursor-pointer` при hover (через `onPointerOver` → `document.body.style.cursor`).
- При extinguish — анімація fade-out 400ms (scale до 0, opacity до 0), після чого компонент прибирається.

### 6.5. page.tsx — керування свічками
```ts
const [extinguished, setExtinguished] = useState<boolean[]>(
  new Array(config.candles_count).fill(false)
);

const handleExtinguish = (i: number) => {
  setExtinguished(prev => {
    const next = [...prev];
    next[i] = true;
    return next;
  });
};

useEffect(() => {
  if (extinguished.every(Boolean)) {
    // запустити конфеті
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 } }), 300);
    });
    // після 1.8с перейти до подарунків
    setTimeout(() => setScene('transition'), 1800);
    setTimeout(() => setScene('gifts'), 2600);
  }
}, [extinguished]);
```

### 6.6. UX-підказка
Зверху екрана — полупрозорий текст типу `"Торкнися полум'я, щоб задути свічку 🕯️"`, який зникає після першого кліку (`opacity` через Framer Motion).

---

## 7. Сцена 2 — Подарунки

### 7.1. GiftsScene.tsx
- Заголовок: `"З днем народження, <<recipient_name>>!"` (`font-heading`, великий).
- Підзаголовок: `"Відкрий кожен подарунок"`.
- Сітка: `grid grid-cols-2 md:grid-cols-3 gap-6 p-6 max-w-4xl mx-auto`.
- Map по `config.gifts` → рендерить `<GiftBox>`.
- State: `openedIds: Set<number>`. Коли `openedIds.size === gifts.length` → перехід до `FinalMessage`.

### 7.2. GiftBox.tsx
- Дві частини: **кришка** (верхня) + **база** (нижня), з'єднані bow (стрічка-хрест).
- Розміри: `aspect-square`, `rounded-xl`, background — градієнт `from-primary to-primary/70`.
- Стрічка — горизонтальна й вертикальна смуги `accent_color`, бант по центру (SVG або `rounded-full` div).
- Заголовок (`gift.title`) невеличким текстом знизу коробки.
- Closed state: hover → `scale: 1.05`, `rotate: -2deg` (Framer Motion `whileHover`).
- Click → `onOpen(id)`:
  1. Кришка `animate={{ y: -120, rotate: -25, opacity: 0 }}` transition 600ms.
  2. База `animate={{ scale: 0.9, opacity: 0.3 }}`.
  3. Через 300ms відкривається модалка з `<GiftContent>` (AnimatePresence).
- Після закриття модалки коробка лишається у «відкритому» стані (приглушеному), і додається до `openedIds`.

### 7.3. GiftContent.tsx
Рендерить залежно від `gift.type`:

| type | UI |
|---|---|
| `memory` | `title` + прозова розповідь + опц. фото (max-h-96 object-cover, rounded-xl) |
| `compliment` | центрований текст великим шрифтом, можна з декоративними лапками |
| `promise` | текст + іконка (наприклад SVG-серце або самоліт); акцент на `accent_color` |
| `photo` | фото на всю ширину модалки + caption знизу курсивом |
| `voice` | кастомний аудіоплеєр: кнопка play/pause (icon), прогрес-бар, час. Howler.js або HTML `<audio>` |
| `quote` | текст вірша/цитати з `font-heading`, italic, центр |

Модалка: overlay `bg-black/60 backdrop-blur-sm`, card `bg-bg rounded-3xl p-8 max-w-lg`, close кнопка в куті (×).

**Анімація модалки:**
```ts
initial={{ opacity: 0, scale: 0.8, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.9 }}
transition={{ duration: 0.4, ease: 'easeOut' }}
```

---

## 8. Фінал

Коли `openedIds.size === gifts.length` — через 500ms (щоб модалка встигла закритись):
- Усі коробки плавно зникають (stagger fade).
- З'являється `<FinalMessage>`: великий текст `config.final_message`, внизу — маленькі серденька/конфеті періодично.
- Фонове конфеті: запустити `confetti` раз на 4-5 секунд м'якими сплесками.

---

## 9. Фінальний полір

- **Responsive:** перевірити на 375px (iPhone SE) — торт не має виходити за край; сітка коробок 2 колонки на мобільному.
- **Touch:** `onClick` у R3F працює на touch за замовчуванням; переконатись що хітбокси полум'я не менші за 44×44px на мобільному (збільшити `scale` невидимого клік-плейну навколо полум'я).
- **Preload зображень:** використати `next/image` з `priority` для першого фото.
- **Lighthouse:** цільові метрики Performance >85, Accessibility >95.
- **Звуки (опційно):** Howler.js — «пуф» при задуванні (`/audio/blow.mp3`), «шурхіт» при відкритті коробки (`/audio/open.mp3`), тиха фонова мелодія (loop, volume 0.2, з кнопкою mute у куті).
- **Meta tags у `layout.tsx`:** `title`, `description`, og-image (можна зробити скріншот торта й покласти в `/public/og.png`).

---

## 10. Деплой

1. `git init && git add . && git commit -m "init"`.
2. Створити порожній репо на GitHub → `git push`.
3. На vercel.com → Import Project → вибрати репо → Deploy (без змін налаштувань).
4. У Settings → Domains → перейменувати піддомен на `<<deploy_subdomain>>.vercel.app`.
5. Будь-який наступний `git push` → автодеплой.

---

## 11. Обмеження та non-goals

- **Не** робити бекенд, БД, авторизацію, CMS.
- **Не** додавати аналітику, трекери, куки.
- **Не** використовувати важкі 3D-моделі у форматі GLTF — тільки примітиви Three.js.
- **Не** підключати сторонні UI-бібліотеки (shadcn, MUI, Chakra) — тільки Tailwind.
- **Не** писати тести — це одноразовий проєкт.

---

## 12. Критерії завершеності

- [ ] `npm run dev` запускається без помилок і варнінгів.
- [ ] На `localhost:3000` видно 3D-торт з правильною кількістю свічок.
- [ ] Клік по кожному полум'ю гасить його з анімацією.
- [ ] Після останньої свічки летить конфеті й через ~2с з'являється екран з подарунками.
- [ ] Кожна коробка відкривається кліком, показує свій вміст, закривається.
- [ ] Після відкриття всіх — з'являється фінальне повідомлення.
- [ ] На iPhone-розмірі все працює й нічого не обрізається.
- [ ] Проєкт задеплоєний на Vercel і доступний за публічним URL.
