const getEnvInt = (key: string, fallback: number) => {
  const value = Number.parseInt(process.env[key] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const APP_NAME = "UIT Knowledge";
export const LOGIN_PATH = "/login";
export const FORGOT_PASSWORD_PATH = "/forgot-password";
export const RESET_PASSWORD_PATH = "/reset-password";
export const CHANGE_PASSWORD_PATH = "/change-password";
export const ADMIN_PATH_PREFIX = "/admin";
export const SITE_SETTINGS_ID = "site";

export const DEFAULT_ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME ?? "admin";
export const DEFAULT_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "dinh5609@gmail.com";
export const DEFAULT_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "admin";
export const COURSE_FORM_FALLBACK =
  "https://docs.google.com/forms/d/e/1FAIpQLSdY0Asoch6Q1A4IgaUdEEmELoSXwnapd7xh5H6gwlihOGE2Xg/viewform";
export const MERCH_FORM_FALLBACK =
  "https://docs.google.com/forms/d/e/1FAIpQLSf_bZqeadfGiGed5aDlwoAF2eGl-wy_K5WlCHybsDe1sV_q5g/viewform";

export const OTP_LENGTH = getEnvInt("OTP_LENGTH", 6);
export const OTP_EXPIRE_MINUTES = getEnvInt("OTP_EXPIRE_MINUTES", 5);
export const OTP_RATE_LIMIT_WINDOW_MINUTES = getEnvInt("OTP_RATE_LIMIT_WINDOW_MINUTES", 15);
export const OTP_RATE_LIMIT_MAX_REQUESTS = getEnvInt("OTP_RATE_LIMIT_MAX_REQUESTS", 5);
export const OTP_MAX_VERIFY_ATTEMPTS = getEnvInt("OTP_MAX_VERIFY_ATTEMPTS", 5);

export const LOCK_MAX_ATTEMPTS = getEnvInt("LOCK_MAX_ATTEMPTS", 5);
export const LOCK_WINDOW_MINUTES = getEnvInt("LOCK_WINDOW_MINUTES", 15);
export const LOCK_DURATION_MINUTES = getEnvInt("LOCK_DURATION_MINUTES", 15);

export const PASSWORD_MIN_LENGTH = 8;
