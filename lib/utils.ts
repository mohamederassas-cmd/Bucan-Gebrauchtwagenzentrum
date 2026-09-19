import { intlLocale, type Locale } from "./i18n/config";

export function formatPrice(price: number, locale: Locale = "de"): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(value: number, locale: Locale = "de"): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(value);
}

export function formatMileage(km: number, locale: Locale = "de"): string {
  return `${formatNumber(km, locale)} km`;
}

export function formatDate(iso: string, locale: Locale = "de"): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
