# Інструкція для Claude Code: сайт-привітання з Днем народження

## 0. ПЕРСОНАЛІЗАЦІЯ (заповни перед запуском)

```yaml
# Інформація про адресата
recipient_name: "Крістіна"                    # напр. "Anna"
recipient_nickname: "Сонечко"       # напр. "Сонечко", можна лишити порожнім
age: 25                                  # число, напр. 25
birthday_date: "<<20.04.2001>>"               # опціонально

# Естетика
aesthetic: "pastel-romance"                         # один із: minimalism | pastel-romance | dark-romance | retro | cosmic | custom
primary_color: "#FFB5C5"                     # напр. #FFB5C5 (рожевий пастель)
accent_color: "#FFD700"                      # напр. #FFD700 (золотий для полум'я/акцентів)
background_color: "#FFF5F7"                  # напр. #FFF5F7
text_color: "#2D1B2E"                        # напр. #2D1B2E
font_heading: "Playfair Display"               # напр. "Playfair Display"
font_body: "Inter"                  # напр. "Inter"

# Сцена 1: торт
candles_count: 7                      # скільки свічок на торті (зазвичай = вік, але можна менше, напр. 5-10)
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

## 1. Мета

Односторінковий SPA з трьома сценами:
1. **Cake** — 3D-торт з свічками. Тап по полум'ю гасить свічку. Після останньої — конфеті й перехід.
2. **Gifts** — сітка подарункових коробок. Тап відкриває коробку з вмістом у bottom-sheet модалці.
3. **Final** — фінальне привітання після відкриття всіх коробок.
   Без бекенду, без БД, без автентифікації. Усе статичне. Primary target: iPhone 14 Pro Max (430×932, DPR 3, ProMotion). Min supported: iPhone SE (375×667).

---

## 2. Стек (точні версії)

| Призначення | Пакет | Версія |
|---|---|---|
| Фреймворк | `next` | ^14.2.0 |
| Мова | `typescript` | ^5.4.0 |
| Стилі | `tailwindcss` | ^3.4.0 |
| 3D | `three` | ^0.163.0 |
| R3F | `@react-three/fiber` | ^8.16.0 |
| drei | `@react-three/drei` | ^9.105.0 |
| Анімації | `framer-motion` | ^11.0.0 |
| Конфеті | `canvas-confetti` | ^1.9.3 |
| Звуки | `howler` | ^2.2.4 |
| Типи | `@types/howler`, `@types/canvas-confetti` | latest compatible |

Встановити точно ці версії — не `latest`. Хостинг: Vercel (автодеплой з git push).
 
---

## 3. Структура

```
birthday-site/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── CakeScene.tsx
│   ├── RotatingGroup.tsx
│   ├── Cake.tsx
│   ├── Candle.tsx
│   ├── Flame.tsx
│   ├── GiftsScene.tsx
│   ├── GiftBox.tsx
│   ├── GiftContent.tsx
│   ├── FinalMessage.tsx
│   └── SceneTransition.tsx
├── lib/
│   ├── config.ts
│   ├── scene-colors.ts
│   └── types.ts
├── public/
│   ├── images/
│   └── audio/
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── package.json
```
 
---

## 4. Порядок імплементації

1. `npx create-next-app@latest birthday-site --ts --tailwind --app --no-src-dir --import-alias "@/*"`
2. Встановити залежності з розділу 2 одною командою `npm install`.
3. `lib/types.ts` + `lib/config.ts` + `lib/scene-colors.ts` (розділ 5, 7).
4. `tailwind.config.ts` — кастомні кольори, шрифти, safe-area spacing (розділ 6).
5. `app/layout.tsx` — шрифти через `next/font/google`, viewport з `viewportFit: 'cover'`.
6. `app/globals.css` — safe-area padding, `overscroll-behavior: none`, `no-select` клас.
7. `app/page.tsx` — state machine: `'cake' | 'transition' | 'gifts' | 'final'`.
8. Сцена 1 (розділ 7) — повністю до робочого стану.
9. Checkpoint: усі 12 пунктів чеклісту розділу 7.9.
10. `SceneTransition.tsx` — fade через Framer Motion.
11. Сцена 2 (розділ 8).
12. `FinalMessage.tsx` (розділ 9).
13. Полір, deploy (розділи 10, 11).
---

## 5. Типи та конфіг

```ts
// lib/types.ts
export type GiftType = 'memory' | 'compliment' | 'promise' | 'photo' | 'voice' | 'quote';
 
