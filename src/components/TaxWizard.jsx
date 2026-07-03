import { useState, useRef, useEffect } from 'react';
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

// Icon mapping for welcome page stats
const WELCOME_STATS = [
  { num: '30', unit: 'Min.' },
  { num: '4,8', unit: '★' },
  { num: '8 Mio.+', unit: 'Nutzer' },
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
  const bodyRef = useRef(null);

  const isVisible = (q) => {
    if (!q.if) return true;
    const [s, f] = q.if.field;
    return data[s]?.[f] === q.if.is;
  };

  const goNext = (answer) => {
    const q = QUESTIONS[step];
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
      setDirection('right');
      setStep(next);
    }
    setInput('');
  };

  const goBack = () => {
    setDirection('left');
    let p = step - 1;
    while (p >= 0) { if (isVisible(QUESTIONS[p])) break; p--; }
    if (p >= 0) setStep(p);
  };

  const currentQ = QUESTIONS[step];

  // Calculate progress
  const visibleQuestions = QUESTIONS.filter(q => isVisible(q) && q.type !== 'welcome' && q.type !== 'facheck' && q.type !== 'summary');
  const totalVisible = visibleQuestions.length;
  let pos = 0;
  for (let i = 0; i <= step; i++) {
    if (isVisible(QUESTIONS[i]) && QUESTIONS[i].type !== 'welcome' && QUESTIONS[i].type !== 'facheck' && QUESTIONS[i].type !== 'summary') pos++;
  }

  if (done) {
    return <ResultView data={data} onBack={onBack} />;
  }

  if (currentQ.type === 'welcome') {
    return <WelcomePage onStart={() => goNext('yes')} stats={WELCOME_STATS} />;
  }

  if (currentQ.type === 'facheck') {
    return <FaCheckPage data={data} onNext={() => goNext('ok')} />;
  }

  if (currentQ.type === 'summary') {
    return <SummaryPage data={data} onNext={() => goNext('ok')} />;
  }

  return (
    <QuestionPage
      question={currentQ}
      data={data}
      input={input}
      setInput={setInput}
      onAnswer={goNext}
      progress={{ pos, total: totalVisible }}
      onBack={goBack}
      direction={direction}
    />
  );
}

// ─── WELCOME PAGE ───
function WelcomePage({ onStart, stats }) {
  return (
    <div className="tw-welcome">
      <div className="tw-welcome-header">
        <span className="tw-welcome-title">Steuererklärung 2025</span>
      </div>

      <div className="tw-welcome-content">
        <div className="tw-welcome-phone">
          <div className="tw-phone-mockup">
            <div className="tw-phone-top">
              <span className="tw-phone-time">09:41</span>
              <div className="tw-phone-icons">
                <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0.5" y="0.5" width="13" height="9" rx="1.5" stroke="#000" strokeWidth="0.8" fill="none"/><rect x="11" y="3" width="2" height="4" rx="0.5" fill="#000"/></svg>
              </div>
            </div>
            <div className="tw-phone-screen">
              <div className="tw-phone-q">
                <p className="tw-phone-question">Hattest du 2025<br />berufliche Ausgaben?</p>
                <div className="tw-phone-btns">
                  <button className="tw-phone-btn tw-phone-btn-yes">Ja</button>
                  <button className="tw-phone-btn tw-phone-btn-no">Nein</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-welcome-stats">
          {stats.map((s, i) => (
            <div key={i} className="tw-stat" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
              <span className="tw-stat-num">{s.num}</span>
              <span className="tw-stat-unit">{s.unit}</span>
            </div>
          ))}
        </div>

        <button className="tw-primary-btn" onClick={onStart}>
          Ja, loslegen!
        </button>
      </div>
    </div>
  );
}

