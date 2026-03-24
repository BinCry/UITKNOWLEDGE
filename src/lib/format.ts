import type { Prisma } from "@prisma/client";

export const formatCurrency = (value: Prisma.Decimal | number | string | null | undefined) => {
  if (value === null || value === undefined) return "";

  const numericValue = typeof value === "object" && "toNumber" in value ? value.toNumber() : Number(value);
  if (!Number.isFinite(numericValue)) return "";

  return `${new Intl.NumberFormat("vi-VN").format(numericValue)}đ`;
};

export const splitStatLabel = (value: string, fallbackLabel: string) => {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\S+)\s+(.*)$/);

  if (!match) {
    return {
      label: fallbackLabel,
      value: trimmed,
      note: "",
    };
  }

  return {
    label: fallbackLabel,
    value: match[1],
    note: match[2],
  };
};

export const splitTextList = (value?: string | null) =>
  (value ?? "")
    .split(/\r?\n|•|;/)
    .map((item) => item.trim())
    .filter(Boolean);
