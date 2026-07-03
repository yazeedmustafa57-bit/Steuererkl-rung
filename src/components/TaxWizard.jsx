import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { findFinanzamtByPLZ } from '../data/finanzaemter';

// ─── Validation helpers ───
function validateName(val) {
  if (!val || !val.trim()) return 'Bitte gib einen Namen ein.';
  if (val.trim().length < 2) return 'Der Name muss mindestens 2 Zeichen lang sein.';
  if (!/^[\p{L}\p{M}\-'\s]+$/u.test(val.trim())) return 'Der Name darf nur Buchstaben enthalten.';
  return null;
}

function validateBirthDate(val) {
  if (!val) return 'Bitte gib dein Geburtsdatum ein.';
  const d = new Date(val);
  if (isNaN(d.getTime())) return 'Bitte gib ein gültiges Datum ein (TT.MM.JJJJ).';
  const today = new Date();
  if (d > today) return 'Das Datum darf nicht in der Zukunft liegen.';
  const age = today.getFullYear() - d.getFullYear();
  if (age < 16) return 'Du musst mindestens 16 Jahre alt sein.';
  if (age > 120) return 'Bitte prüfe dein Geburtsdatum.';
  return null;
}

function validateNumber(val, { min = 0, max = null, label = 'Wert' } = {}) {
  if (!val || !val.trim()) return `Bitte gib einen ${label} ein.`;
  const num = parseFloat(val.replace(/\./g, '').replace(',', '.'));
  if (isNaN(num)) return `Bitte gib eine gültige Zahl ein.`;
  if (num < min) return `Der ${label} darf nicht negativ sein.`;
  if (max !== null && num > max) return `Der ${label} darf maximal ${max.toLocaleString('de-DE')} betragen.`;
  return null;
}

function validatePLZ(val) {
  if (!val || !val.trim()) return 'Bitte gib deine Postleitzahl ein.';
  const clean = val.trim().replace(/\s/g, '');
  if (!/^\d{5}$/.test(clean)) return 'Die PLZ muss aus genau 5 Ziffern bestehen.';
  return null;
}

function validateStreet(val) {
  if (!val || !val.trim()) return 'Bitte gib deine Straße ein.';
  if (val.trim().length < 3) return 'Bitte gib eine vollständige Adresse ein.';
  return null;
}

function validateChildren(val) {
  if (!val || val.trim() === '') return null; // 0 ist ok
  const num = parseInt(val, 10);
  if (isNaN(num)) return 'Bitte gib eine Zahl ein.';
  if (num < 0) return 'Die Anzahl darf nicht negativ sein.';
  if (num > 50) return 'Bitte prüfe die Anzahl.';
  return null;
}

// ─── Validation per question ID ───
function validateQuestion(q, value) {
  if (!value || !value.toString().trim()) {
    if (q.type === 'num' || q.type === 'text' || q.type === 'date' || q.type === 'plz') {
      return 'Bitte fülle dieses Feld aus.';
    }
    return null;
  }
  const val = value.toString().trim();
  switch (q.id) {
    case 'firstName':
    case 'lastName':
      return validateName(val);
    case 'birthDate':
      return validateBirthDate(val);
    case 'children':
      return validateChildren(val);
    case 'street':
      return validateStreet(val);
    case 'plz':
      return validatePLZ(val);
    case 'salary':
      return validateNumber(val, { min: 0, max: 10_000_000, label: 'Jahresbruttogehalt' });
    case 'otherIncome':
    case 'otherAmount':
      return validateNumber(val, { min: 0, max: 10_000_000, label: 'Betrag' });
    case 'commuting':
      return validateNumber(val, { min: 0, max: 500, label: 'km' });
    case 'homeOffice':
      return validateNumber(val, { min: 0, max: 365, label: 'Tage' });
    case 'donations':
      return validateNumber(val, { min: 0, max: 100_000_000, label: 'Spendenbetrag' });
    case 'craftsmen':
      return validateNumber(val, { min: 0, max: 100_000, label: 'Handwerkerkosten' });
    case 'healthInsurance':
    case 'healthIns':
      return validateNumber(val, { min: 0, max: 50_000, label: 'Krankenversicherungsbeitrag' });
    case 'nursingInsurance':
    case 'nursingIns':
      return validateNumber(val, { min: 0, max: 20_000, label: 'Pflegeversicherungsbeitrag' });
    default:
      return null;
  }
}

const QUESTIONS = [
  { id: 'welcome', type: 'welcome' },
  { id: 'firstName', type: 'text', q: 'Wie heißt du?', field: ['personal','firstName'], ph: 'Vorname', icon: '👋' },
  { id: 'lastName', type: 'text', q: 'Und dein Nachname?', field: ['personal','lastName'], ph: 'Nachname', icon: '✍️' },
  { id: 'birthDate', type: 'date', q: 'Wann bist du geboren?', field: ['personal','birthDate'], icon: '🎂' },
  { id: 'maritalStatus', type: 'choice', q: 'Wie ist dein Familienstand?', field: ['personal','maritalStatus'], icon: '💍',
    opts:[{v:'single',l:'Ledig'},{v:'married',l:'Verheiratet'},{v:'divorced',l:'Geschieden'},{v:'widowed',l:'Verwitwet'}] },
  { id: 'children', type: 'num', q: 'Hast du Kinder?', field: ['personal','children'], ph: 'Anzahl (0 wenn keine)', icon: '👶' },
  { id: 'taxClass', type: 'choice', q: 'Welche Steuerklasse hast du?', field: ['income','taxClass'], icon: '📊',
    opts:[{v:'1',l:'I'},{v:'2',l:'II'},{v:'3',l:'III'},{v:'4',l:'IV'},{v:'5',l:'V'}] },
  { id: 'street', type: 'text', q: 'Deine Straße?', field: ['address','street'], ph: 'z.B. Musterstraße 42', icon: '🏠' },
  { id: 'plz', type: 'plz', q: 'Deine Postleitzahl?', field: ['address','plz'], ph: 'z.B. 10115', icon: '📍' },
  { id: 'hasIncome', type: 'yesno', q: 'Hattest du 2025 einen Job?', field: ['income','hasIncome'], icon: '💼' },
  { id: 'salary', type: 'num', q: 'Wie viel hast du brutto verdient?', field: ['income','salary'], ph: 'z.B. 45000', icon: '💰', if:{field:['income','hasIncome'],is:'yes'} },
  { id: 'hasOther', type: 'yesno', q: 'Hattest du andere Einkünfte?', field: ['income','hasOther'], icon: '📈' },
  { id: 'otherAmount', type: 'num', q: 'Wie viel andere Einkünfte?', field: ['income','otherIncome'], ph: '€ pro Jahr', icon: '💵', if:{field:['income','hasOther'],is:'yes'} },
  { id: 'hasExpenses', type: 'yesno', q: 'Hattest du berufliche Ausgaben?', field: ['expenses','hasExpenses'], icon: '📄' },
  { id: 'commuting', type: 'num', q: 'Wie viele km zur Arbeit?', field: ['expenses','commuting'], ph: 'einfache Strecke in km', icon: '🚗', if:{field:['expenses','hasExpenses'],is:'yes'} },
  { id: 'homeOffice', type: 'num', q: 'Home-Office Tage?', field: ['expenses','homeOffice'], ph: 'Tage pro Jahr', icon: '🏡', if:{field:['expenses','hasExpenses'],is:'yes'} },
  { id: 'hasSpecial', type: 'yesno', q: 'Hast du gespendet oder Handwerker bezahlt?', field: ['special','hasSpecial'], icon: '🎯' },
  { id: 'donations', type: 'num', q: 'Höhe der Spenden?', field: ['special','donations'], ph: '€ pro Jahr', icon: '❤️', if:{field:['special','hasSpecial'],is:'yes'} },
  { id: 'craftsmen', type: 'num', q: 'Handwerkerkosten?', field: ['special','craftsmen'], ph: '€ pro Jahr', icon: '🔧', if:{field:['special','hasSpecial'],is:'yes'} },
  { id: 'healthIns', type: 'num', q: 'Krankenversicherung?', field: ['health','healthInsurance'], ph: '€ pro Jahr', icon: '🏥' },
  { id: 'nursingIns', type: 'num', q: 'Pflegeversicherung?', field: ['health','nursingInsurance'], ph: '€ pro Jahr', icon: '🩺' },
  { id: 'faCheck', type: 'facheck' },
  { id: 'summary', type: 'summary' },
];

export default function TaxWizard({ onBack }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    personal:{firstName:'',lastName:'',birthDate:'',maritalStatus:'single',children:'0'},
    address:{street:'',plz:'',city:'',finanzamt:null},
    income:{taxClass:'1',salary:'',otherIncome:'',hasIncome:null,hasOther:null},
    expenses:{commuting:'',homeOffice:'',workMaterials:'',training:'',hasExpenses:null},
    special:{donations:'',craftsmen:'',householdServices:'',hasSpecial:null},
    health:{healthInsurance:'',nursingInsurance:'',pensionContributions:''},
    documents:[],
  });
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState('right');
  const [validationError, setValidationError] = useState(null);
  const inputRef = useRef(null);

  const visibleSteps = QUESTIONS.filter((q, i) => {
    if (!q.if) return true;
    const [s, f] = q.if.field;
    return data[s]?.[f] === q.if.is;
  });

  const totalQuestions = visibleSteps.length;
  const currentQ = QUESTIONS[step];

  const isVisible = useCallback((q) => {
    if (!q.if) return true;
    const [s, f] = q.if.field;
    return data[s]?.[f] === q.if.is;
  }, [data]);

  const goNext = useCallback((answer, skipValidation = false) => {
    const q = QUESTIONS[step];

    // Validate before proceeding
    if (!skipValidation && (q.type === 'text' || q.type === 'num' || q.type === 'date' || q.type === 'plz')) {
      const val = answer !== undefined ? answer : input;
      const err = validateQuestion(q, val);
      if (err) {
        setValidationError(err);
        return;
      }
    }
    setValidationError(null);

    if (q.id !== 'welcome') {
      setDirection('right');
    }
    if (q.field) {
      const [s, f] = q.field;
      setData(prev => {
        const d = { ...prev };
        d[s] = { ...d[s], [f]: answer };
        if (q.id === 'plz') {
          const fa = findFinanzamtByPLZ(answer);
          if (fa) d.address = { ...d.address, plz: answer, city: fa.stadt, finanzamt: fa };
        }
        return d;
      });
    }

    if (q.type === 'welcome' && answer === 'no') { setDone(true); return; }

    let next = step + 1;
    while (next < QUESTIONS.length) {
      if (isVisible(QUESTIONS[next])) break;
      next++;
    }

    if (next >= QUESTIONS.length) {
      setDone(true);
    } else {
      setStep(next);
      setInput('');
      setValidationError(null);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [step, input, isVisible]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    setValidationError(null);
    setDirection('left');
    let prev = step - 1;
    while (prev >= 0) {
      if (isVisible(QUESTIONS[prev])) break;
      prev--;
    }
    if (prev >= 0) {
      setStep(prev);
      setInput('');
    }
  }, [step, isVisible]);

  if (done) {
    return <ResultView data={data} onBack={onBack} />;
  }

  const q = currentQ;
  const qIndex = visibleSteps.indexOf(q);
  const progress = qIndex >= 0 ? ((qIndex + 1) / totalQuestions) * 100 : 0;

  const renderQuestion = () => {
    switch (q.type) {
      case 'welcome':
        return <WelcomePage onYes={() => goNext('yes', true)} onNo={() => goNext('no', true)} />;
      case 'choice':
        return <ChoiceQuestion q={q} onSelect={(v) => goNext(v, true)} selected={getFieldValue(data, q.field)} />;
      case 'yesno':
        return <YesNoQuestion q={q} onSelect={(v) => goNext(v, true)} />;
      case 'text':
      case 'date':
      case 'num':
      case 'plz':
        return (
          <InputQuestion
            q={q}
            value={input}
            onChange={(v) => { setInput(v); if (validationError) setValidationError(null); }}
            onSubmit={goNext}
            inputRef={inputRef}
            error={validationError}
          />
        );
      case 'facheck':
        return <FACheckPage data={data} onNext={() => goNext('ok', true)} onBack={() => { setStep(step - 1); setValidationError(null); }} />;
      case 'summary':
        return <SummaryPage data={data} onNext={() => goNext('submit', true)} />;
      default:
        return null;
    }
  };

  return (
    <div className="tw-container">
      {/* Top Progress */}
      <div className="tw-progress">
        <div className="tw-progress-bar" style={{ width: `${Math.max(2, progress)}%` }} />
        <div className="tw-progress-label">{qIndex + 1} von {totalQuestions}</div>
      </div>

      {/* Question */}
      <div className={`tw-content ${direction === 'right' ? 'slide-in-right' : 'slide-in-left'}`}>
        <div className="tw-card">{renderQuestion()}</div>
      </div>

      {/* Back */}
      {step > 0 && q.type !== 'welcome' && q.type !== 'facheck' && q.type !== 'summary' && (
        <button className="tw-back-btn" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Zurück
        </button>
      )}
    </div>
  );
}

function getFieldValue(data, field) {
  if (!field) return '';
  const [s, f] = field;
  return data[s]?.[f] || '';
}

// ─── WELCOME ───
function WelcomePage({ onYes, onNo }) {
  return (
    <div className="tw-question-page">
      <div className="tw-q-body" style={{ textAlign: 'center', paddingTop: '1rem' }}>
        <div className="tw-welcome-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="16" fill="#ADEE68"/>
            <path d="M20 44L32 20L44 44" stroke="#0C0B0A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M26 36H38" stroke="#0C0B0A" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="tw-q-title">Deine Steuererklärung 2025</h2>
        <p className="tw-q-desc">
          Beantworte ein paar einfache Fragen. Wir berechnen deine Erstattung
          und zeigen dir, welche Unterlagen du brauchst.
        </p>
        <div className="tw-welcome-stats">
          <div className="tw-welcome-stat"><span className="tw-welcome-stat-num">30</span><span className="tw-welcome-stat-label">Minuten</span></div>
          <div className="tw-welcome-stat"><span className="tw-welcome-stat-num">4,8</span><span className="tw-welcome-stat-label">Bewertung</span></div>
          <div className="tw-welcome-stat"><span className="tw-welcome-stat-num">8 Mio.+</span><span className="tw-welcome-stat-label">Nutzer</span></div>
        </div>
        <button className="tw-primary-btn" onClick={onYes}>
          Los geht's
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginLeft: '6px' }}>
            <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── YES/NO ───
function YesNoQuestion({ q, onSelect }) {
  return (
    <div className="tw-question-page">
      <div className="tw-q-body">
        <div className="tw-q-icon">{q.icon}</div>
        <h2 className="tw-q-title">{q.q}</h2>
        <div className="tw-q-choices">
          <button className="tw-choice-btn tw-choice-yes" onClick={() => onSelect('yes')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Ja
          </button>
          <button className="tw-choice-btn tw-choice-no" onClick={() => onSelect('no')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nein
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CHOICE ───
function ChoiceQuestion({ q, onSelect, selected }) {
  return (
    <div className="tw-question-page">
      <div className="tw-q-body">
        <div className="tw-q-icon">{q.icon}</div>
        <h2 className="tw-q-title">{q.q}</h2>
        <div className="tw-q-choices">
          {q.opts.map((opt) => (
            <button key={opt.v} className={`tw-choice-btn ${selected === opt.v ? 'tw-choice-selected' : ''}`} onClick={() => onSelect(opt.v)}>
              {opt.l}
              {selected === opt.v && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginLeft: 'auto' }}>
                  <circle cx="10" cy="10" r="7" fill="#ADEE68"/>
                  <path d="M7 10l2 2 4-4" stroke="#0C0B0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── INPUT (with validation) ───
function InputQuestion({ q, value, onChange, onSubmit, inputRef, error }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div className="tw-question-page">
      <div className="tw-q-body">
        <div className="tw-q-icon">{q.icon}</div>
        <h2 className="tw-q-title">{q.q}</h2>
        <form onSubmit={handleSubmit} className="tw-input-form">
          <div style={{ width: '100%', position: 'relative' }}>
            <input
              ref={inputRef}
              type={q.type === 'date' ? 'date' : 'text'}
              inputMode={
                q.type === 'num' ? 'numeric' :
                q.type === 'plz' ? 'numeric' : 'text'
              }
              className={`tw-text-input ${error ? 'tw-text-input--error' : ''}`}
              placeholder={q.ph}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              autoFocus
            />
            {error && (
              <div className="tw-validation-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="8" r="7" fill="#E74C3C"/>
                  <path d="M8 4.5v4M8 11v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}
          </div>
          <button type="submit" className="tw-primary-btn" disabled={!value.trim()}>
            Weiter
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginLeft: '6px' }}>
              <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── FA CHECK ───
function FACheckPage({ data, onNext, onBack }) {
  const fa = data.address.finanzamt;
  return (
    <div className="tw-question-page">
      <div className="tw-q-body" style={{ paddingTop: '1.5rem' }}>
        <div className="tw-facheck-card">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dein Finanzamt</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Anhand deiner PLZ haben wir dein zuständiges Finanzamt ermittelt:
          </p>
          {fa ? (
            <div className="tw-fa-detail">
              <div className="tw-fa-name">{fa.name}</div>
              <div className="tw-fa-addr">{fa.adresse}</div>
              <div className="tw-fa-tel">{fa.telefon}</div>
              <div className="tw-fa-nr">FA-Nummer: {fa.nummer}</div>
            </div>
          ) : (
            <div className="tw-fa-detail" style={{ color: 'var(--color-text-secondary)' }}>
              <p>Kein Finanzamt gefunden. Bitte prüfe deine PLZ.</p>
            </div>
          )}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <button className="tw-primary-btn" onClick={onNext}>Weiter</button>
          <button className="tw-login-link" onClick={onBack} style={{ display: 'block', margin: '1rem auto 0' }}>← PLZ korrigieren</button>
        </div>
      </div>
    </div>
  );
}

// ─── SUMMARY ───
function SummaryPage({ data, onNext }) {
  const p = data.personal;
  const inc = data.income;
  const fa = data.address.finanzamt;
  const salary = parseFloat(inc.salary) || 0;
  const refund = Math.max(0, Math.round(salary * 0.12 + 1000));

  const items = [
    { label: 'Name', value: `${p.firstName} ${p.lastName}` },
    { label: 'Steuerklasse', value: `Klasse ${inc.taxClass}` },
    { label: 'Kinder', value: p.children || '0' },
    fa && { label: 'Finanzamt', value: `${fa.name} (${fa.nummer})` },
    { label: 'Geburtsdatum', value: p.birthDate || '–' },
    salary > 0 && { label: 'Bruttogehalt', value: `${salary.toLocaleString('de-DE')} €` },
  ].filter(Boolean);

  return (
    <div className="tw-question-page">
      <div className="tw-q-body" style={{ paddingTop: '1.5rem' }}>
        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>📋</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.25rem' }}>Zusammenfassung</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>Bitte überprüfe deine Angaben</p>
        <div className="tw-summary-card">
          {items.map((item, i) => (
            <div key={i} className="tw-summary-row">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="tw-refund-box">
          <span className="tw-refund-label">Voraussichtliche Erstattung</span>
          <span className="tw-refund-amount">{refund.toLocaleString('de-DE')} €</span>
        </div>
        <button className="tw-primary-btn" onClick={onNext}>Absenden & XML exportieren</button>
      </div>
    </div>
  );
}

// ─── RESULT ───
function ResultView({ data, onBack }) {
  const p = data.personal;
  const fa = data.address.finanzamt;
  const salary = parseFloat(data.income.salary) || 0;
  const refund = Math.max(0, Math.round(salary * 0.12 + 1000));

  const exportXML = () => {
    const inc = data.income;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ELSTER version="1.0">
  <Kopf><HerstellerID>steuerwert_app</HerstellerID><Verarbeitungsdatum>${new Date().toISOString().split('T')[0]}</Verarbeitungsdatum></Kopf>
  <Steuererklaerung Jahr="2025">
    <Person><Vorname>${p.firstName}</Vorname><Nachname>${p.lastName}</Nachname><Geburtsdatum>${p.birthDate}</Geburtsdatum>
    <Steuerklasse>${inc.taxClass}</Steuerklasse><Kinder>${p.children}</Kinder><Strasse>${data.address.street}</Strasse>
    <PLZ>${data.address.plz}</PLZ><Ort>${data.address.city}</Ort></Person>
    <Finanzamt>${fa?.nummer||''}</Finanzamt>
    <Einkuenfte>${salary}</Einkuenfte>
    <Erstattung>${refund}</Erstattung>
  </Steuererklaerung>
</ELSTER>`;
    const blob = new Blob([xml], {type:'text/xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `steuererklaerung-2025-${p.lastName}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tw-question-page">
      <div className="tw-q-body" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'scaleIn 0.5s ease' }}>🎉</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Steuererklärung fertig!</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Deine Daten wurden gespeichert.</p>
        <div className="tw-refund-box" style={{ margin: '1.5rem 0', animation: 'fadeInUp 0.6s ease 0.2s both' }}>
          <span className="tw-refund-label">Voraussichtliche Erstattung</span>
          <span className="tw-refund-amount">{refund.toLocaleString('de-DE')} €</span>
        </div>
        {fa && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{fa.name} (FA-Nr. {fa.nummer})</p>}
        <button className="tw-primary-btn" onClick={exportXML} style={{ animation: 'fadeInUp 0.6s ease 0.4s both' }}>📥 ELSTER-XML exportieren</button>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1rem', animation: 'fadeInUp 0.6s ease 0.6s both' }}>
          Importiere die XML-Datei in dein ELSTER-Portal, um sie offiziell beim Finanzamt einzureichen.
        </p>
        <button className="tw-login-link" onClick={onBack} style={{ marginTop: '1.5rem' }}>← Zurück zum Dashboard</button>
      </div>
    </div>
  );
}
