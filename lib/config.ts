import type { Config } from './types';

export const config: Config = {
  recipient_name: 'Крістіна',
  recipient_nickname: 'Сонечко',
  age: 25,
  birthday_date: '20.04.2001',

  aesthetic: 'pastel-romance',
  primary_color: '#FFB5C5',
  accent_color: '#FFD700',
  background_color: '#FFF5F7',
  text_color: '#2D1B2E',
  font_heading: 'Playfair Display',
  font_body: 'Inter',

  candles_count: 7,
  cake_tiers: 2,

  gifts: [
    {
      type: 'memory',
      title: 'Наша перша зустріч',
      content: 'Пам\'ятаєш, як ми вперше зустрілися? Той день змінив все. Твоя усмішка й очі зачарували з першого погляду. А наші поцілунки, які зупиняли твій спів перед СІЗО - це був один з найкращих днів у моєму житті.',
    },
    {
      type: 'compliment',
      title: 'Що я в тобі люблю',
      content: 'Ти — найдобріша, найрозумніша й найкрасивіша людина, яку я знаю. Твоя усмішка освітлює найтемніші дні, а твоя підтримка дає сили йти далі.',
    },
    {
      type: 'promise',
      title: 'Моя обіцянка',
      content: 'Обіцяю завжди бути поруч, підтримувати тебе у всьому й робити кожен твій день особливим. Разом ми здолаємо будь-які перешкоди!',
    },
    {
      type: 'photo',
      title: 'Наш найкращий момент',
      photoFolder: 'images',
      caption: 'Цa дні залишиться в моєму серці назавжди',
    },
    {
      type: 'voice',
      title: 'Голосове привітання',
      audio: '/audio/message.mp3',
    },
    {
      type: 'quote',
      title: 'Для тебе',
      content: 'Ти — мій світ, моя радість, моє все.\nЗ Днем народження, кохана!\nХай кожен твій день буде наповнений щастям.',
    },
  ],

  final_message: 'З Днем народження, Сонечко! Ти робиш цей світ кращим просто тим, що ти є. Люблю тебе безмежно! 💕',
  deploy_subdomain: 'for-kristina',
};
