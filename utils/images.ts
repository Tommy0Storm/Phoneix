// Random image rotation utility for Phoenix Projects

export interface ImagePool {
  url: string;
  alt: string;
}

// Pool of hero background images (home construction and renovation focus)
export const heroImages: ImagePool[] = [
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1920&auto=format&fit=crop',
    alt: 'Modern home construction with scaffolding',
  },
  {
    url: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?q=80&w=1920&auto=format&fit=crop',
    alt: 'Beautiful home renovation and remodeling',
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920&auto=format&fit=crop',
    alt: 'Home construction worker with tools and blueprints',
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1920&auto=format&fit=crop',
    alt: 'Professional home builders working on house frame',
  },
  {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1920&auto=format&fit=crop',
    alt: 'Skilled craftsman working on home improvement',
  },
  {
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920&auto=format&fit=crop',
    alt: 'Home construction team collaborating on project',
  },
  {
    url: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=1920&auto=format&fit=crop',
    alt: 'Modern smart home technology installation',
  },
  {
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1920&auto=format&fit=crop',
    alt: 'Home renovation and interior construction work',
  },
];

// Pool of about/team images (home construction focus)
export const aboutImages: ImagePool[] = [
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1740&auto=format&fit=crop',
    alt: 'Phoenix Projects team on home construction site',
  },
  {
    url: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?q=80&w=1740&auto=format&fit=crop',
    alt: 'Premium home renovation and remodeling work',
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1740&auto=format&fit=crop',
    alt: 'Professional home construction craftsman at work',
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1740&auto=format&fit=crop',
    alt: 'Home building team working together',
  },
  {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1740&auto=format&fit=crop',
    alt: 'Skilled home improvement specialist',
  },
  {
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1740&auto=format&fit=crop',
    alt: 'Interior home construction and renovation',
  },
];

/**
 * Get a random image from a pool, changing with each visit
 */
export function getRandomImage(pool: ImagePool[], storageKey: string): ImagePool {
  // Select a random image on every call
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Get a random hero background image
 */
export function getRandomHeroImage(): ImagePool {
  return getRandomImage(heroImages, 'phoenix_hero_image');
}

/**
 * Get a random about section image
 */
export function getRandomAboutImage(): ImagePool {
  return getRandomImage(aboutImages, 'phoenix_about_image');
}

/**
 * Force refresh images (clears session storage)
 */
export function refreshImages(): void {
  sessionStorage.removeItem('phoenix_hero_image');
  sessionStorage.removeItem('phoenix_about_image');
}

/**
 * Get a different random image on each page load
 */
export function getRotatingImage(pool: ImagePool[]): ImagePool {
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
