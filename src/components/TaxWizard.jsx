import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { findFinanzamtByPLZ } from '../data/finanzaemter';

const QUESTIONS = [
  { id: 'welcome', type: 'welcome' },
  { id: 'firstName', type: 'text', q: 'Wie heißt du?', field: ['personal','firstName'], ph: 'Vorname', icon: '👋' },
  { id: 'lastName', type: 'text', q: 'Und dein Nachname?', field: ['personal','lastName'], ph: 'Nachname', icon: '✍️' },
  { id: 'birthDate', type: 'date', q: 'Wann bist du geboren?', field: ['personal','birthDate'], icon: '🎂' },
  { id: 'maritalStatus', type: 'choice', q: 'Wie ist dein Familienstand?', field: ['personal','maritalStatus'], icon: '💍',
    opts:[{v:'single',l:'Ledig'},{v:'married',l:'Verheiratet'},{v:'divorced',l:'Geschieden'},{v:'widowed',l:'Verwitwet'}] },
  { id: 'children', type: 'num', q: 'Hast du Kinder?', field: ['personal','children'], ph: 'Anzahl', icon: '👶' },
  { id: 'taxClass', type: 'choice', q: 'Welche Steuerklasse hast du?', field: ['income','taxClass'], icon: '📊',
    opts:[{v:'1',l:'I'},{v:'2',l:'II'},{v:'3',l:'III'},{v:'4',l:'IV'},{v:'5',l:'V'}] },
  { id: 'street', type: 'text', q: 'Deine Straße?', field: ['address','street'], ph: 'Musterstraße 42', icon: '🏠' },
  { id: 'plz', type: 'plz', q: 'Deine Postleitzahl?', field: ['address','plz'], ph: 'PLZ', icon: '📍' },
  { id: 'hasIncome', type: 'yesno', q: 'Hattest du 2025 einen Job?', field: ['income','hasIncome'], icon: '💼' },
  { id: 'salary', type: 'num', q: 'Wie viel hast du brutto verdient?', field: ['income','salary'], ph: '€', icon: '💰', if:{field:['income','hasIncome'],is:'yes'} },
  { id: 'hasOther', type: 'yesno', q: 'Hattest du andere Einkünfte?', field: ['income','hasOther'], icon: '📈' },
  { id: 'otherAmount', type: 'num', q: 'Wie viel andere Einkünfte?', field: ['income','otherIncome'], ph: '€', icon: '💵', if:{field:['income','hasOther'],is:'yes'} },
  { id: 'hasExpenses', type: 'yesno', q: 'Hattest du berufliche Ausgaben?', field: ['expenses','hasExpenses'], icon: '📄' },
  { id: 'commuting', type: 'num', q: 'Wie viele km zur Arbeit?', field: ['expenses','commuting'], ph: 'km', icon: '🚗', if:{field:['expenses','hasExpenses'],is:'yes'} },
  { id: 'homeOffice', type: 'num', q: 'Home-Office Tage?', field: ['expenses','homeOffice'], ph: 'Tage', icon: '🏡', if:{field:['expenses','hasExpenses'],is:'yes'} },
  { id: 'hasSpecial', type: 'yesno', q: 'Hast du gespendet oder Handwerker bezahlt?', field: ['special','hasSpecial'], icon: '🎯' },
  { id: 'donations', type: 'num', q: 'Höhe der Spenden?', field: ['special','donations'], ph: '€', icon: '❤️', if:{field:['special','hasSpecial'],is:'yes'} },
  { id: 'craftsmen', type: 'num', q: 'Handwerkerkosten?', field: ['special','craftsmen'], ph: '€', icon: '🔧', if:{field:['special','hasSpecial'],is:'yes'} },
  { id: 'healthIns', type: 'num', q: 'Krankenversicherung?', field: ['health','healthInsurance'], ph: '€/Jahr', icon: '🏥' },
  { id: 'nursingIns', type: 'num', q: 'Pflegeversicherung?', field: ['health','nursingInsurance'], ph: '€/Jahr', icon: '🩺' },
  { id: 'faCheck', type: 'facheck' },
  { id: 'summary', type: 'summary' },
];