// ─── QUESTION PAGE ───
function QuestionPage({ question: q, input, setInput, onAnswer, progress, onBack, direction }) {
  const animClass = direction === 'right' ? 'slide-in-right' : 'slide-in-left';

  const renderContent = () => {
    switch (q.type) {
      case 'text':
      case 'num':
      case 'plz':
        return (
          <div className="tw-q-input-area">
            <input className="tw-q-input"
              type="text"
              inputMode={q.type === 'num' || q.type === 'plz' ? 'numeric' : 'text'}
              placeholder={q.ph || ''}
              value={input}
              onChange={e => {
                let val = e.target.value;
                if (q.type === 'plz') {
                  val = val.replace(/\D/g,'').slice(0,5);
                  setInput(val);
                  if (val.length === 5) setTimeout(() => onAnswer(val), 400);
                  return;
                }
                setInput(val);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim()) {
                  if (q.type === 'plz' && input.length !== 5) return;
                  onAnswer(input.trim());
                }
              }}
              autoFocus
            />
            <button className="tw-q-arrow" onClick={() => {
              if (input.trim() && (q.type !== 'plz' || input.length === 5)) onAnswer(input.trim());
            }} disabled={!input.trim()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        );

      case 'date':
        return (
          <div className="tw-q-input-area">
            <input className="tw-q-input" type="date" value={input} onChange={e => setInput(e.target.value)} />
            <button className="tw-q-arrow" onClick={() => input && onAnswer(input)} disabled={!input}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        );

      case 'yesno':
        return (
          <div className="tw-q-yesno">
            <button className="tw-q-yesno-btn tw-q-yes" onClick={() => onAnswer('yes')} autoFocus>
              <span className="tw-check-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#36893B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              Ja
            </button>
            <button className="tw-q-yesno-btn tw-q-no" onClick={() => onAnswer('no')}>
              <span className="tw-x-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#C0392B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              Nein
            </button>
          </div>
        );

      case 'choice':
        return (
          <div className="tw-q-choice">
            {q.opts.map(o => (
              <button key={o.v} className="tw-q-choice-btn" onClick={() => onAnswer(o.v)}>
                <span>{o.l}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercent = progress.total > 0 ? Math.round((progress.pos / progress.total) * 100) : 0;

  return (
    <div className="tw-question-page">
      <div className="tw-q-header">
        <button className="tw-back-btn dark" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="#0C0B0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="tw-q-progress">
          <div className="tw-q-progress-bar">
            <div className="tw-q-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="tw-q-progress-label">{progress.pos} / {progress.total}</div>
        </div>
      </div>

      <div className={`tw-q-body ${animClass}`}>
        {q.icon && <div className="tw-q-icon">{q.icon}</div>}
        <p className="tw-q-text">{q.q}</p>
        {q.type === 'num' && q.ph === '€' && <p className="tw-q-hint">Gib den Brutto-Jahresbetrag ein</p>}
        {q.type === 'num' && q.ph === 'km' && <p className="tw-q-hint">Einfache Strecke pro Arbeitstag</p>}
        {q.type === 'num' && q.ph === 'Tage' && <p className="tw-q-hint">Anzahl der Tage im Home-Office</p>}
        {renderContent()}
      </div>
    </div>
  );
}

// ─── FINANZAMT CHECK ───
function FaCheckPage({ data, onNext }) {
  const fa = data.address.finanzamt;
  return (
    <div className="tw-question-page">
      <div className="tw-q-header">
        <button className="tw-back-btn dark" onClick={onNext}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="#0C0B0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="tw-q-body" style={{textAlign:'center', paddingTop:'2rem'}}>
        <div className="tw-q-icon" style={{fontSize:'3rem', marginBottom:'1rem'}}>🏛️</div>
        <h2 style={{fontSize:'1.25rem',fontWeight:700,marginBottom:'0.5rem'}}>Dein Finanzamt</h2>
        <p style={{color:'var(--color-text-secondary)',marginBottom:'0.25rem'}}>{fa?.name}</p>
        <p style={{color:'var(--color-text-secondary)',marginBottom:'1rem'}}>FA-Nr. {fa?.nummer}</p>
        <p style={{color:'var(--color-text-secondary)',fontSize:'0.85rem',marginBottom:'1.5rem'}}>{fa?.adresse}</p>
        <button className="tw-primary-btn" onClick={onNext}>Weiter</button>
        <p style={{fontSize:'0.75rem',color:'var(--color-text-muted)',marginTop:'1rem'}}>
          Deine Daten werden an dieses Finanzamt übermittelt
        </p>
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
      <div className="tw-q-body" style={{paddingTop:'1.5rem'}}>
        <div style={{fontSize:'3rem',textAlign:'center',marginBottom:'0.5rem'}}>📋</div>
        <h2 style={{fontSize:'1.25rem',fontWeight:700,textAlign:'center',marginBottom:'0.25rem'}}>Zusammenfassung</h2>
        <p style={{fontSize:'0.85rem',color:'var(--color-text-secondary)',textAlign:'center',marginBottom:'1.5rem'}}>
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
      <div className="tw-q-body" style={{textAlign:'center',paddingTop:'2rem'}}>
        <div className="tw-success-animation" style={{fontSize:'3.5rem',marginBottom:'1rem', animation: 'scaleIn 0.5s ease'}}>🎉</div>
        <h2 style={{fontSize:'1.25rem',fontWeight:700,marginBottom:'0.5rem'}}>Steuererklärung fertig!</h2>
        <p style={{color:'var(--color-text-secondary)',fontSize:'0.9rem',marginBottom:'1.5rem'}}>
          Deine Daten wurden gespeichert.
        </p>
        <div className="tw-refund-box" style={{margin:'1.5rem 0', animation: 'fadeInUp 0.6s ease 0.2s both'}}>
          <span className="tw-refund-label">Voraussichtliche Erstattung</span>
          <span className="tw-refund-amount">{refund.toLocaleString('de-DE')} €</span>
        </div>
        {fa && (
          <p style={{color:'var(--color-text-secondary)',fontSize:'0.85rem',marginBottom:'1.5rem'}}>
            {fa.name} (FA-Nr. {fa.nummer})
          </p>
        )}
        <button className="tw-primary-btn" onClick={exportXML} style={{animation: 'fadeInUp 0.6s ease 0.4s both'}}>
          📥 ELSTER-XML exportieren
        </button>
        <p style={{fontSize:'0.75rem',color:'var(--color-text-muted)',marginTop:'1rem', animation: 'fadeInUp 0.6s ease 0.6s both'}}>
          Importiere die XML-Datei in dein ELSTER-Portal,<br />
          um sie offiziell beim Finanzamt einzureichen.
        </p>
        <button className="tw-login-link" onClick={onBack} style={{marginTop:'1.5rem'}}>
          ← Zurück zum Dashboard
        </button>
      </div>
    </div>
  );
}
