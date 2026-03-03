import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy - SaaS Consulenti",
  description: "Informativa sui cookie utilizzati dal sito.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
            &larr; Torna alla home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-6">Cookie Policy</h1>
          <p className="text-white/70 mt-2">Ultimo aggiornamento: Febbraio 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 prose prose-gray max-w-none">

          <h2>1. Cosa Sono i Cookie</h2>
          <p>
            I cookie sono piccoli file di testo memorizzati sul tuo dispositivo quando visiti
            un sito web. Servono a migliorare l&apos;esperienza di navigazione e raccogliere
            informazioni statistiche anonime.
          </p>

          <h2>2. Cookie Tecnici (Necessari)</h2>
          <p>Essenziali per il funzionamento del sito:</p>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Durata</th>
                <th>Scopo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>__next_*</code></td>
                <td>Sessione</td>
                <td>Funzionamento Next.js</td>
              </tr>
              <tr>
                <td><code>cookie_consent</code></td>
                <td>1 anno</td>
                <td>Preferenze cookie</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Cookie Analitici</h2>
          <p>
            Utilizziamo cookie analitici per comprendere come i visitatori interagiscono
            con le landing page dei consulenti. I dati raccolti sono anonimi e aggregati.
          </p>

          <h2>4. Come Gestire i Cookie</h2>
          <p>Puoi gestire le tue preferenze sui cookie attraverso le impostazioni del tuo browser:</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>

          <h2>5. Link Utili</h2>
          <ul>
            <li><a href="https://www.garanteprivacy.it/cookie" target="_blank" rel="noopener noreferrer">Garante Privacy - Cookie</a></li>
            <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
          </ul>

          <hr />
          <h2>Sviluppo e Gestione Tecnica del Sito</h2>
          <p>Questo sito web è stato realizzato e viene gestito da:</p>
          <p>
            <strong>FODI S.r.l. – Startup Innovativa</strong><br />
            Via Santicelli 18/A, 88068 Soverato (CZ)<br />
            P.IVA: 03856160793<br />
            Email: <a href="mailto:info@fodisrl.it">info@fodisrl.it</a><br />
            Tel: +39 0963 576433<br />
            Web: <a href="https://www.fodisrl.it" target="_blank" rel="noopener noreferrer">www.fodisrl.it</a>
          </p>
        </div>
      </div>
    </div>
  );
}
