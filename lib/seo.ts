import { SITE } from "./site";
import type { Vehicle } from "./types";
import { localePath, type Locale } from "./i18n/config";

/**
 * Strukturierte Daten (schema.org) für Google. Bewusst ohne aggregateRating:
 * Selbst ausgewiesene Bewertungen auf LocalBusiness ignoriert Google, und die
 * Bewertungen stammen von mobile.de, nicht von der eigenen Seite.
 */

const DEALER_ID = `${SITE.url}/#dealer`;

export function autoDealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": DEALER_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    telephone: SITE.phoneE164,
    email: SITE.email,
    image: `${SITE.url}/bucan-logo.jpg`,
    logo: `${SITE.url}/bucan-logo-header.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.zip,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    openingHoursSpecification: SITE.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: "München",
    priceRange: "€€",
    currenciesAccepted: "EUR",
    sameAs: [SITE.social.facebook, SITE.social.instagram],
    founder: { "@type": "Person", name: SITE.owner },
  };
}

const AVAILABILITY: Record<Vehicle["status"], string> = {
  available: "https://schema.org/InStock",
  reserved: "https://schema.org/LimitedAvailability",
  sold: "https://schema.org/SoldOut",
};

export function vehicleJsonLd(vehicle: Vehicle, locale: Locale) {
  const url = `${SITE.url}${localePath(locale, `/fahrzeuge/${vehicle.id}`)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: vehicle.mileage, unitCode: "KMT" },
    fuelType: vehicle.fuel_type,
    vehicleTransmission: vehicle.transmission,
    ...(vehicle.color ? { color: vehicle.color } : {}),
    ...(vehicle.images.length > 0 ? { image: vehicle.images } : {}),
    ...(vehicle.description ? { description: vehicle.description } : {}),
    url,
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url,
      price: vehicle.price,
      priceCurrency: "EUR",
      itemCondition: "https://schema.org/UsedCondition",
      availability: AVAILABILITY[vehicle.status],
      seller: { "@id": DEALER_ID },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}
