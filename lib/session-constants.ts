/**
 * Konstanten für die Admin-Sitzung. Bewusst ohne Node-Importe, damit die Datei
 * sowohl in der Edge-Middleware als auch im Node-Code verwendet werden kann.
 */
export const SESSION_COOKIE = "bucan_admin_session";
/** Das Token ist ein HMAC-SHA256 als 64 Hex-Zeichen. */
export const SESSION_TOKEN_PATTERN = /^[a-f0-9]{64}$/;
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 Tage
