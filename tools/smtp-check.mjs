#!/usr/bin/env node
/**
 * Prueft die SMTP-Zugangsdaten des Postfachs, ohne eine Mail zu versenden und
 * ohne das Passwort irgendwo zu speichern. Aufruf:
 *
 *   node tools/smtp-check.mjs [benutzer] [host]
 *
 * Standard: info@bucan-automobile.de an smtp.strato.de:465. Das Passwort wird
 * ueber die versteckte Eingabe abgefragt, landet also nicht in der Shell-History.
 * Strato unterscheidet die Fehlerfaelle ueber MSG-Codes, die hier in Klartext
 * uebersetzt werden.
 */
import tls from "node:tls";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

const user = process.argv[2] || "info@bucan-automobile.de";
const host = process.argv[3] || "smtp.strato.de";
const port = 465;

/** Passwort ohne Echo einlesen. */
function askPassword(frage) {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY) {
      reject(new Error("Kein interaktives Terminal. Bitte direkt in der Shell ausfuehren."));
      return;
    }
    stdout.write(frage);
    const rl = createInterface({ input: stdin, output: stdout, terminal: true });
    // muteStream: readline schreibt nichts mehr nach stdout, waehrend getippt wird
    rl.output.write = () => {};
    rl.question("", (answer) => {
      rl.close();
      stdout.write("\n");
      resolve(answer);
    });
  });
}

const DEUTUNG = {
  MSG0036: "Dieses Postfach gibt es nicht. Adresse pruefen.",
  MSG0037: "Postfach existiert, aber das Passwort ist falsch.",
  MSG0043: "Es wurde gar kein Passwort uebergeben.",
  MSG0049: "Benutzername ungueltig, meist weil die Domain fehlt. Volle Adresse verwenden.",
};

function attempt(pass) {
  return new Promise((resolve) => {
    let step = 0;
    let last = "";
    const sock = tls.connect({ host, port, servername: host }, () => {});
    sock.setEncoding("utf8");
    sock.on("data", (chunk) => {
      last = chunk.trim();
      if (step === 0) {
        step = 1;
        sock.write("EHLO " + host + "\r\n");
        return;
      }
      if (step === 1) {
        step = 2;
        const cred = Buffer.from("\0" + user + "\0" + pass).toString("base64");
        sock.write("AUTH PLAIN " + cred + "\r\n");
        return;
      }
      sock.write("QUIT\r\n");
      sock.end();
      resolve(last);
    });
    sock.on("error", (e) => resolve("ERR " + e.message));
    setTimeout(() => {
      try {
        sock.destroy();
      } catch {}
      resolve("TIMEOUT: keine Antwort binnen 20 s");
    }, 20000);
  });
}

console.log("Pruefe " + user + " an " + host + ":" + port + "\n");

// SMTP_PASS aus der Umgebung erlaubt den Lauf in Skripten; sonst verdeckte Eingabe.
let pass = process.env.SMTP_PASS || "";
if (pass) {
  console.log("Passwort aus der Umgebungsvariable SMTP_PASS uebernommen.\n");
} else {
  try {
    pass = await askPassword("Postfach-Passwort: ");
  } catch (e) {
    console.error(e.message);
    console.error("Alternativ: SMTP_PASS=... node tools/smtp-check.mjs");
    process.exit(2);
  }
}
if (!pass) {
  console.error("Kein Passwort eingegeben, Abbruch.");
  process.exit(2);
}

const antwort = await attempt(pass);
const code = (antwort.match(/MSG\d+/) || [])[0];

if (/^235/.test(antwort)) {
  console.log("OK: Anmeldung erfolgreich. Diese Zugangsdaten funktionieren.");
  console.log("Naechster Schritt: als SMTP_PASS auf Vercel hinterlegen und neu deployen.");
  process.exit(0);
}

console.log("FEHLGESCHLAGEN: " + antwort);
if (code && DEUTUNG[code]) console.log("Bedeutung: " + DEUTUNG[code]);
process.exit(1);
