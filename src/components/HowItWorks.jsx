const steps = [
  {
    number: '01',
    icon: '📸',
    title: 'Beleg fotografieren',
    desc: 'Foto von deiner Lohnsteuerbescheinigung machen – wir lesen die Daten automatisch aus.',
  },
  {
    number: '02',
    icon: '💬',
    title: 'Fragen beantworten',
    desc: 'Ein paar einfache Ja/Nein-Fragen in Alltagssprache. Kein Behördendeutsch, kein Stress.',
  },
  {
    number: '03',
    icon: '💰',
    title: 'Erstattung erhalten',
    desc: 'Dein Ergebnis siehst du sofort. Mit einem Klick geht\'s sicher ans Finanzamt.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works section">
      <div className="container">
        <h2 className="section-title">So einfach geht Steuern</h2>
        <p className="section-subtitle">
          Drei Schritte zu deiner Steuererklärung – ganz ohne Vorkenntnisse.
        </p>
        <div className="how-it-works__grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-card__number">{step.number}</div>
              <div className="step-card__icon">{step.icon}</div>
              <h3 className="step-card__title">{step.title}</h3>
              <p className="step-card__desc">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="how-it-works__cta">
          <a href="#pricing" className="btn btn-primary">Jetzt kostenlos starten</a>
        </div>
      </div>
    </section>
  );
}
