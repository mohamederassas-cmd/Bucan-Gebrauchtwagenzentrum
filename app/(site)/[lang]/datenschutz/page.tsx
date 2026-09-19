import PageHeader from "@/components/public/PageHeader";

export const metadata = {
  title: "Datenschutzerklärung – BUCAN AUTOMOBILE München",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <main className="relative z-10 min-h-screen">
      <PageHeader eyebrow="Rechtliches" title="Datenschutzerklärung" />

      <div className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="space-y-10 text-ivory-50/75 leading-relaxed">
            <section>
              <h2 className="eyebrow eyebrow-left mb-4">
                1. Datenschutz auf einen Blick
              </h2>
              <h3 className="text-ivory-50 font-semibold mb-2">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
                passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
                persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="eyebrow eyebrow-left mb-4">
                2. Verantwortliche Stelle
              </h2>
              <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
              <div className="surface p-4 mt-3">
                <p className="text-ivory-50 font-semibold">Denis Bucan – BUCAN AUTOMOBILE</p>
                <p>Fichtenstrasse 40, 85649 Hofolding</p>
                <p>
                  Telefon:{" "}
                  <a href="tel:+491783022999" className="link-gold">0178 302 2999</a>
                </p>
                <p>
                  E-Mail:{" "}
                  <a href="mailto:info@bucan-automobile.de" className="link-gold">
                    info@bucan-automobile.de
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="eyebrow eyebrow-left mb-4">
                3. Datenerfassung auf dieser Website
              </h2>
              <h3 className="text-ivory-50 font-semibold mb-2">Cookies</h3>
              <p>
                Unsere Internetseiten verwenden so genannte &bdquo;Cookies&ldquo;. Cookies sind kleine Datenpakete und richten
                auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung
                (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
              </p>
              <h3 className="text-ivory-50 font-semibold mb-2 mt-4">Server-Log-Dateien</h3>
              <p>
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
                Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und
                Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners,
                Uhrzeit der Serveranfrage und IP-Adresse.
              </p>
            </section>

            <section>
              <h2 className="eyebrow eyebrow-left mb-4">
                4. Kontaktformular &amp; Anfragen
              </h2>
              <p>
                Wenn Sie uns per Kontaktformular, Telefon oder E-Mail Anfragen zukommen lassen, werden Ihre Angaben
                aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
                Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne
                Ihre Einwilligung weiter.
              </p>
              <p className="mt-3">
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung oder vorvertragliche Maßnahmen).
              </p>
              <h3 className="text-ivory-50 font-semibold mb-2 mt-5">Kontaktformular und Ankauf-Anfrage</h3>
              <p>
                Über das Kontaktformular und das Formular &bdquo;Fahrzeug anbieten&ldquo; erheben wir die von Ihnen
                eingegebenen Angaben (Name, E-Mail-Adresse, Telefonnummer, Nachricht sowie beim Ankauf die
                Fahrzeugdaten und freiwillig hochgeladene Fotos). Die Angabe von Fotos ist freiwillig; sie helfen uns
                lediglich, Ihr Fahrzeug besser einzuschätzen.
              </p>
              <p className="mt-3">
                Die Anfragen werden auf Servern unseres Hosting-Dienstleisters Vercel Inc., 440 N Barranca Ave #4133,
                Covina, CA 91723, USA (Vercel Blob Storage) gespeichert und uns zusätzlich per E-Mail zugestellt. Für
                den E-Mail-Versand nutzen wir den Dienst Resend (Resend, Inc., 2261 Market Street #5039, San
                Francisco, CA 94114, USA). Mit beiden Anbietern bestehen Verträge zur Auftragsverarbeitung; die
                Übermittlung in die USA ist durch die EU-Standardvertragsklauseln bzw. das EU-US Data Privacy Framework
                abgesichert.
              </p>
              <p className="mt-3">
                Zum Schutz vor automatisierten Spam-Einsendungen setzen wir ein technisches Formular-Token und ein
                verstecktes Feld ein; ein Tracking findet dabei nicht statt. Ihre Anfrage bleibt gespeichert, bis sie
                erledigt ist, längstens jedoch zwölf Monate; danach werden die Daten einschließlich der Fotos gelöscht,
                sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
              </p>
            </section>

            <section>
              <h2 className="eyebrow eyebrow-left mb-4">5. Google Maps</h2>
              <p>
                Diese Seite nutzt den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited, Gordon
                House, Barrow Street, Dublin 4, Irland. Zur Nutzung der Funktionen von Google Maps ist es notwendig,
                Ihre IP-Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in
                den USA übertragen und dort gespeichert.
              </p>
              <p className="mt-3">
                Die Karte wird deshalb <span className="text-ivory-50 font-semibold">nicht automatisch geladen</span>.
                Stattdessen sehen Sie zunächst einen Platzhalter mit unserer Anschrift. Erst wenn Sie ausdrücklich auf
                &bdquo;Karte laden&ldquo; klicken oder der Kategorie &bdquo;Externe Karten&ldquo; in den
                Cookie-Einstellungen zustimmen, wird eine Verbindung zu Google hergestellt und eine Datenübertragung
                ausgelöst.
              </p>
              <p className="mt-3">
                Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit § 25 Abs. 1
                TDDDG. Sie können diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie die
                gespeicherten Einstellungen in Ihrem Browser löschen.
              </p>
            </section>

            <section>
              <h2 className="eyebrow eyebrow-left mb-4">6. Ihre Rechte</h2>
              <p>Sie haben jederzeit das Recht:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Auskunft über Ihre gespeicherten personenbezogenen Daten zu erhalten</li>
                <li>Unrichtige Daten berichtigen zu lassen</li>
                <li>Die Löschung Ihrer Daten zu verlangen</li>
                <li>Die Verarbeitung Ihrer Daten einzuschränken</li>
                <li>Der Datenverarbeitung zu widersprechen</li>
                <li>Ihre Daten in einem gängigen Format zu erhalten (Datenportabilität)</li>
              </ul>
              <p className="mt-3">
                Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
                Außerdem steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
              </p>
            </section>

            <p className="text-xs text-ivory-50/50 mt-8">
              Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
