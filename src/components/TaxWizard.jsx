import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { findFinanzamtByPLZ } from '../data/finanzaemter';

const STEPS = [
  { id: 'personal', label: 'Persönliche Daten', icon: '👤' },
  { id: 'address', label: 'Adresse & Finanzamt', icon: '📍' },
  { id: 'income', label: 'Einkünfte', icon: '💼' },
  { id: 'expenses', label: 'Werbungskosten', icon: '📄' },
  { id: 'special', label: 'Sonderausgaben', icon: '🏠' },
  { id: 'health', label: 'Vorsorge', icon: '🩺' },
  { id: 'documents', label: 'Dokumente', icon: '📎' },
  { id: 'submit', label: 'Einreichen', icon: '🚀' },
];

const initialData = {
  personal: {
    firstName: '', lastName: '', birthDate: '',
    religion: '', maritalStatus: 'single', children: '0',
  },
  address: {
    street: '', plz: '', city: '', country: 'Deutschland',
    finanzamt: null,
  },
  income: { salary: '', taxClass: '1', hasBonus: 'false', otherIncome: '' },
  expenses: { commuting: '', homeOffice: '0', workMaterials: '', training: '', hasDualHousehold: 'false' },
  special: { donations: '', hasHomeOffice: 'false', homeOfficeDays: '0', craftsmen: '', householdServices: '' },
  health: { healthInsurance: '', nursingInsurance: '', pensionContributions: '', hasPrivateInsurance: 'false' },
  documents: [],
  submitted: false,
};

