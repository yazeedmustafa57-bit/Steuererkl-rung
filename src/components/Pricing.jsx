const plans = [
  {
    name: 'Self-Service',
    price: '39,99 €',
    badge: null,
    description: 'Kostenlos bis zur Berechnung. Zahle erst bei Abgabe.',
    features: [
      'Geführter Prozess mit einfachen Fragen',
      'Automatische Vorausfüllung',
      'ELSTER-Schnittstelle',
      'App & Web',
      'Vorab-Berechnung der Erstattung',
    ],
    cta: 'Selber machen',
    variant: 'outline',
  },
  {
    name: 'Experten-Service',
    price: '99,99 €',
    badge: 'Empfohlen',
    description: '20 % deiner Erstattung (mind. 99,99 €)',
    features: [
      'Unabhängige Steuerberater:in',
      'Persönliche Aufgabenliste',
      'Dokumentenupload',
      'Digitale Abgabe',
      'Bearbeitung in ~4 Wochen',
    ],
    cta: 'Machen lassen',
    variant: 'primary',
  },
];

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#ADEE68"/>
      <path d="M5 9.5L7.5 12L13 7" stroke="#0C0B0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="pricing section">
      <div className="container">
        <h2 className="section-title">Der passende Plan für dich</h2>
        <p className="section-subtitle">
          Ob allein oder mit Expert:in – du zahlst erst bei Abgabe.
        </p>
        <div className="pricing__grid">
          {plans.map((plan) => (
            <div key={plan.name} className={`pricing-card ${plan.badge ? 'pricing-card--featured' : ''}`}>
              {plan.badge && <span className="pricing-card__badge">{plan.badge}</span>}
              <h3 className="pricing-card__name">{plan.name}</h3>
              <div className="pricing-card__price">
                <span className="pricing-card__amount">ab {plan.price}</span>
              </div>
              <p className="pricing-card__desc">{plan.description}</p>
              <ul className="pricing-card__features">
                {plan.features.map((f) => (
                  <li key={f} className="pricing-card__feature">
                    <CheckIcon />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`btn ${plan.variant === 'primary' ? 'btn-primary' : 'btn-outline'} pricing-card__cta`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="pricing__footer">
          Alle Pläne sind <strong>kostenlos bis zur Berechnung</strong> deiner Erstattung. Keine versteckten Kosten.
        </p>
      </div>
    </section>
  );
}
