import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const STEPS = [
  { id: 'personal', label: 'Persönliche Daten', icon: '👤' },
  { id: 'income', label: 'Einkünfte', icon: '💼' },
  { id: 'expenses', label: 'Werbungskosten', icon: '📄' },
  { id: 'special', label: 'Sonderausgaben', icon: '🏠' },
  { id: 'health', label: 'Vorsorge', icon: '🩺' },
  { id: 'summary', label: 'Zusammenfassung', icon: '✅' },
];

const initialData = {
  personal: { firstName: '', lastName: '', birthDate: '', religion: '', maritalStatus: 'single', children: '0' },
  income: { salary: '', taxClass: '1', hasBonus: 'false', otherIncome: '' },
  expenses: { commuting: '', homeOffice: '0', workMaterials: '', training: '', hasDualHousehold: 'false' },
  special: { donations: '', hasHomeOffice: 'false', homeOfficeDays: '0', craftsmen: '', householdServices: '' },
  health: { healthInsurance: '', nursingInsurance: '', pensionContributions: '', hasPrivateInsurance: 'false' },
};

export default function TaxWizard({ onBack }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);

  const update = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const canProceed = () => {
    const current = STEPS[step].id;
    if (current === 'personal') {
      const p = data.personal;
      return p.firstName && p.lastName && p.birthDate;
    }
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    const salary = parseFloat(data.income.salary) || 0;
    const estimatedRefund = Math.max(0, Math.round(salary * 0.12 + 1000));
    return (
      <div className="wizard">
        <div className="wizard-header">
          <div className="container wizard-header__inner">
            <button className="wizard-back" onClick={onBack}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Zurück
            </button>
            <span className="wizard-brand">SteuerWert</span>
            <div />
          </div>
        </div>
        <div className="wizard-result">
          <div className="container">
            <div className="result-card">
              <div className="result-icon">🎉</div>
              <h2 className="result-title">Deine Steuererklärung ist fertig!</h2>
              <div className="result-refund">
                <span className="result-refund-label">Voraussichtliche Erstattung</span>
                <span className="result-refund-amount">{estimatedRefund.toLocaleString('de-DE')} €</span>
              </div>
              <p className="result-desc">
                Deine Daten wurden gespeichert. Du kannst sie jederzeit bearbeiten oder ergänzen.
              </p>
              <p className="result-note">
                In Kürze kannst du deine Steuererklärung direkt per ELSTER an das Finanzamt senden.
              </p>
              <button className="btn btn-primary" onClick={onBack}>
                Zurück zum Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard">
      <div className="wizard-header">
        <div className="container wizard-header__inner">
          <button className="wizard-back" onClick={step === 0 ? onBack : () => setStep(step - 1)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {step === 0 ? 'Dashboard' : 'Zurück'}
          </button>
          <span className="wizard-brand">SteuerWert</span>
          <div className="wizard-step-indicator">{step + 1} / {STEPS.length}</div>
        </div>
      </div>

      <div className="wizard-progress-bar">
        <div className="wizard-progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div className="container wizard-content">
        {renderStep(step, data, update, setData)}

        <div className="wizard-nav">
          <div />
          <button
            className={`btn ${step === STEPS.length - 1 ? 'btn-primary' : 'btn-primary'}`}
            disabled={!canProceed()}
            onClick={step === STEPS.length - 1 ? handleSubmit : () => setStep(step + 1)}
          >
            {step === STEPS.length - 1 ? 'Steuererklärung abschließen' : 'Weiter'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current }) {
  return (
    <div className="wizard-steps">
      {STEPS.map((s, i) => (
        <div key={s.id} className={`wizard-step-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}>
          <span className="wizard-step-icon">{i < current ? '✓' : s.icon}</span>
          <span className="wizard-step-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function renderStep(step, data, update, setData) {
  const p = data.personal;
  const inc = data.income;
  const exp = data.expenses;
  const sp = data.special;
  const he = data.health;

  switch (step) {
    case 0:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={0} />
          <h2 className="wizard-step-title">Persönliche Daten</h2>
          <p className="wizard-step-desc">Gib deine persönlichen Daten ein, damit wir deine Steuererklärung erstellen können.</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Vorname</label>
              <input className="auth-input" placeholder="Max" value={p.firstName} onChange={(e) => update('personal', 'firstName', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Nachname</label>
              <input className="auth-input" placeholder="Mustermann" value={p.lastName} onChange={(e) => update('personal', 'lastName', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Geburtsdatum</label>
              <input className="auth-input" type="date" value={p.birthDate} onChange={(e) => update('personal', 'birthDate', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Steuerklasse</label>
              <select className="auth-input" value={inc.taxClass} onChange={(e) => update('income', 'taxClass', e.target.value)}>
                <option value="1">I – ledig / getrennt</option>
                <option value="2">II – Alleinerziehend</option>
                <option value="3">III – verheiratet (besser)</option>
                <option value="4">IV – verheiratet (Standard)</option>
                <option value="5">V – verheiratet (schlechter)</option>
                <option value="6">VI – Zweitjob</option>
              </select>
            </div>
            <div className="auth-field">
              <label className="auth-label">Familienstand</label>
              <select className="auth-input" value={p.maritalStatus} onChange={(e) => update('personal', 'maritalStatus', e.target.value)}>
                <option value="single">Ledig</option>
                <option value="married">Verheiratet</option>
                <option value="divorced">Geschieden</option>
                <option value="widowed">Verwitwet</option>
              </select>
            </div>
            <div className="auth-field">
              <label className="auth-label">Kinderfreibeträge</label>
              <select className="auth-input" value={p.children} onChange={(e) => update('personal', 'children', e.target.value)}>
                {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n} Kind{n !== 1 ? 'er' : ''}</option>)}
              </select>
            </div>
            <div className="auth-field">
              <label className="auth-label">Religionszugehörigkeit</label>
              <select className="auth-input" value={p.religion} onChange={(e) => update('personal', 'religion', e.target.value)}>
                <option value="">Keine Angabe</option>
                <option value="rk">Römisch-katholisch</option>
                <option value="ev">Evangelisch</option>
                <option value="other">Sonstige</option>
                <option value="none">Keine</option>
              </select>
            </div>
          </div>
        </div>
      );

    case 1:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={1} />
          <h2 className="wizard-step-title">Deine Einkünfte</h2>
          <p className="wizard-step-desc">Trage deine Einkünfte aus dem Jahr 2025 ein.</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Bruttojahresgehalt (€)</label>
              <input className="auth-input" type="number" placeholder="z.B. 45000" value={inc.salary} onChange={(e) => update('income', 'salary', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Steuerklasse (wie oben)</label>
              <input className="auth-input" value={`Klasse ${inc.taxClass}`} disabled />
            </div>
            <div className="auth-field">
              <label className="auth-label">Weitere Einkünfte (€)</label>
              <input className="auth-input" type="number" placeholder="z.B. Mieteinnahmen" value={inc.otherIncome} onChange={(e) => update('income', 'otherIncome', e.target.value)} />
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={2} />
          <h2 className="wizard-step-title">Werbungskosten</h2>
          <p className="wizard-step-desc">Welche beruflichen Ausgaben hattest du? (Pauschbetrag: 1.230 €)</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Entfernung zur Arbeit (km einfach)</label>
              <input className="auth-input" type="number" placeholder="z.B. 20" value={exp.commuting} onChange={(e) => update('expenses', 'commuting', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Home-Office Tage</label>
              <input className="auth-input" type="number" placeholder="z.B. 120" value={exp.homeOffice} onChange={(e) => update('expenses', 'homeOffice', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Arbeitsmittel (€)</label>
              <input className="auth-input" type="number" placeholder="Computer, Bücher, etc." value={exp.workMaterials} onChange={(e) => update('expenses', 'workMaterials', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Fortbildungskosten (€)</label>
              <input className="auth-input" type="number" placeholder="Seminare, Kurse" value={exp.training} onChange={(e) => update('expenses', 'training', e.target.value)} />
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={3} />
          <h2 className="wizard-step-title">Sonderausgaben</h2>
          <p className="wizard-step-desc">Hier kannst du Spenden, Handwerker- und Haushaltskosten angeben.</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Spenden (€)</label>
              <input className="auth-input" type="number" placeholder="z.B. 500" value={sp.donations} onChange={(e) => update('special', 'donations', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Handwerkerleistungen (€)</label>
              <input className="auth-input" type="number" placeholder="Reinigung, Renovierung" value={sp.craftsmen} onChange={(e) => update('special', 'craftsmen', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Haushaltsnahe Dienstleistungen (€)</label>
              <input className="auth-input" type="number" placeholder="Putzhilfe, Garten" value={sp.householdServices} onChange={(e) => update('special', 'householdServices', e.target.value)} />
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={4} />
          <h2 className="wizard-step-title">Vorsorgeaufwendungen</h2>
          <p className="wizard-step-desc">Angaben zu Kranken- und Pflegeversicherung.</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Krankenversicherungsbeitrag (€/Jahr)</label>
              <input className="auth-input" type="number" placeholder="z.B. 4200" value={he.healthInsurance} onChange={(e) => update('health', 'healthInsurance', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Pflegeversicherungsbeitrag (€/Jahr)</label>
              <input className="auth-input" type="number" placeholder="z.B. 600" value={he.nursingInsurance} onChange={(e) => update('health', 'nursingInsurance', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Rentenversicherungsbeitrag (€/Jahr)</label>
              <input className="auth-input" type="number" placeholder="z.B. 5500" value={he.pensionContributions} onChange={(e) => update('health', 'pensionContributions', e.target.value)} />
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={5} />
          <h2 className="wizard-step-title">Zusammenfassung</h2>
          <p className="wizard-step-desc">Überprüfe deine Angaben. Du kannst später alles bearbeiten.</p>
          <div className="wizard-summary">
            <SummarySection title="Persönliche Daten">
              <SummaryRow label="Name" value={`${p.firstName} ${p.lastName}`} />
              <SummaryRow label="Steuerklasse" value={inc.taxClass} />
              <SummaryRow label="Familienstand" value={p.maritalStatus === 'single' ? 'Ledig' : p.maritalStatus === 'married' ? 'Verheiratet' : p.maritalStatus} />
              <SummaryRow label="Kinder" value={p.children} />
            </SummarySection>
            <SummarySection title="Einkünfte">
              <SummaryRow label="Bruttogehalt" value={inc.salary ? `${inc.salary} €` : '–'} />
              <SummaryRow label="Weitere Einkünfte" value={inc.otherIncome ? `${inc.otherIncome} €` : '–'} />
            </SummarySection>
            <SummarySection title="Werbungskosten">
              <SummaryRow label="Fahrt zur Arbeit" value={exp.commuting ? `${exp.commuting} km` : '–'} />
              <SummaryRow label="Home-Office" value={exp.homeOffice ? `${exp.homeOffice} Tage` : '–'} />
              <SummaryRow label="Arbeitsmittel" value={exp.workMaterials ? `${exp.workMaterials} €` : '–'} />
            </SummarySection>
            <SummarySection title="Sonderausgaben & Vorsorge">
              <SummaryRow label="Spenden" value={sp.donations ? `${sp.donations} €` : '–'} />
              <SummaryRow label="KV-Beitrag" value={he.healthInsurance ? `${he.healthInsurance} €` : '–'} />
            </SummarySection>
          </div>
        </div>
      );

    default:
      return null;
  }
}

function SummarySection({ title, children }) {
  return (
    <div className="summary-section">
      <h4 className="summary-section-title">{title}</h4>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span className="summary-label">{label}</span>
      <span className="summary-value">{value}</span>
    </div>
  );
}