const WELCOME_STATS = [
  { num: '30', label: 'Minuten' },
  { num: '4,8', label: 'Bewertung' },
  { num: '8 Mio.+', label: 'Nutzer' },
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
  const inputRef = useRef(null);
  const [showProgress, setShowProgress] = useState(true);

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

  const goNext = useCallback((answer) => {
    const q = QUESTIONS[step];
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
      // Auto-focus input after transition
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [step, isVisible]);

  const goBack = useCallback(() => {
    if (step === 0) return;
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
        return <WelcomePage stats={WELCOME_STATS} onNext={() => goNext('yes')} />;
      case 'choice':
        return <ChoiceQuestion q={q} onSelect={(v) => goNext(v)} selected={getFieldValue(data, q.field)} />;
      case 'yesno':
        return <YesNoQuestion q={q} onSelect={(v) => goNext(v)} />;
      case 'text':
      case 'date':
      case 'num':
      case 'plz':
        return <InputQuestion q={q} value={input} onChange={setInput} onSubmit={goNext} inputRef={inputRef} />;
      case 'facheck':
        return <FACheckPage data={data} onNext={() => goNext('ok')} onBack={() => { setStep(step - 1); }} />;
      case 'summary':
        return <SummaryPage data={data} onNext={() => goNext('submit')} />;
      default:
        return null;
    }
  };

  return (
    <div className="tw-container">
      {/* Progress Bar */}
      <div className="tw-progress">
        <div className="tw-progress-bar" style={{ width: `${progress}%` }} />
        <div className="tw-progress-label">
          {qIndex + 1} von {totalQuestions}
        </div>
      </div>

      {/* Question Content */}
      <div className={`tw-content ${direction === 'right' ? 'slide-in-right' : 'slide-in-left'}`}>
        <div className="tw-card">
          {renderQuestion()}
        </div>
      </div>

      {/* Back Button (only on non-welcome, non-summary, non-facheck pages) */}
      {step > 0 && q.type !== 'welcome' && q.type !== 'facheck' && q.type !== 'summary' && (
        <button className="tw-back-btn" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
function WelcomePage({ stats, onNext }) {
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
          {stats.map((s, i) => (
            <div key={i} className="tw-welcome-stat">
              <span className="tw-welcome-stat-num">{s.num}</span>
              <span className="tw-welcome-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <button className="tw-primary-btn" onClick={onNext}>
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
            <button
              key={opt.v}
              className={`tw-choice-btn ${selected === opt.v ? 'tw-choice-selected' : ''}`}
              onClick={() => onSelect(opt.v)}
            >
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

// ─── INPUT ───
function InputQuestion({ q, value, onChange, onSubmit, inputRef }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div className="tw-question-page">
      <div className="tw-q-body">
        <div className="tw-q-icon">{q.icon}</div>
        <h2 className="tw-q-title">{q.q}</h2>
        <form onSubmit={handleSubmit} className="tw-input-form">
          <input
            ref={inputRef}
            type={q.type === 'num' || q.type === 'plz' ? 'text' : q.type}
            inputMode={q.type === 'num' ? 'numeric' : q.type === 'plz' ? 'numeric' : 'text'}
            className="tw-text-input"
            placeholder={q.ph}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
            required
          />
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
              <div className="tw-fa-nr">FA-Nr: {fa.nummer}</div>
            </div>
          ) : (
            <div className="tw-fa-detail">
              <p>Kein Finanzamt gefunden. Bitte prüfe deine PLZ.</p>
            </div>
          )}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <button className="tw-primary-btn" onClick={onNext}>Weiter</button>
          <button className="tw-login-link" onClick={onBack} style={{ display: 'block', margin: '1rem auto 0' }}>
            ← PLZ korrigieren
          </button>
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
    { label: 'Steuerklasse', value: inc.taxClass },
    { label: 'Kinder', value: p.children || '0' },
    fa && { label: 'Finanzamt', value: fa.name },
    { label: 'Geburtsdatum', value: p.birthDate || '–' },
    salary > 0 && { label: 'Bruttogehalt', value: `${salary.toLocaleString('de-DE')} €` },
  ].filter(Boolean);

  return (
    <div className="tw-question-page">
      <div className="tw-q-body" style={{ paddingTop: '1.5rem' }}>
        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>📋</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.25rem' }}>Zusammenfassung</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
          Bitte überprüfe deine Angaben
        </p>

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
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Deine Daten wurden gespeichert.
        </p>
        <div className="tw-refund-box" style={{ margin: '1.5rem 0', animation: 'fadeInUp 0.6s ease 0.2s both' }}>
          <span className="tw-refund-label">Voraussichtliche Erstattung</span>
          <span className="tw-refund-amount">{refund.toLocaleString('de-DE')} €</span>
        </div>
        {fa && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {fa.name} (FA-Nr. {fa.nummer})
          </p>
        )}
        <button className="tw-primary-btn" onClick={exportXML} style={{ animation: 'fadeInUp 0.6s ease 0.4s both' }}>
          📥 ELSTER-XML exportieren
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1rem', animation: 'fadeInUp 0.6s ease 0.6s both' }}>
          Importiere die XML-Datei in dein ELSTER-Portal,<br />
          um sie offiziell beim Finanzamt einzureichen.
        </p>
        <button className="tw-login-link" onClick={onBack} style={{ marginTop: '1.5rem' }}>
          ← Zurück zum Dashboard
        </button>
      </div>
    </div>
  );
}
