// Random image rotation utility for Phoenix Automation

export interface ImagePool {
  url: string;
  alt: string;
}

// Pool of hero background images (construction, automation, handyman themes)
export const heroImages: ImagePool[] = [
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1920&auto=format&fit=crop',
    alt: 'Modern construction site with advanced equipment',
  },
  {
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920&auto=format&fit=crop',
    alt: 'Professional construction team working together',
  },
  {
    url: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=1920&auto=format&fit=crop',
    alt: 'Smart home automation control panel',
  },
  {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1920&auto=format&fit=crop',
    alt: 'Professional handyman with tools',
  },
  {
    url: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?q=80&w=1920&auto=format&fit=crop',
    alt: 'Modern home renovation project',
  },
];

// Pool of about/team images
export const aboutImages: ImagePool[] = [
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1740&auto=format&fit=crop',
    alt: 'Phoenix Automation team on construction site',
  },
  {
    url: 'https://images.unsplash.com/photo-1529499563346-a2a44fbc7e2a?q=80&w=1740&auto=format&fit=crop',
    alt: 'Professional handyman working on home automation',
  },
  {
    url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1740&auto=format&fit=crop',
    alt: 'Skilled technician installing smart home devices',
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1740&auto=format&fit=crop',
    alt: 'Professional construction team collaborating',
  },
  {
    url: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=1740&auto=format&fit=crop',
    alt: 'Modern home automation installation',
  },
  {
    url: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?q=80&w=1740&auto=format&fit=crop',
    alt: 'Premium home renovation project',
  },
];

/**
 * Get a random image from a pool, changing with each new session
 * Uses sessionStorage to maintain consistency during the same visit
 */
export function getRandomImage(pool: ImagePool[], storageKey: string): ImagePool {
  // Check if we already selected an image for this session
  const storedIndex = sessionStorage.getItem(storageKey);

  if (storedIndex !== null) {
    const index = parseInt(storedIndex, 10);
    if (index >= 0 && index < pool.length) {
      return pool[index];
    }
  }

  // Select a random image
  const randomIndex = Math.floor(Math.random() * pool.length);

  // Store the selection for this session
  sessionStorage.setItem(storageKey, randomIndex.toString());

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
