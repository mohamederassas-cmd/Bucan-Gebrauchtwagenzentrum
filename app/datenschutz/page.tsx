import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export const metadata = {
  title: "Datenschutzerklärung – BUCAN AUTOMOBILE München",
};

export default function DatenschutzPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Datenschutzerklärung</h1>
          <div className="section-divider mb-10" style={{ margin: "1.5rem 0" }} />

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">
                1. Datenschutz auf einen Blick
              </h2>
              <h3 className="text-slate-900 font-semibold mb-2">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
                passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
                persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">
                2. Verantwortliche Stelle
              </h2>
              <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-3">
                <p className="text-slate-900 font-semibold">Denis Bucan – BUCAN AUTOMOBILE</p>
                <p>Fichtenstrasse 40, 85649 Hofolding</p>
                <p>
                  Telefon:{" "}
                  <a href="tel:+491734414474" className="text-accent">0173 4414474</a>
                </p>
                <p>
                  E-Mail:{" "}
                  <a href="mailto:info@bucan-automobile.de" className="text-accent">
                    info@bucan-automobile.de
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">
                3. Datenerfassung auf dieser Website
              </h2>
              <h3 className="text-slate-900 font-semibold mb-2">Cookies</h3>
              <p>
                Unsere Internetseiten verwenden so genannte &bdquo;Cookies&ldquo;. Cookies sind kleine Datenpakete und richten
                auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung
                (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
              </p>
              <h3 className="text-slate-900 font-semibold mb-2 mt-4">Server-Log-Dateien</h3>
              <p>
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
                Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und
                Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners,
                Uhrzeit der Serveranfrage und IP-Adresse.
              </p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">
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
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">5. Google Maps</h2>
              <p>
                Diese Seite nutzt den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited, Gordon
                House, Barrow Street, Dublin 4, Irland. Zur Nutzung der Funktionen von Google Maps ist es notwendig,
                Ihre IP-Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in
                den USA übertragen und dort gespeichert.
              </p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">6. Ihre Rechte</h2>
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

            <p className="text-xs text-slate-400 mt-8">
              Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
