import { config } from '@/lib/config';
import { resolveGiftPhotos } from '@/lib/photos';
import HomeClient from './home-client';

export default function Page() {
  const gifts = resolveGiftPhotos(config.gifts);
  return <HomeClient gifts={gifts} />;
}
