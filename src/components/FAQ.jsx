import { useState } from 'react';

const faqs = [
  {
    q: 'Wie lange dauert die Erstellung der Steuererklärung?',
    a: 'Erstellst du deine Steuererklärung selbst, bist du durchschnittlich in unter einer halben Stunde fertig. Beim Experten-Service beträgt die Bearbeitungszeit durchschnittlich etwa 4 Wochen.',
  },
  {
    q: 'Wann bekomme ich meine Lohnsteuerbescheinigung?',
    a: 'In der Regel erhältst du deine Lohnsteuerbescheinigung bis Februar des Folgejahres automatisch von deinem Arbeitgeber. Hast du deine Tätigkeit beendet, stellt er sie dir zum Vertragsende aus.',
  },
  {
    q: 'Was mache ich mit Belegen und Nachweisen?',
    a: 'Generell müssen Belege ab der Steuererklärung 2017 nur noch eingereicht werden, wenn das Finanzamt dich dazu schriftlich auffordert. Bewahre die Dokumente aber gut auf, falls Nachweise gefordert werden.',
  },
  {
    q: 'Wie lange muss ich auf den Steuerbescheid warten?',
    a: 'Die Erfahrung zeigt, dass du etwa 6–12 Wochen warten musst, bis du deinen Steuerbescheid erhältst. Hast du nach vier Monaten noch keine Rückmeldung, kannst du dich beim Finanzamt erkundigen.',
  },
  {
    q: 'Ist meine Steuererklärung sicher?',
    a: 'Ja! Deine Daten werden dank modernster Verschlüsselung und sicherer ELSTER-API-Schnittstelle direkt ans Finanzamt übermittelt. Wir speichern nur das Nötigste und halten uns an die DSGVO.',
  },
];

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button className="faq-item__question" onClick={onClick}>
        <span>{faq.q}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`faq-item__chevron ${isOpen ? 'faq-item__chevron--open' : ''}`}
        >
          <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={`faq-item__answer ${isOpen ? 'faq-item__answer--open' : ''}`}>
        <p>{faq.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="faq section">
      <div className="container">
        <h2 className="section-title">Häufig gestellte Fragen</h2>
        <p className="section-subtitle">
          Alles, was du vor dem Start wissen solltest.
        </p>
        <div className="faq__list">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
