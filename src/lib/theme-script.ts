/** localStorage key for the visitor's light/dark choice. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before the page paints, so a visitor who chose a theme never
 * sees a flash of the other one. Kept tiny and dependency-free. (A separate
 * file from lib/theme.ts so the server-rendered layout can import it.)
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
