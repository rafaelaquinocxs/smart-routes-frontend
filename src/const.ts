export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// JWT Cookie name
export const JWT_COOKIE_NAME = "smartoures-jwt";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Smartoures";

export const APP_LOGO = import.meta.env.VITE_APP_LOGO || "https://placehold.co/128x128/10b981/ffffff?text=Smartoures";

// JWT authentication - redirect to local login page
export const getLoginUrl = () => {
  return "/login";
};
