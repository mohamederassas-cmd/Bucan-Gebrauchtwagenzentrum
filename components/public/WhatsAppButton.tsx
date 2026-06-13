"use client";

import { Phone } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-center">
      <a
        href="tel:+491783022999"
        aria-label="Jetzt anrufen"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        style={{ background: "#1e3a5f" }}
      >
        <Phone size={24} color="white" />
      </a>
      <a
        href="https://wa.me/491783022999?text=Hallo%20BB%20Gebrauchtwagen%2C%20ich%20interessiere%20mich%20f%C3%BCr%20einen%20Ihrer%20Fahrzeuge."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Kontakt"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        style={{ background: "#25D366" }}
      >
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.736 5.467 2.027 7.76L0 32l8.484-2.004A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 0 1-6.771-1.853l-.485-.29-5.035 1.189 1.213-4.899-.317-.503A13.24 13.24 0 0 1 2.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.27-9.928c-.398-.199-2.356-1.162-2.72-1.295-.365-.133-.631-.199-.897.2-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.299-.863.1-.398-.2-1.681-.62-3.201-1.977-1.183-1.056-1.981-2.36-2.213-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.698.2-.232.266-.398.4-.664.132-.265.066-.498-.034-.697-.1-.2-.896-2.16-1.228-2.958-.323-.777-.651-.672-.897-.684l-.764-.013c-.266 0-.697.1-1.062.498-.365.399-1.394 1.362-1.394 3.322 0 1.96 1.427 3.854 1.626 4.12.2.265 2.808 4.287 6.803 6.015.951.41 1.693.655 2.271.839.954.303 1.823.26 2.51.158.766-.114 2.356-.963 2.688-1.893.332-.93.332-1.727.232-1.893-.1-.166-.365-.265-.763-.464z"/>
        </svg>
      </a>
    </div>
  );
}
