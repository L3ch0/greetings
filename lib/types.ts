export type GiftType = 'memory' | 'compliment' | 'promise' | 'photo' | 'voice' | 'quote';

export interface Gift {
  type: GiftType;
  title: string;
  content?: string;
  image?: string;
  images?: string[];
  photoFolder?: string;
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
