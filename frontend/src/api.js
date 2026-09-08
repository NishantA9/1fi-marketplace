// In local dev, leave VITE_API_URL unset - Vite's dev proxy (see vite.config.js)
// forwards /api and /images to http://localhost:4000.
// In production (Vercel), set VITE_API_URL to your deployed Render backend URL,
// e.g. https://your-app.onrender.com
export const API_BASE = import.meta.env.VITE_API_URL || '';

// Resolves an image path coming from the API: absolute URLs (placeholders,
// CDNs) are used as-is; relative paths (local backend images) get the API
// base prepended so they work both locally and when deployed separately.
export function resolveImage(url) {
  if (!url) return url;
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}
