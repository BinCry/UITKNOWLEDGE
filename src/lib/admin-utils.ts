export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const splitLines = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

export const joinLines = (items: string[]) => items.join("\n");

export const parseBoolean = (value: FormDataEntryValue | null) =>
  value === "on" || value === "true" || value === "1";

export const parseNumber = (value: FormDataEntryValue | null, fallback = 0) => {
  const parsed = Number(String(value ?? "").trim());
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const parseMaybeNumber = (value: FormDataEntryValue | null) => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

export const extractYoutubeId = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    return parsed.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
};

export const currencyLabel = (value: string | number | bigint | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  return new Intl.NumberFormat("vi-VN").format(Number(value));
};
