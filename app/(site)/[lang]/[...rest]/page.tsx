import { notFound } from "next/navigation";

/** Unbekannte Pfade → lokalisierte 404 aus ../not-found.tsx */
export default function CatchAll() {
  notFound();
}