export interface Gift {
  type: GiftType;
  title: string;
  content?: string;
  image?: string;
  caption?: string;
  audio?: string;
}
 
export interface Config {
  recipient_name: string;
  recipient_nickname: string;
  age: number;
  birthday_date: string;
  aesthetic: string;
  primary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  font_heading: string;
  font_body: string;
  candles_count: number;
  cake_tiers: 2;
  gifts: Gift[];
  final_message: string;
  deploy_subdomain: string;
}
```

```ts
// lib/config.ts — експорт типізованого об'єкта з розділу 0
import type { Config } from './types';
export const config: Config = { /* значення з розділу 0 */ };
```
 
---

## 6. Дизайн-система

**Tailwind `theme.extend`:**
```ts
colors: {
  primary: config.primary_color,
  accent: config.accent_color,
  bg: config.background_color,
  ink: config.text_color,
},
fontFamily: {
  heading: [config.font_heading, 'serif'],
  body: [config.font_body, 'sans-serif'],
},
spacing: {
  'safe-top': 'env(safe-area-inset-top)',
  'safe-bottom': 'env(safe-area-inset-bottom)',
},
```

**Viewport (layout.tsx):**
```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: config.background_color,
};
```

**globals.css:**
```css
@layer base {
  html, body {
    height: 100%;
    overscroll-behavior: none;
    -webkit-tap-highlight-color: transparent;
  }
  body {
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
  .no-select {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
}
 
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Типографіка:**
| Елемент | Mobile | md+ |
|---|---|---|
| Hero heading | `text-3xl` | `md:text-5xl` |
| Body | `text-base leading-relaxed` | `md:text-lg` |
| Small labels | `text-xs` | `md:text-sm` |

**Правила:** `rounded-2xl` для карток, `rounded-full` для кнопок. Тіні: `shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]`. Transitions 300ms ease-out. Використовувати `h-[100dvh]`, НЕ `h-screen`.
 
---

## 7. Сцена 1 — Торт зі свічками

### 7.1. Палітра сцени (`lib/scene-colors.ts`)

Усі 3D-кольори імпортуються звідси. НЕ хардкодити hex у JSX.

```ts
export const SCENE = {
  PRIMARY: '#FFB5C5',       // верхній ярус
  PRIMARY_DEEP: '#E89AAE',  // нижній ярус
  ACCENT: '#FFD700',        // золотий декор
  WAX: '#FFF8F0',           // свічка білого кольору
  WAX_ALT: '#FFDCE4',       // свічка рожевого (чергується з WAX)
  WICK: '#2B1A10',          // ґніт
  FLAME_OUTER: '#FFA24B',   // зовнішнє гало
  FLAME_INNER: '#FFF2A8',   // яскраве ядро
  POINT_LIGHT: '#FFB86B',   // тепле світло
} as const;
```

### 7.2. CakeScene.tsx

```tsx
<Canvas
  shadows={!isMobile}
  dpr={[1, 2]}
  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  camera={{
    fov: isMobile ? 55 : 42,
    position: isMobile ? [0, 2.5, 7] : [0, 2.2, 6.2],
    near: 0.1,
    far: 100
  }}
  style={{ height: '100dvh', width: '100%', touchAction: 'none' }}
  onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; }}
>
  {/* lights + shadow-catcher + RotatingGroup */}
</Canvas>
```

`isMobile` — через media query хук `useMediaQuery('(max-width: 768px)')`.

**Камера дивиться на `[0, 0.2, 0]`**. OrbitControls НЕ використовувати.

### 7.3. Освітлення

```tsx
<ambientLight intensity={0.55} />
<directionalLight
  position={[5, 8, 4]} intensity={0.9} castShadow
  shadow-mapSize-width={1024} shadow-mapSize-height={1024}
  shadow-camera-near={1} shadow-camera-far={20}
  shadow-camera-left={-4} shadow-camera-right={4}
  shadow-camera-top={4} shadow-camera-bottom={-4}
/>
<directionalLight position={[-4, 3, -2]} intensity={0.25} color="#FFD6E0" />
```

### 7.4. Shadow catcher

```tsx
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.82, 0]} receiveShadow>
  <planeGeometry args={[12, 12]} />
  <shadowMaterial opacity={0.18} />
</mesh>
```

### 7.5. RotatingGroup.tsx

Обгортає торт і свічки. Реалізує:
- Повільне автообертання `rotation.y += 0.0035` щокадру через `useFrame`.
- Drag через `onPointerDown/Move/Up` з `setPointerCapture`.
- Через 2500мс після `pointerUp` автообертання відновлюється.
- Клік по полум'ю НЕ зчитується як drag (R3F робить це автоматично якщо рух <5px — не ламати вручну).
```tsx
function RotatingGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const idleRotate = useRef(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 
  useFrame(() => {
    if (idleRotate.current && groupRef.current) {
      groupRef.current.rotation.y += 0.0035;
    }
  });
 
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    idleRotate.current = false;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    (e.target as Element).setPointerCapture(e.pointerId);
  };
 
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !groupRef.current) return;
    groupRef.current.rotation.y += (e.clientX - lastX.current) * 0.008;
    lastX.current = e.clientX;
  };
 
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    idleTimer.current = setTimeout(() => { idleRotate.current = true; }, 2500);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };
 
  return (
    <group ref={groupRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      {children}
    </group>
  );
}
```

### 7.6. Cake.tsx — геометрія торта

**Рівно 2 яруси.**

```tsx
// Нижній ярус
<mesh position={[0, -0.4, 0]} castShadow receiveShadow>
  <cylinderGeometry args={[1.5, 1.5, 0.8, 64]} />
  <meshStandardMaterial color={SCENE.PRIMARY_DEEP} roughness={0.55} metalness={0.05} />
</mesh>
 
// Верхній ярус
<mesh position={[0, 0.3, 0]} castShadow receiveShadow>
  <cylinderGeometry args={[1.0, 1.0, 0.6, 64]} />
  <meshStandardMaterial color={SCENE.PRIMARY} roughness={0.55} metalness={0.05} />
</mesh>
```

Сегментація 64 — не зменшувати. Верхній — світліший, нижній — темніший (обов'язково).

**Декор — 4 торусних обідка:**
```tsx
const RIMS = [
  { r: 1.5, y:  0.0 },
  { r: 1.5, y: -0.8 },
  { r: 1.0, y:  0.6 },
  { r: 1.0, y:  0.0 },
];
 
{RIMS.map((rim, i) => (
  <mesh key={i} position={[0, rim.y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
    <torusGeometry args={[rim.r, 0.035, 14, 64]} />
    <meshStandardMaterial color={SCENE.ACCENT} roughness={0.28} metalness={0.85} />
  </mesh>
))}
```

**16 золотих крапок по основі:**
```tsx
{Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return (
    <mesh key={i} position={[Math.cos(a) * 1.5, -0.4, Math.sin(a) * 1.5]}>
      <sphereGeometry args={[0.055, 12, 12]} />
      <meshStandardMaterial color={SCENE.ACCENT} roughness={0.28} metalness={0.85} />
    </mesh>
  );
})}
```

### 7.7. Candle.tsx

Свічки розставлені по колу радіусом 0.6 на верхньому ярусі, **чергуються** `WAX` / `WAX_ALT`:

```tsx
{Array.from({ length: config.candles_count }, (_, i) => {
  const a = (i / config.candles_count) * Math.PI * 2;
  const x = Math.cos(a) * 0.6;
  const z = Math.sin(a) * 0.6;
  const waxColor = i % 2 === 0 ? SCENE.WAX : SCENE.WAX_ALT;
  return (
    <Candle
      key={i}
      index={i}
      x={x} z={z}
      waxColor={waxColor}
      isLit={!extinguished[i]}
      onExtinguish={() => handleExtinguish(i)}
    />
  );
})}
```

**Всередині Candle:**
```tsx
// Тіло
<mesh position={[x, 0.79, z]} castShadow>
  <cylinderGeometry args={[0.055, 0.055, 0.38, 20]} />
  <meshStandardMaterial color={waxColor} roughness={0.4} />
</mesh>
 
// Ґніт
<mesh position={[x, 1.00, z]}>
  <cylinderGeometry args={[0.008, 0.008, 0.05, 8]} />
  <meshStandardMaterial color={SCENE.WICK} roughness={0.9} />
</mesh>
 
<Flame x={x} z={z} isLit={isLit} phase={index * 1.7} onExtinguish={onExtinguish} />
```

### 7.8. Flame.tsx — КРИТИЧНИЙ КОМПОНЕНТ

`<group position={[x, 1.05, z]}>` з чотирьох частин:

```tsx
<group position={[x, 1.05, z]}>
  {/* 1. Зовнішнє гало */}
  <mesh ref={outerRef} scale={[1, 1.55, 1]}>
    <sphereGeometry args={[0.09, 18, 18]} />
    <meshBasicMaterial color={SCENE.FLAME_OUTER} transparent opacity={0.55} />
  </mesh>
 
  {/* 2. Внутрішнє ядро */}
  <mesh ref={innerRef} scale={[1, 1.5, 1]} position={[0, -0.01, 0]}>
    <sphereGeometry args={[0.045, 16, 16]} />
    <meshBasicMaterial color={SCENE.FLAME_INNER} transparent opacity={1} />
  </mesh>
 
  {/* 3. Тепле світло */}
  <pointLight
    ref={lightRef}
    color={SCENE.POINT_LIGHT}
    intensity={0.35}
    distance={1.6}
    decay={2}
    position={[0, 0.10, 0]}
  />
 
  {/* 4. Невидимий хітбокс — 0.22, не менше */}
  <mesh
    onClick={onExtinguish}
    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
    onPointerOut={() => { document.body.style.cursor = 'default'; }}
    visible={false}
  >
    <sphereGeometry args={[0.22, 12, 12]} />
    <meshBasicMaterial transparent opacity={0} />
  </mesh>
</group>
```

**`meshBasicMaterial` обов'язково** — полум'я не має реагувати на світло.
**`transparent={true}` на ядрі** — інакше opacity в useFrame не працюватиме.

**Анімація — extinguish через useRef, не useState** (критично):

```tsx
const extinguishProgress = useRef(0); // 0 = горить, 1 = згасла
 
useFrame((state, delta) => {
  const t = state.clock.elapsedTime;
 
  if (!isLit && extinguishProgress.current < 1) {
    extinguishProgress.current = Math.min(1, extinguishProgress.current + delta * 2);
  }
 
  const fade = 1 - extinguishProgress.current;
  if (fade <= 0) return;
 
  const flicker = 1
    + Math.sin(t * 7 + phase) * 0.10
    + Math.sin(t * 13 + phase * 0.5) * 0.04;
 
  if (outerRef.current) {
    outerRef.current.scale.set(flicker * fade, 1.55 * flicker * fade, flicker * fade);
    (outerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * fade;
  }
  if (innerRef.current) {
    innerRef.current.scale.set(
      flicker * 0.92 * fade,
      1.5 * flicker * 0.92 * fade,
      flicker * 0.92 * fade
    );
    (innerRef.current.material as THREE.MeshBasicMaterial).opacity = fade;
  }
  if (lightRef.current) {
    lightRef.current.intensity = (0.32 + Math.sin(t * 11 + phase) * 0.10) * fade;
  }
});
```

Чому ref: state-анімація 60fps × 7 свічок = 420 re-render/с — це вбиває FPS. `delta * 2` дає ~500мс повного згасання незалежно від FPS пристрою.

**Фаза `phase = index * 1.7`** — обов'язково, інакше свічки мерехтять синхронно, виглядає штучно.

### 7.9. page.tsx — логіка Сцени 1

```tsx
const [extinguished, setExtinguished] = useState<boolean[]>(
  () => new Array(config.candles_count).fill(false)
);
const [scene, setScene] = useState<'cake' | 'transition' | 'gifts' | 'final'>('cake');
 
const handleExtinguish = (i: number) => {
  setExtinguished(prev => {
    if (prev[i]) return prev;
    const next = [...prev];
    next[i] = true;
    return next;
  });
};
 
useEffect(() => {
  if (extinguished.length === 0 || !extinguished.every(Boolean)) return;
 
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.55 }, disableForReducedMotion: true });
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.45 }, disableForReducedMotion: true }), 280);
  });
 
  const t1 = setTimeout(() => setScene('transition'), 1800);
  const t2 = setTimeout(() => setScene('gifts'), 2600);
  return () => { clearTimeout(t1); clearTimeout(t2); };
}, [extinguished]);
```

### 7.10. UX-підказка

Текст «Торкнися вогника, щоб задути свічку»:
- Позиція: `absolute top-[calc(env(safe-area-inset-top)+16px)]`, центр горизонталі.
- `text-sm md:text-base`, `text-ink/70`.
- Клас `no-select`.
- Opacity через Framer Motion: зникає після **першої успішно погашеної** свічки (не після першого тапу — тап міг промахнутися).
### 7.11. Структура сцени 1

```
CakeScene.tsx
├── <Canvas>
├── <ambientLight> + 2× <directionalLight>
├── shadow-catcher <mesh>
└── <RotatingGroup>
    ├── <Cake>
    │   ├── bottom tier (PRIMARY_DEEP)
    │   ├── top tier (PRIMARY)
    │   ├── 4 × torus rims (ACCENT)
    │   └── 16 × decorative dots (ACCENT)
    └── <Candle> × N
        ├── body (cylinder, waxColor чергується)
        ├── wick (cylinder)
        └── <Flame>
            ├── outer sphere (halo)
            ├── inner sphere (core)
            ├── pointLight
            └── invisible hitbox sphere (radius 0.22)
```

### 7.12. Чого НЕ робити в Сцені 1

- Не додавати `<OrbitControls>` (є RotatingGroup).
- Не використовувати `<Html>` від drei для полум'я.
- Не використовувати `meshStandardMaterial` для полум'я — тільки `meshBasicMaterial`.
- Не зменшувати хітбокс менше 0.22.
- Не об'єднувати свічки в InstancedMesh.
- Не використовувати `useState` для anim-прогресу згасання.
- Не оптимізовувати жодні числові значення з цього розділу.
### 7.13. Чекліст Сцени 1 (звітувати по кожному після імплементації)

- [ ] Два яруси з різними відтінками рожевого, верхній світліший.
- [ ] 4 золотих обідка видимі.
- [ ] 16 золотих крапок навколо основи.
- [ ] N свічок (згідно config), чергуються білий/рожевий.
- [ ] Кожна свічка мерехтить у своєму ритмі.
- [ ] Торт повільно обертається сам.
- [ ] Drag обертає; через 2.5с автообертання відновлюється.
- [ ] Тап по полум'ю плавно гасить свічку за ~500мс.
- [ ] PointLight гасне разом з полум'ям.
- [ ] FPS ≥55 на desktop, ≥50 на мобільному.
- [ ] Після останньої — два сплески конфеті + перехід через 2.6с.
- [ ] `npm run dev` без помилок у консолі браузера.
---

## 8. Сцена 2 — Подарунки

### 8.1. GiftsScene.tsx

Заголовок: `"З днем народження, {recipient_name}!"` — `font-heading text-3xl md:text-5xl`. Підзаголовок: «Відкрий кожен подарунок» — `text-sm md:text-base text-ink/70`.

Сітка:
```tsx
<div className="grid grid-cols-2 gap-4 p-4 max-w-lg mx-auto md:grid-cols-3 md:gap-6 md:p-6 md:max-w-4xl">
  {config.gifts.map((gift, i) => <GiftBox key={i} gift={gift} index={i} ... />)}
</div>
```

State: `openedIds: Set<number>`. Коли `openedIds.size === config.gifts.length` → `setScene('final')`.

### 8.2. GiftBox.tsx

`aspect-square rounded-xl`, градієнт `bg-gradient-to-br from-primary to-primary/70`. Стрічка — горизонтальна + вертикальна смуги `bg-accent`, бант по центру (SVG або rounded div).

**Touch-патерн:**
- `whileTap={{ scale: 0.95 }}` (НЕ `whileHover` — hover не існує на touch).
- Closed: стоїть на місці.
- Open animation:
    - Кришка: `animate={{ y: -120, rotate: -25, opacity: 0 }}`, 600ms.
    - База: `animate={{ scale: 0.9, opacity: 0.3 }}`.
    - Через 300ms відкривається модалка.
- Після закриття модалки коробка залишається в open-стані, `openedIds` оновлюється.
### 8.3. GiftContent.tsx — bottom sheet модалка

На мобільному — bottom sheet, на desktop — центрована картка:

```tsx
<motion.div
  className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center"
>
  <motion.div
    className="
      w-full max-h-[85vh] overflow-y-auto
      bg-bg rounded-t-3xl p-6 pb-safe-bottom
      md:max-w-lg md:rounded-3xl md:max-h-[80vh] md:m-4
    "
    initial={{ y: '100%', opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: '100%', opacity: 0 }}
    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
  >
    <button
      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-ink/10 flex items-center justify-center"
      onClick={onClose}
      aria-label="Закрити"
    >×</button>
    {/* Рендер за gift.type — див. 8.4 */}
  </motion.div>
</motion.div>
```

### 8.4. Рендер вмісту за типом

| type | UI |
|---|---|
| `memory` | `title` + `content` (прозою) + опц. фото `max-h-[50vh] w-full object-cover rounded-2xl` |
| `compliment` | центрований текст `text-xl md:text-2xl font-heading italic` |
| `promise` | іконка (SVG) + `content`, акцент `accent_color` |
| `photo` | фото + `caption` курсивом знизу |
| `voice` | кастомний плеєр: play/pause кнопка 56×56px, прогрес-бар, час (Howler.js або нативний `<audio preload="metadata">`) |
| `quote` | `content` через `font-heading italic text-center` |

### 8.5. Чекліст Сцени 2

- [ ] Сітка 2×N на мобільному, 3×N з md+.
- [ ] `whileTap` scale feedback, без hover-залежностей.
- [ ] Модалка відкривається bottom-sheet на мобільному, центрованою на desktop.
- [ ] Кнопка закриття ≥48×48px.
- [ ] Після відкриття всіх коробок — перехід до Final.
- [ ] На iPhone SE (375px) все читабельне.
---

## 9. FinalMessage.tsx

Коли `openedIds.size === gifts.length` — через 500мс (щоб модалка закрилась):
- Усі коробки fade-out зі stagger.
- З'являється `config.final_message` — `font-heading text-2xl md:text-4xl` центрований.
- Періодичні м'які сплески конфеті раз на 4-5 секунд (`particleCount: 60`).
---

## 10. Мобільна адаптація — наскрізні правила

- **dpr 1-2, не 3.** Canvas `dpr={[1, 2]}`.
- **touch-action: none** на Canvas — блокує pull-to-refresh і зум.
- **`h-[100dvh]`, не `h-screen`.**
- **Автозапуск аудіо заборонений в iOS Safari** — усі звуки тільки після першої user interaction (перший тап по свічці = unlock для звуків). Howler автоматично додає unlock listener.
- **Rubber-band scroll:** `overflow: hidden` на `html, body`.
- **Respect `prefers-reduced-motion`:** вже в `globals.css` + `disableForReducedMotion: true` у confetti.
- **Shadow maps `shadows={false}` на мобільному** — економія GPU.
- **Preload:** перші два фото через `next/image priority`, решта — дефолт (lazy).
- **Aудіо:** `preload="metadata"`, не повне завантаження.
---

## 11. Деплой

1. `git init && git add . && git commit -m "init"`.
2. Створити репо на GitHub, `git push`.
3. vercel.com → Import Project → вибрати репо → Deploy.
4. Settings → Domains → піддомен `{deploy_subdomain}.vercel.app`.
5. Наступні `git push` → автодеплой.
---

## 12. Non-goals

- Бекенд, БД, автентифікація.
- Аналітика, трекери, куки.
- GLTF-моделі — тільки примітиви Three.js.
- Сторонні UI-бібліотеки (shadcn, MUI) — тільки Tailwind.
- Тести.
- `<OrbitControls>`, `<Html>` від drei, InstancedMesh для свічок.
---

## 13. Фінальний чекліст (перед показом дівчині)

- [ ] Чекліст 7.13 — усі OK.
- [ ] Чекліст 8.5 — усі OK.
- [ ] Фінальне повідомлення з'являється після відкриття всіх коробок.
- [ ] Протестовано на реальному iPhone 14 Pro Max (або симуляторі в Safari DevTools).
- [ ] Lighthouse Performance ≥85, Accessibility ≥95.
- [ ] Деплой на Vercel, URL відкривається з будь-якого пристрою.
- [ ] Meta tags (`title`, `description`, og-image) виставлені.Якщо якийсь пункт "не виконано" — виправ і повтори звіт.