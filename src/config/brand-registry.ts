// Maps merchant.slug from API to brand folder name
export const brandRegistry: Record<string, string> = {
  // Mitchell & Ness - MJ Jersey
  'mitchell-ness': 'mitchell-ness',

  // Lexie Johnson Art - Tom Brady painting
  'lexie-johnson-art': 'lexie-johnson-art',

  // Authentic (uses slug "main") - Venus Williams racket
  'main': 'authentic',

  // Robert Glasper - Black Radio collab tee
  'robertglasper': 'robert-glasper',
}

// Resolve merchant slug to brand folder
export function resolveBrand(merchantSlug: string): string {
  return brandRegistry[merchantSlug] || '_default'
}
