/**
 * srcset for a work screenshot. `N.webp` (1400w) has an `N-800.webp` sibling,
 * from scripts/resize-work-images.mjs, so a phone isn't decoding 1400px to fill
 * 350. Anything outside /media/work/ has no sibling and gets nothing.
 */
export function responsiveWork(src: string, sizes: string) {
  const match = /^(\/media\/work\/.+)\.webp$/.exec(src);
  if (!match) return {};
  return { srcSet: `${match[1]}-800.webp 800w, ${src} 1400w`, sizes };
}
