import fs from 'fs';
import path from 'path';
import { Gift } from './types';

export function resolveGiftPhotos(gifts: Gift[]): Gift[] {
  return gifts.map(gift => {
    if (gift.type !== 'photo' || !gift.photoFolder) return gift;
    const dir = path.join(process.cwd(), 'public', gift.photoFolder);
    try {
      const files = fs.readdirSync(dir)
        .filter(f => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
        .sort()
        .map(f => `/${gift.photoFolder}/${f}`);
      return { ...gift, images: files };
    } catch {
      return gift;
    }
  });
}
