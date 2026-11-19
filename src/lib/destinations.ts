export type Destination = {
  _id: string;
  title?: string;
  category?: string;
  location?: string;
  imageUrl?: string;
  images?: string[];
  hourlyRate?: number | string;
  securityDeposit?: number | string;
  maxCapacity?: number | string;
  rating?: number | string;
  reviews?: number | string;
  overview?: string;
  amenities?: string[];
  hostName?: string;
  hostEmail?: string;
};

export const DESTINATIONS_API = `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/studios`;

export const FALLBACK_IMAGES = [
  "/banner.jpg",
  "/banner1.jpg",
  "/hero-studio.jpg",
  "/studiopic.jpg",
];

/**
 * Reject values that can never render as a card image: empty strings, bare
 * origins such as "https://studiospaceatl.com/" (the homepage, not a photo)
 * and links that point at HTML/CSS/JS documents.
 */
export function isUsableImageSrc(value?: string | null): boolean {
  const url = typeof value === "string" ? value.trim() : "";

  if (!url) return false;
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:")) {
    return true;
  }

  if (!/^https?:\/\//i.test(url)) return false;
  if (/\.(html?|php|aspx?|jsp|css|js)([?#].*)?$/i.test(url)) return false;

  try {
    const parsed = new URL(url);
    return parsed.pathname !== "/" || parsed.search.length > 0;
  } catch {
    return false;
  }
}

/**
 * Ordered image candidates for a card: the stored `imageUrl` first, then any
 * extra gallery images, then the local fallbacks starting at this card's
 * index so neighbouring cards never share the same placeholder.
 */
export function imageCandidates(
  destination: Pick<Destination, "imageUrl" | "images">,
  index: number
): string[] {
  const candidates: string[] = [];

  const push = (value?: string) => {
    const url = value?.trim();
    if (!url || !isUsableImageSrc(url)) return;

    if (!candidates.includes(url)) candidates.push(url);
  };

  push(destination.imageUrl);

  if (Array.isArray(destination.images)) {
    destination.images.forEach((image) => push(image));
  }

  const pool = FALLBACK_IMAGES;
  const start = ((index % pool.length) + pool.length) % pool.length;

  for (let offset = 0; offset < pool.length; offset += 1) {
    push(pool[(start + offset) % pool.length]);
  }

  return candidates;
}

/** Resolve the image that should render for a card, with a local fallback. */
export function cardImage(
  destination: Pick<Destination, "imageUrl" | "images">,
  index: number
): string {
  return imageCandidates(destination, index)[0] ?? FALLBACK_IMAGES[0] ?? "";
}

export async function fetchDestinations(featured = false): Promise<Destination[]> {
  // A hung backend must not pin pages in their loading state forever:
  // callers get the rejection and fall back to their error/empty states.
  const response = await fetch(`${DESTINATIONS_API}${featured ? "?featured=true" : ""}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch destinations (${response.status})`);
  }

  const data: unknown = await response.json();

  return Array.isArray(data) ? (data as Destination[]) : [];
}

/**
 * Shown when the backend on port 5000 is unreachable or returns no listings,
 * so the homepage's Featured section always renders. Real data from
 * fetchDestinations() takes precedence automatically once it is available.
 */
export const DEMO_DESTINATIONS: Destination[] = [
  {
    _id: "demo-aura-light-cyc",
    title: "Aura Light Cyc Studio",
    category: "Photo Studio",
    location: "Downtown Brooklyn, NY",
    imageUrl: "/banner1.jpg",
    hourlyRate: 120,
    rating: 4.9,
  },
  {
    _id: "demo-echo-chamber",
    title: "Echo Chamber Recording Suite",
    category: "Music Suite",
    location: "Silver Lake, Los Angeles, CA",
    imageUrl: "/cities/los-angeles.jpg",
    hourlyRate: 95,
    rating: 4.8,
  },
  {
    _id: "demo-podlounge-pro",
    title: "PodLounge Pro Studio",
    category: "Podcast Lounge",
    location: "SoHo, Manhattan, NY",
    imageUrl: "/banner.jpg",
    hourlyRate: 75,
    rating: 5,
  },
  {
    _id: "demo-cinematic-sound-stage",
    title: "Cinematic Sound Stage Alpha",
    category: "Film Stage",
    location: "Culver City, CA",
    imageUrl: "/hero-studio.jpg",
    hourlyRate: 250,
    rating: 4.9,
  },
  {
    _id: "demo-bohemian-workshop",
    title: "Bohemian Art Workshop",
    category: "Workshop",
    location: "Williamsburg, Brooklyn, NY",
    imageUrl: "/cities/new-york.jpg",
    hourlyRate: 65,
    rating: 4.7,
  },
  {
    _id: "demo-neon-vibe",
    title: "Neon Vibe Music Lab",
    category: "Music Suite",
    location: "East Austin, TX",
    imageUrl: "/cities/nashville.jpg",
    hourlyRate: 110,
    rating: 4.9,
  },
];
