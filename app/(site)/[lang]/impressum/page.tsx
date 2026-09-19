import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export const metadata = {
  title: "Impressum – BUCAN AUTOMOBILE München",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Impressum</h1>
          <div className="section-divider mb-10" style={{ margin: "1.5rem 0" }} />

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">
                Angaben gemäß § 5 TMG
              </h2>
              <p className="text-slate-900 font-semibold text-lg mb-1">Denis Bucan</p>
              <p>BUCAN AUTOMOBILE</p>
              <p>Fichtenstrasse 40</p>
              <p>85649 Hofolding</p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">Kontakt</h2>
              <p>
                Telefon:{" "}
                <a href="tel:+491783022999" className="text-accent hover:text-navy transition-colors">
                  0178 302 2999
                </a>
              </p>
              <p>
                E-Mail:{" "}
                <a href="mailto:info@bucan-automobile.de" className="text-accent hover:text-navy transition-colors">
                  info@bucan-automobile.de
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">Umsatzsteuer-ID</h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
                <br />
                <span className="text-slate-900 font-semibold">DE331172770</span>
              </p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>Denis Bucan</p>
              <p>Fichtenstrasse 40</p>
              <p>85649 Hofolding</p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="mt-3">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">Haftung für Inhalte</h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">Haftung für Links</h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
                haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte
                der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">Urheberrecht</h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
                außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
                bzw. Erstellers.
              </p>
            </section>

            <section>
              <h2 className="text-accent font-semibold tracking-widest text-xs uppercase mb-3">
                Hinweis zum Einsatz Künstlicher Intelligenz
              </h2>
              <p>
                Bei der Gestaltung und Erstellung dieser Website wurden KI-gestützte Werkzeuge eingesetzt. Dies
                betrifft die technische Umsetzung, das Layout sowie die sprachliche Ausarbeitung der allgemeinen
                Informations- und Servicetexte. Die technische Umsetzung erfolgte durch die HYBOTE AI Systems LLC.
              </p>
              <p className="mt-3">
                Ausdrücklich <span className="text-slate-900 font-semibold">nicht</span> mit Künstlicher Intelligenz
                erstellt sind:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  die Kundenbewertungen – dabei handelt es sich um echte, unveränderte Rückmeldungen von Käuferinnen
                  und Käufern über mobile.de
                </li>
                <li>
                  sämtliche Fahrzeugangaben und Fahrzeugbeschreibungen einschließlich Zustand, Laufleistung,
                  Ausstattung und Preisen – diese stammen ausschließlich von uns
                </li>
                <li>die Kontakt- und Unternehmensangaben</li>
                <li>die rechtlichen Hinweise auf dieser Seite sowie in der Datenschutzerklärung</li>
              </ul>
              <p className="mt-3">
                Alle veröffentlichten Inhalte wurden vor der Veröffentlichung von uns geprüft, inhaltlich freigegeben
                und werden laufend gepflegt. Die redaktionelle Verantwortung für sämtliche Inhalte liegt bei Denis
                Bucan.
              </p>
              <p className="mt-3">
                Auf dieser Website findet keine Interaktion mit einem KI-System statt. Es ist weder ein Chatbot noch
                ein KI-Assistent eingebunden. Ihre Eingaben und Besucherdaten werden nicht an KI-Dienste übermittelt
                oder von diesen ausgewertet. Eine automatisierte Entscheidungsfindung im Sinne von Art. 22 DSGVO
                findet nicht statt.
              </p>
              <p className="mt-3">
                Dieser Hinweis erfolgt freiwillig im Sinne größtmöglicher Transparenz gegenüber unseren Kundinnen und
                Kunden. Eine Kennzeichnungspflicht nach Art. 50 der Verordnung (EU) 2024/1689 (KI-Verordnung) besteht
                für die hier veröffentlichten Inhalte nicht.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
