/**
 * Platform Icons Component
 *
 * Inline SVG icons for platform selection (PC, Xbox, PlayStation)
 * Icons rendered dynamically based on platform ID
 */

export const PlatformIcons = {
  origin: {
    name: 'PC',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 18c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v12zM4 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4zm2.5 8.5h11v2h-11v-2z"/>
    </svg>`
  },
  xbl: {
    name: 'Xbox',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c3.026 0 5.789-1.119 7.902-2.967 1.877-2.637-3.684-9.607-7.902-11.157-4.218 1.55-9.779 8.52-7.898 11.157zm7.637-14.416c-1.714-.783-5.953-2.578-7.506-2.578C1.878 4.039 0 6.502 0 10.379c0 2.012.478 3.879 1.316 5.475 1.879-3.258 6.488-7.89 10.423-9.237zm7.618 0c3.938 1.347 8.546 5.979 10.425 9.237C23.622 14.258 24 12.391 24 10.379c0-3.877-1.878-6.34-4.235-6.34-1.553 0-5.792 1.795-7.506 2.578z"/>
    </svg>`
  },
  psn: {
    name: 'PlayStation',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.423 9.524s2.125-1.093 4.75-1.093c2.627 0 5.494.885 5.494.885s-.406-2.353-2.066-3.318c-1.662-.964-4.42-.964-5.373-.33-.953.634-2.753 2.472-2.805 3.856zM8.71 16.12c.524 1.362 1.766 3.836 2.51 4.665 1.562 1.737 4.552 2.353 6.868.904 2.316-1.448 1.56-4.892 1.56-4.892s-1.925 1.373-4.482 1.373-4.937-.617-6.456-2.05zm-3.498-1.28c-.057 1.68.157 2.532.157 2.532s-1.14-1.846-1.35-4.42c.078-2.094.96-4.27 2.244-5.805 1.286-1.536 3.227-2.57 3.227-2.57S7.468 5.65 5.613 7.21c-1.855 1.56-3.44 4.957-2.464 8.488.127.395.063-.082.063-.858z"/>
    </svg>`
  }
}

/**
 * Get platform icon SVG by platform ID
 * @param {string} platformId - Platform ID (origin, xbl, psn)
 * @returns {string|null} SVG string or null if not found
 */
export function getPlatformIcon(platformId) {
  return PlatformIcons[platformId]?.svg || null
}

/**
 * Get platform name by platform ID
 * @param {string} platformId - Platform ID (origin, xbl, psn)
 * @returns {string|null} Platform name or null if not found
 */
export function getPlatformName(platformId) {
  return PlatformIcons[platformId]?.name || null
}