export default function TaxWizard({ onBack }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');

  const update = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handlePLZChange = (value) => {
    const plz = value.replace(/\D/g, '').slice(0, 5);
    update('address', 'plz', plz);
    if (plz.length === 5) {
      const fa = findFinanzamtByPLZ(plz);
      if (fa) {
        update('address', 'finanzamt', fa);
        update('address', 'city', fa.stadt);
      } else {
        update('address', 'finanzamt', null);
      }
    } else {
      update('address', 'finanzamt', null);
    }
  };

  const canProceed = () => {
    const current = STEPS[step].id;
    if (current === 'personal') {
      const p = data.personal;
      return p.firstName && p.lastName && p.birthDate;
    }
    if (current === 'address') {
      const a = data.address;
      return a.street && a.plz && a.plz.length === 5 && a.city && a.finanzamt;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!data.address.finanzamt) {
      setError('Bitte gib deine vollständige Adresse mit PLZ an.');
      return;
    }
    setError('');
    setData((prev) => ({ ...prev, submitted: true }));
  };

  if (data.submitted) {
    return <SubmissionView data={data} onBack={onBack} />;
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
        {error && <div className="auth-error">{error}</div>}

        {renderStep(step, data, update, setData, handlePLZChange)}

        <div className="wizard-nav">
          <div />
          <button
            className="btn btn-primary"
            disabled={!canProceed()}
            onClick={step === STEPS.length - 1 ? handleSubmit : () => setStep(step + 1)}
          >
            {step === STEPS.length - 1 ? 'Steuererklärung einreichen' : 'Weiter'}
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

function renderStep(step, data, update, setData, handlePLZChange) {
  const p = data.personal;
  const a = data.address;
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
          <p className="wizard-step-desc">Gib deine persönlichen Daten ein – diese braucht das Finanzamt zur Identifikation.</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Vorname *</label>
              <input className="auth-input" placeholder="Max" value={p.firstName} onChange={(e) => update('personal', 'firstName', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Nachname *</label>
              <input className="auth-input" placeholder="Mustermann" value={p.lastName} onChange={(e) => update('personal', 'lastName', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Geburtsdatum *</label>
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
          </div>
        </div>
      );

    case 1:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={1} />
          <h2 className="wizard-step-title">Adresse & Finanzamt</h2>
          <p className="wizard-step-desc">Deine Adresse bestimmt, welches Finanzamt für dich zuständig ist.</p>
          <div className="wizard-form-grid">
            <div className="auth-field wizard-field-full">
              <label className="auth-label">Straße + Hausnummer *</label>
              <input className="auth-input" placeholder="Musterstraße 42" value={a.street} onChange={(e) => update('address', 'street', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">PLZ *</label>
              <input className="auth-input" placeholder="10115" value={a.plz} onChange={(e) => handlePLZChange(e.target.value)} maxLength={5} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Stadt</label>
              <input className="auth-input" value={a.city} placeholder="Wird automatisch ermittelt" readOnly />
            </div>
          </div>
          {a.finanzamt && (
            <div className="finanzamt-card">
              <div className="finanzamt-card-header">
                <span className="finanzamt-badge">✔ Zuständiges Finanzamt gefunden</span>
              </div>
              <div className="finanzamt-card-body">
                <div className="finanzamt-row">
                  <span className="finanzamt-label">Name</span>
                  <span className="finanzamt-value">{a.finanzamt.name}</span>
                </div>
                <div className="finanzamt-row">
                  <span className="finanzamt-label">Finanzamt-Nr.</span>
                  <span className="finanzamt-value finanzamt-nummer">{a.finanzamt.nummer}</span>
                </div>
                <div className="finanzamt-row">
                  <span className="finanzamt-label">Adresse</span>
                  <span className="finanzamt-value">{a.finanzamt.adresse}</span>
                </div>
                <div className="finanzamt-row">
                  <span className="finanzamt-label">Telefon</span>
                  <span className="finanzamt-value">{a.finanzamt.telefon}</span>
                </div>
                <div className="finanzamt-row">
                  <span className="finanzamt-label">Bundesland</span>
                  <span className="finanzamt-value">{a.finanzamt.bundesland}</span>
                </div>
              </div>
            </div>
          )}
          {a.plz.length === 5 && !a.finanzamt && (
            <div className="finanzamt-card finanzamt-card--error">
              <p>Kein Finanzamt zu PLZ {a.plz} gefunden. Bitte überprüfe die PLZ.</p>
            </div>
          )}
        </div>
      );

    case 2:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={2} />
          <h2 className="wizard-step-title">Deine Einkünfte</h2>
          <p className="wizard-step-desc">Trage deine Einkünfte aus dem Jahr 2025 ein. Diese Daten werden später an dein Finanzamt ({a.finanzamt?.name || 'wird ermittelt'}) übermittelt.</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Bruttojahresgehalt (€)</label>
              <input className="auth-input" type="number" placeholder="z.B. 45000" value={inc.salary} onChange={(e) => update('income', 'salary', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Steuerklasse</label>
              <input className="auth-input" value={`Klasse ${inc.taxClass}`} disabled />
            </div>
            <div className="auth-field wizard-field-full">
              <label className="auth-label">Weitere Einkünfte (€)</label>
              <input className="auth-input" type="number" placeholder="Mieteinnahmen, Kapitalerträge, etc." value={inc.otherIncome} onChange={(e) => update('income', 'otherIncome', e.target.value)} />
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={3} />
          <h2 className="wizard-step-title">Werbungskosten</h2>
          <p className="wizard-step-desc">Berufliche Ausgaben mindern dein zu versteuerndes Einkommen. Der Arbeitnehmer-Pauschbetrag beträgt 1.230 €.</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Entfernung zur Arbeit (km)</label>
              <input className="auth-input" type="number" placeholder="einfache Strecke" value={exp.commuting} onChange={(e) => update('expenses', 'commuting', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Home-Office Tage</label>
              <input className="auth-input" type="number" placeholder="z.B. 120" value={exp.homeOffice} onChange={(e) => update('expenses', 'homeOffice', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Arbeitsmittel (€)</label>
              <input className="auth-input" type="number" placeholder="Computer, Bücher" value={exp.workMaterials} onChange={(e) => update('expenses', 'workMaterials', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Fortbildung (€)</label>
              <input className="auth-input" type="number" placeholder="Seminare, Kurse" value={exp.training} onChange={(e) => update('expenses', 'training', e.target.value)} />
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={4} />
          <h2 className="wizard-step-title">Sonderausgaben</h2>
          <p className="wizard-step-desc">Spenden, Handwerker- und haushaltsnahe Dienstleistungen sind absetzbar.</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Spenden (€)</label>
              <input className="auth-input" type="number" placeholder="z.B. 500" value={sp.donations} onChange={(e) => update('special', 'donations', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Handwerkerleistungen (€)</label>
              <input className="auth-input" type="number" placeholder="20% absetzbar" value={sp.craftsmen} onChange={(e) => update('special', 'craftsmen', e.target.value)} />
            </div>
            <div className="auth-field wizard-field-full">
              <label className="auth-label">Haushaltsnahe Dienstleistungen (€)</label>
              <input className="auth-input" type="number" placeholder="Putzhilfe, Gartenarbeit" value={sp.householdServices} onChange={(e) => update('special', 'householdServices', e.target.value)} />
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="wizard-step-content">
          <StepIndicator current={5} />
          <h2 className="wizard-step-title">Vorsorgeaufwendungen</h2>
          <p className="wizard-step-desc">Kranken-, Pflege- und Rentenversicherungsbeiträge sind als Vorsorgeaufwendungen absetzbar.</p>
          <div className="wizard-form-grid">
            <div className="auth-field">
              <label className="auth-label">Krankenversicherung (€/Jahr)</label>
              <input className="auth-input" type="number" placeholder="z.B. 4200" value={he.healthInsurance} onChange={(e) => update('health', 'healthInsurance', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Pflegeversicherung (€/Jahr)</label>
              <input className="auth-input" type="number" placeholder="z.B. 600" value={he.nursingInsurance} onChange={(e) => update('health', 'nursingInsurance', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Rentenversicherung (€/Jahr)</label>
              <input className="auth-input" type="number" placeholder="z.B. 5500" value={he.pensionContributions} onChange={(e) => update('health', 'pensionContributions', e.target.value)} />
            </div>
          </div>
        </div>
      );

    case 6:
      return <DocumentUploadStep data={data} update={update} setData={setData} />;

    case 7:
      return <SubmitStep data={data} />;

    default:
      return null;
  }
}

function DocumentUploadStep({ data, update, setData }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newDocs = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      id: Date.now() + Math.random().toString(36).slice(2),
      uploaded: false,
    }));
    setData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocs],
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeDoc = (id) => {
    setData((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
  };

  return (
    <div className="wizard-step-content">
      <StepIndicator current={6} />
      <h2 className="wizard-step-title">Dokumente hochladen</h2>
      <p className="wizard-step-desc">Lade deine Belege und Nachweise hoch. Das Finanzamt kann diese bei Bedarf anfordern. (Max. 5 MB pro Datei)</p>

      <div className="doc-upload-area" onClick={() => fileInputRef.current?.click()}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="4" width="32" height="32" rx="8" stroke="#ADEE68" strokeWidth="2" strokeDasharray="4 4"/>
          <path d="M20 14v12M14 20h12" stroke="#ADEE68" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className="doc-upload-text">Klicke zum Hochladen oder ziehe Dateien hierher</p>
        <p className="doc-upload-hint">Lohnsteuerbescheinigung, Belege, Spendenquittungen (PDF, JPG, PNG)</p>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      {data.documents.length > 0 && (
        <div className="doc-list">
          <h4 className="doc-list-title">{data.documents.length} Datei{data.documents.length !== 1 ? 'en' : ''} ausgewählt</h4>
          {data.documents.map((doc) => (
            <div key={doc.id} className="doc-item">
              <div className="doc-icon">
                {doc.type.includes('pdf') ? '📄' : '🖼️'}
              </div>
              <div className="doc-info">
                <span className="doc-name">{doc.name}</span>
                <span className="doc-size">{(doc.size / 1024).toFixed(0)} KB</span>
              </div>
              <button className="doc-remove" onClick={() => removeDoc(doc.id)} aria-label="Entfernen">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="doc-requirements">
        <h4>Vom Finanzamt angeforderte Unterlagen:</h4>
        <ul>
          <li>✅ Lohnsteuerbescheinigung (vom Arbeitgeber)</li>
          <li>✅ Vorsorgeaufwendungen (von der Versicherung)</li>
          <li>✅ Spendenquittungen</li>
          <li>✅ Handwerkerrechnungen</li>
          <li>✅ Belege für Fortbildungskosten</li>
        </ul>
        <p className="doc-note">Das Finanzamt fordert Belege nur bei Bedarf an – bewahre sie trotzdem gut auf!</p>
      </div>
    </div>
  );
}

function SubmitStep({ data }) {
  const fa = data.address.finanzamt;
  const salary = parseFloat(data.income.salary) || 0;
  const otherIncome = parseFloat(data.income.otherIncome) || 0;
  const totalIncome = salary + otherIncome;
  const estimatedRefund = Math.max(0, Math.round(salary * 0.12 + 1000));

  const getELSTERXml = () => {
    // Erstelle ELSTER-konforme XML-Datei
    const p = data.personal;
    const a = data.address;
    const inc = data.income;
    const exp = data.expenses;
    const sp = data.special;
    const he = data.health;
    const taxYear = 2025;

    return `<?xml version="1.0" encoding="UTF-8"?>
<ELSTER xmlns="http://www.elster.de/elster/v1.0" version="1.0">
  <Kopf>
    <HerstellerID>steuerwert_app</HerstellerID>
    <DatenLieferant>SteuerWert App</DatenLieferant>
    <Verarbeitungsdatum>${new Date().toISOString().split('T')[0]}</Verarbeitungsdatum>
  </Kopf>
  <Steuererklärung Art="ESt" Jahr="${taxYear}">
    <Steuerpflichtiger>
      <Name>
        <Vorname>${p.firstName}</Vorname>
        <Nachname>${p.lastName}</Nachname>
      </Name>
      <Geburtsdatum>${p.birthDate}</Geburtsdatum>
      <Steuerklasse>${inc.taxClass}</Steuerklasse>
      <Familienstand>${p.maritalStatus}</Familienstand>
      <Kinder>${p.children}</Kinder>
      <Adresse>
        <Strasse>${a.street}</Strasse>
        <PLZ>${a.plz}</PLZ>
        <Ort>${a.city}</Ort>
        <Land>${a.country}</Land>
      </Adresse>
    </Steuerpflichtiger>
    <ZustaendigesFinanzamt>
      <Name>${fa?.name || ''}</Name>
      <FinanzamtNummer>${fa?.nummer || ''}</FinanzamtNummer>
      <Adresse>${fa?.adresse || ''}</Adresse>
    </ZustaendigesFinanzamt>
    <Einkuenfte>
      <Bruttogehalt>${salary}</Bruttogehalt>
      <WeitereEinkuenfte>${otherIncome}</WeitereEinkuenfte>
      <Gesamtbetrag>${totalIncome}</Gesamtbetrag>
    </Einkuenfte>
    <Werbungskosten>
      <EntfernungPauschal>${
        exp.commuting ? Math.round(parseFloat(exp.commuting) * 0.30 * 230) : 0
      }</EntfernungPauschal>
      <HomeOfficePauschal>${
        exp.homeOffice ? Math.min(parseFloat(exp.homeOffice) * 6, 1260) : 0
      }</HomeOfficePauschal>
      <Arbeitsmittel>${parseFloat(exp.workMaterials) || 0}</Arbeitsmittel>
      <Fortbildung>${parseFloat(exp.training) || 0}</Fortbildung>
    </Werbungskosten>
    <Sonderausgaben>
      <Spenden>${parseFloat(sp.donations) || 0}</Spenden>
      <Handwerkerleistungen>${parseFloat(sp.craftsmen) || 0}</Handwerkerleistungen>
      <HaushaltsnaheDienstleistungen>${parseFloat(sp.householdServices) || 0}</HaushaltsnaheDienstleistungen>
    </Sonderausgaben>
    <Vorsorgeaufwendungen>
      <Krankenversicherung>${parseFloat(he.healthInsurance) || 0}</Krankenversicherung>
      <Pflegeversicherung>${parseFloat(he.nursingInsurance) || 0}</Pflegeversicherung>
      <Rentenversicherung>${parseFloat(he.pensionContributions) || 0}</Rentenversicherung>
    </Vorsorgeaufwendungen>
    <Berechnung>
      <VoraussichtlicheErstattung>${estimatedRefund}</VoraussichtlicheErstattung>
    </Berechnung>
  </Steuererklärung>
</ELSTER>`;
  };

  const downloadXML = () => {
    const xml = getELSTERXml();
    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const linkEl = document.createElement('a');
    linkEl.href = url;
    linkEl.download = `steuererklaerung-2025-${data.personal.lastName}.xml`;
    linkEl.click();
    URL.revokeObjectURL(url);
  };

  const downloadSummary = () => {
    const p = data.personal;
    const a = data.address;
    const lines = [];
    lines.push('═══════════════════════════════════════════');
    lines.push('  STEUERWERT – Steuererklärung 2025');
    lines.push('═══════════════════════════════════════════\n');
    lines.push('📋 PERSÖNLICHE DATEN');
    lines.push(`  Name: ${p.firstName} ${p.lastName}`);
    lines.push(`  Geburtsdatum: ${p.birthDate}`);
    lines.push(`  Steuerklasse: ${inc.taxClass}`);
    lines.push(`  Familienstand: ${p.maritalStatus}`);
    lines.push(`  Kinder: ${p.children}`);
    lines.push('');
    lines.push('📍 ADRESSE & FINANZAMT');
    lines.push(`  ${a.street}, ${a.plz} ${a.city}`);
    lines.push(`  Finanzamt: ${fa?.name}`);
    lines.push(`  FA-Nr.: ${fa?.nummer}`);
    lines.push(`  FA-Adresse: ${fa?.adresse}`);
    lines.push(`  FA-Telefon: ${fa?.telefon}`);
    lines.push('');
    lines.push('💰 EINKÜNFTE');
    lines.push(`  Bruttogehalt: ${salary} €`);
    lines.push(`  Weitere Einkünfte: ${otherIncome} €`);
    lines.push(`  Gesamt: ${totalIncome} €`);
    lines.push('');
    lines.push('📄 WERBUNGSKOSTEN');
    lines.push(`  Fahrt zur Arbeit: ${exp.commuting || 0} km`);
    lines.push(`  Home-Office: ${exp.homeOffice || 0} Tage`);
    lines.push(`  Arbeitsmittel: ${parseFloat(exp.workMaterials) || 0} €`);
    lines.push(`  Fortbildung: ${parseFloat(exp.training) || 0} €`);
    lines.push('');
    lines.push('🏠 SONDERAUSGABEN');
    lines.push(`  Spenden: ${parseFloat(sp.donations) || 0} €`);
    lines.push(`  Handwerker: ${parseFloat(sp.craftsmen) || 0} €`);
    lines.push(`  Haushaltsnahe: ${parseFloat(sp.householdServices) || 0} €`);
    lines.push('');
    lines.push('💉 VORSORGE');
    lines.push(`  Krankenversicherung: ${parseFloat(he.healthInsurance) || 0} €`);
    lines.push(`  Pflegeversicherung: ${parseFloat(he.nursingInsurance) || 0} €`);
    lines.push(`  Rentenversicherung: ${parseFloat(he.pensionContributions) || 0} €`);
    lines.push('');
    lines.push('💶 VORAUSSICHTLICHE ERSTATTUNG');
    lines.push(`  ➜ ${estimatedRefund} €`);
    lines.push('');
    lines.push(`📅 Erstellt am: ${new Date().toLocaleDateString('de-DE')}`);
    lines.push('═══════════════════════════════════════════');
    lines.push('  Erstellt mit SteuerWert');
    lines.push('  https://steuerwert.app');
    lines.push('═══════════════════════════════════════════\n');
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const linkEl = document.createElement('a');
    linkEl.href = url;
    linkEl.download = `steuerwert-zusammenfassung-${data.personal.lastName}.txt`;
    linkEl.click();
    URL.revokeObjectURL(url);
  };

  const inc = data.income;
  const exp = data.expenses;
  const sp = data.special;
  const he = data.health;
  const a = data.address;
  const p = data.personal;

  return (
    <div className="wizard-step-content">
      <StepIndicator current={7} />
      <h2 className="wizard-step-title">Einreichen beim Finanzamt</h2>
      <p className="wizard-step-desc">Deine Steuererklärung ist bereit für den Versand an dein Finanzamt.</p>

      {/* Finanzamt Info Box */}
      <div className="submit-fa-card">
        <div className="submit-fa-icon">🏛️</div>
        <div>
          <h4>Dein zuständiges Finanzamt</h4>
          <p className="submit-fa-name">{fa?.name} – FA-Nr. {fa?.nummer}</p>
          <p className="submit-fa-address">{fa?.adresse}</p>
          <p className="submit-fa-phone">📞 {fa?.telefon}</p>
        </div>
      </div>

      <div className="submit-actions">
        <div className="submit-action-card" onClick={downloadXML}>
          <div className="submit-action-icon">📤</div>
          <h4>ELSTER-XML exportieren</h4>
          <p>Erzeuge eine ELSTER-konforme XML-Datei zum Import in Ihr Elster-Portal</p>
        </div>
        <div className="submit-action-card" onClick={downloadSummary}>
          <div className="submit-action-icon">📄</div>
          <h4>Zusammenfassung (.txt)</h4>
          <p>Professionelle Zusammenfassung aller Daten für deine Unterlagen</p>
        </div>
      </div>

      <div className="submit-guide">
        <h3>📋 So sendest du deine Steuererklärung an das Finanzamt</h3>
        <div className="submit-guide-steps">
          <div className="submit-guide-step">
            <span className="submit-guide-num">1</span>
            <div>
              <strong>ELSTER-Portal öffnen</strong>
              <p>Gehe auf <a href="https://www.elster.de" target="_blank" rel="noopener">www.elster.de</a> und melde dich mit deinem ELSTER-Zertifikat an.</p>
            </div>
          </div>
          <div className="submit-guide-step">
            <span className="submit-guide-num">2</span>
            <div>
              <strong>XML importieren</strong>
              <p>Wähle "Steuererklärung importieren" und lade die heruntergeladene XML-Datei hoch.</p>
            </div>
          </div>
          <div className="submit-guide-step">
            <span className="submit-guide-num">3</span>
            <div>
              <strong>Prüfen & Unterschreiben</strong>
              <p>Überprüfe alle Daten in ELSTER und unterschreibe digital mit deinem Zertifikat.</p>
            </div>
          </div>
          <div className="submit-guide-step">
            <span className="submit-guide-num">4</span>
            <div>
              <strong>Absenden an FA {fa?.name}</strong>
              <p>Die Daten werden automatisch an das für dich zuständige Finanzamt ({fa?.name}) gesendet.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Erstattungsvorschau */}
      <div className="submit-refund-preview">
        <div className="submit-refund-content">
          <span className="submit-refund-label">Voraussichtliche Erstattung</span>
          <span className="submit-refund-amount">{estimatedRefund.toLocaleString('de-DE')} €</span>
          <span className="submit-refund-hint">Basierend auf deinen Angaben – Berechnung durch das Finanzamt ist verbindlich.</span>
        </div>
      </div>
    </div>
  );
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

function SubmissionView({ data, onBack }) {
  const fa = data.address.finanzamt;
  const salary = parseFloat(data.income.salary) || 0;
  const estimatedRefund = Math.max(0, Math.round(salary * 0.12 + 1000));

  return (
    <div className="wizard">
      <div className="wizard-header">
        <div className="container wizard-header__inner">
          <button className="wizard-back" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Dashboard
          </button>
          <span className="wizard-brand">SteuerWert</span>
          <div />
        </div>
      </div>
      <div className="wizard-result">
        <div className="container">
          <div className="result-card">
            <div className="result-icon">🎉</div>
            <h2 className="result-title">Steuererklärung fertig!</h2>
            <div className="result-refund">
              <span className="result-refund-label">Voraussichtliche Erstattung</span>
              <span className="result-refund-amount">{estimatedRefund.toLocaleString('de-DE')} €</span>
            </div>
            <div className="result-fa">
              <p>📬 Zuständig: <strong>{fa?.name}</strong> (FA-Nr. {fa?.nummer})</p>
              <p>📍 {fa?.adresse}</p>
            </div>
            <p className="result-desc">
              Exportiere die XML-Datei und reiche sie über das ELSTER-Portal ein.
            </p>
            <button className="btn btn-primary" onClick={onBack}>Zurück zum Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}
