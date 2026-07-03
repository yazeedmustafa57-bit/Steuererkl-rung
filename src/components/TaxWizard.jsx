import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { findFinanzamtByPLZ } from '../data/finanzaemter';

const QUESTIONS = [
  { id:'welcome', type:'welcome', q:'Hallo! Möchtest du deine Steuererklärung für 2025 machen?' },
  { id:'firstName', type:'text', q:'Wie ist dein Vorname?', field:['personal','firstName'], ph:'z.B. Max' },
  { id:'lastName', type:'text', q:'Und dein Nachname?', field:['personal','lastName'], ph:'z.B. Mustermann' },
  { id:'birthDate', type:'date', q:'Wann bist du geboren?', field:['personal','birthDate'] },
  { id:'maritalStatus', type:'choice', q:'Wie ist dein Familienstand?', field:['personal','maritalStatus'],
    opts:[{v:'single',l:'Ledig'},{v:'married',l:'Verheiratet'},{v:'divorced',l:'Geschieden'},{v:'widowed',l:'Verwitwet'}] },
  { id:'children', type:'num', q:'Für wie viele Kinder bekommst du Kindergeld?', field:['personal','children'], ph:'0' },
  { id:'taxClass', type:'choice', q:'Welche Steuerklasse hast du?', field:['income','taxClass'],
    opts:[{v:'1',l:'I – ledig/getrennt'},{v:'2',l:'II – Alleinerziehend'},{v:'3',l:'III – Verh.(besser)'},{v:'4',l:'IV – Verh.(Standard)'},{v:'5',l:'V – Verh.(schlechter)'}] },
  { id:'street', type:'text', q:'Deine Straße und Hausnummer?', field:['address','street'], ph:'Musterstraße 42' },
  { id:'plz', type:'plz', q:'Wie ist deine Postleitzahl?', field:['address','plz'], ph:'z.B. 10115' },
  { id:'hasIncome', type:'yesno', q:'Hattest du 2025 einen Job?', field:['income','hasIncome'] },
  { id:'salary', type:'num', q:'Wie viel hast du 2025 brutto verdient?', field:['income','salary'], ph:'€', if:{field:['income','hasIncome'],is:'yes'} },
  { id:'hasOther', type:'yesno', q:'Hattest du andere Einkünfte? (Miete, Zinsen)', field:['income','hasOther'] },
  { id:'otherAmount', type:'num', q:'Wie viel andere Einkünfte?', field:['income','otherIncome'], ph:'€', if:{field:['income','hasOther'],is:'yes'} },
  { id:'hasExpenses', type:'yesno', q:'Hattest du berufliche Ausgaben?', field:['expenses','hasExpenses'] },
  { id:'commuting', type:'num', q:'Wie viele km fährst du zur Arbeit?', field:['expenses','commuting'], ph:'km', if:{field:['expenses','hasExpenses'],is:'yes'} },
  { id:'homeOffice', type:'num', q:'Wie viele Tage Home-Office?', field:['expenses','homeOffice'], ph:'Tage', if:{field:['expenses','hasExpenses'],is:'yes'} },
  { id:'workMat', type:'num', q:'Ausgaben für Arbeitsmittel?', field:['expenses','workMaterials'], ph:'€', if:{field:['expenses','hasExpenses'],is:'yes'} },
  { id:'training', type:'num', q:'Ausgaben für Fortbildungen?', field:['expenses','training'], ph:'€', if:{field:['expenses','hasExpenses'],is:'yes'} },
  { id:'hasSpecial', type:'yesno', q:'Hast du gespendet oder Handwerker bezahlt?', field:['special','hasSpecial'] },
  { id:'donations', type:'num', q:'Wie viel gespendet?', field:['special','donations'], ph:'€', if:{field:['special','hasSpecial'],is:'yes'} },
  { id:'craftsmen', type:'num', q:'Handwerkerkosten? (Lohnanteil)', field:['special','craftsmen'], ph:'€', if:{field:['special','hasSpecial'],is:'yes'} },
  { id:'household', type:'num', q:'Haushaltsnahe Dienstleistungen?', field:['special','householdServices'], ph:'€', if:{field:['special','hasSpecial'],is:'yes'} },
  { id:'healthIns', type:'num', q:'Jährlicher Krankenversicherungsbeitrag?', field:['health','healthInsurance'], ph:'€' },
  { id:'nursingIns', type:'num', q:'Pflegeversicherungsbeitrag?', field:['health','nursingInsurance'], ph:'€' },
  { id:'pension', type:'num', q:'Rentenversicherungsbeitrag?', field:['health','pensionContributions'], ph:'€' },
  { id:'docs', type:'docs', q:'Lade deine Belege hoch (optional)' },
  { id:'faCheck', type:'facheck', q:'Dein Finanzamt' },
  { id:'summary', type:'summary', q:'Zusammenfassung' },
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
  const [left, setLeft] = useState(false);
  const scrollRef = useRef(null);

  // Get current question index accounting for conditional visibility
  const getQ = () => {
    let visible = [];
    for (let i = 0; i < QUESTIONS.length; i++) {
      if (isQVisible(QUESTIONS[i])) visible.push(i);
    }
    // Find where we are in the visible list
    let pos = 0;
    for (let i = 0; i < visible.length; i++) {
      if (visible[i] <= step) pos = i;
    }
    return { visible, pos, total: visible.length };
  };

  const isQVisible = (q) => {
    if (!q.if) return true;
    const [s, f] = q.if.field;
    return data[s]?.[f] === q.if.is;
  };

  const goNext = (answer) => {
    // Save answer
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

    // Handle special cases
    if (q.id === 'welcome' && answer === 'no') { setLeft(true); return; }

    // Find next question
    let next = step + 1;
    while (next < QUESTIONS.length) {
      if (isQVisible(QUESTIONS[next])) break;
      next++;
    }

    if (next >= QUESTIONS.length) {
      setDone(true);
    } else {
      setStep(next);
    }
    setInput('');
  };

  const { visible, pos, total } = getQ();

  if (done) return <ResultView data={data} onBack={onBack} />;
  if (left) return <LeftView onBack={onBack} />;

  const currentQ = QUESTIONS[step];

  return (
    <div className="wizard-chat">
      <div className="chat-header">
        <div className="container chat-header__inner">
          <button className="chat-back" onClick={() => {
            let p = step - 1;
            while (p >= 0) {
              if (isQVisible(QUESTIONS[p])) break;
              p--;
            }
            if (p >= 0) setStep(p);
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="chat-brand">SteuerWert</span>
          <span className="chat-progress-text">{pos + 1} von {total}</span>
        </div>
      </div>
      <div className="chat-progress-bar"><div className="chat-progress-fill" style={{width:`${((pos+1)/total)*100}%`}}/></div>
      <div className="chat-body" ref={scrollRef}>
        <div className="container chat-container">
          <QCard q={currentQ} data={data} input={input} setInput={setInput} goNext={goNext} step={step} />
        </div>
      </div>
    </div>
  );
}

function QCard({ q, data, input, setInput, goNext }) {
  const fileRef = useRef(null);

  switch (q.type) {
    case 'welcome':
      return (
        <div className="chat-welcome">
          <div className="chat-tax-logo">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#ADEE68"/>
              <path d="M10 22L16 10L22 22" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 17H19" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="chat-title">Steuererklärung 2025</h2>
          <p className="chat-subtitle">Ich führe dich Schritt für Schritt durch deine Steuererklärung. Dauer: ca. 15 Minuten.</p>
          <div className="chat-actions">
            <button className="btn btn-primary chat-action-btn" onClick={() => goNext('yes')}>Los geht's! 🚀</button>
            <button className="btn btn-outline chat-action-btn" onClick={() => goNext('no')}>Vielleicht später</button>
          </div>
        </div>
      );

    case 'text':
    case 'num':
    case 'date':
    case 'plz':
      return (
        <div className="chat-question">
          <div className="chat-bubble chat-bubble--bot"><p>{q.q}</p></div>
          <div className="chat-input-area">
            <input className="chat-input"
              type={q.type === 'date' ? 'date' : q.type === 'num' || q.type === 'plz' ? 'text' : 'text'}
              inputMode={q.type === 'num' || q.type === 'plz' ? 'numeric' : 'text'}
              placeholder={q.ph || ''}
              value={input}
              onChange={e => {
                let val = e.target.value;
                if (q.type === 'plz') { val = val.replace(/\D/g,'').slice(0,5); setInput(val); if (val.length === 5) setTimeout(() => goNext(val), 300); return; }
                setInput(val);
              }}
              onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { if (q.type === 'plz' && input.length !== 5) return; goNext(input.trim()); } }}
              autoFocus
            />
            <button className="chat-send" onClick={() => { if (input.trim() && (q.type !== 'plz' || input.length === 5)) goNext(input.trim()); }} disabled={!input.trim()}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 10L3 3l4 7-4 7 14-7z" fill="currentColor"/></svg>
            </button>
          </div>
        </div>
      );

    case 'yesno':
      return (
        <div className="chat-question">
          <div className="chat-bubble chat-bubble--bot"><p>{q.q}</p></div>
          <div className="chat-actions-row">
            <button className="chat-btn-choice chat-btn--yes" onClick={() => goNext('yes')}><span className="chat-btn-icon">👍</span> Ja</button>
            <button className="chat-btn-choice chat-btn--no" onClick={() => goNext('no')}><span className="chat-btn-icon">👎</span> Nein</button>
          </div>
        </div>
      );

    case 'choice':
      return (
        <div className="chat-question">
          <div className="chat-bubble chat-bubble--bot"><p>{q.q}</p></div>
          <div className="chat-options-grid">
            {q.opts.map(o => (
              <button key={o.v} className="chat-option-btn" onClick={() => goNext(o.v)}>{o.l}</button>
            ))}
          </div>
        </div>
      );

    case 'docs':
      return (
        <div className="chat-question">
          <div className="chat-bubble chat-bubble--bot">
            <p>Lade deine Belege hoch – Lohnsteuerbescheinigung, Spendenquittungen, Rechnungen.</p>
          </div>
          <div className="chat-doc-upload" onClick={() => fileRef.current?.click()}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="8" stroke="#ADEE68" strokeWidth="2" strokeDasharray="4 4"/><path d="M20 14v12M14 20h12" stroke="#ADEE68" strokeWidth="2" strokeLinecap="round"/></svg>
            <p>Klicke zum Hochladen</p>
            <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.png" style={{display:'none'}} onChange={e => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) console.log('Files:', files.length);
            }} />
          </div>
          <button className="btn btn-primary" onClick={() => goNext('ok')} style={{width:'100%',marginTop:'1rem'}}>Weiter</button>
        </div>
      );

    case 'facheck': {
      const fa = data.address.finanzamt;
      if (!fa) return (
        <div className="chat-question">
          <div className="chat-bubble chat-bubble--bot"><p>⚠️ Kein Finanzamt gefunden.</p></div>
          <button className="btn btn-primary" onClick={() => goNext('ok')} style={{width:'100%'}}>Trotzdem fortfahren</button>
        </div>
      );
      return (
        <div className="chat-question">
          <div className="chat-bubble chat-bubble--bot"><p>Deine Daten werden an dieses Finanzamt gesendet:</p></div>
          <div className="chat-fa-card">
            <div className="chat-fa-icon">🏛️</div>
            <div className="chat-fa-info">
              <strong>{fa.name}</strong>
              <p>FA-Nr: <code>{fa.nummer}</code></p>
              <p>{fa.adresse}</p>
              <p>📞 {fa.telefon}</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => goNext('ok')} style={{width:'100%'}}>Weiter</button>
        </div>
      );
    }

    case 'summary': {
      const p = data.personal;
      const inc = data.income;
      const fa = data.address.finanzamt;
      const salary = parseFloat(inc.salary) || 0;
      const refund = Math.max(0, Math.round(salary * 0.12 + 1000));
      return (
        <div className="chat-question">
          <div className="chat-bubble chat-bubble--bot"><p>Hier ist deine Zusammenfassung:</p></div>
          <div className="chat-summary-card">
            <div className="chat-summary-section">
              <h4>👤 Persönlich</h4>
              <p>{p.firstName} {p.lastName} • SK {inc.taxClass} • {p.children} Kind(er)</p>
            </div>
            <div className="chat-summary-section">
              <h4>📍 Finanzamt</h4>
              <p>{fa?.name} (FA-Nr. {fa?.nummer})</p>
            </div>
            {salary > 0 && (
              <div className="chat-summary-section">
                <h4>💰 Einkünfte</h4>
                <p>{salary.toLocaleString('de-DE')} €</p>
              </div>
            )}
          </div>
          <div className="chat-refund-teaser">
            <span className="chat-refund-label">Voraussichtliche Erstattung</span>
            <span className="chat-refund-value">{refund.toLocaleString('de-DE')} €</span>
          </div>
          <button className="btn btn-primary" onClick={() => goNext('ok')} style={{width:'100%'}}>Absenden & XML exportieren ✅</button>
        </div>
      );
    }

    default:
      return <div className="chat-question"><p>Frage unbekannt</p></div>;
  }
}

function ResultView({ data, onBack }) {
  const fa = data.address.finanzamt;
  const salary = parseFloat(data.income.salary) || 0;
  const refund = Math.max(0, Math.round(salary * 0.12 + 1000));

  const exportXML = () => {
    const p = data.personal;
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
    <div className="wizard-chat">
      <div className="chat-header"><div className="container chat-header__inner">
        <button className="chat-back" onClick={onBack}><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <span className="chat-brand">SteuerWert</span><div/>
      </div></div>
      <div className="chat-body" style={{justifyContent:'center',textAlign:'center'}}>
        <div className="chat-result">
          <div className="chat-result-icon">🎉</div>
          <h2 className="chat-result-title">Geschafft!</h2>
          <div className="chat-result-refund">
            <span className="chat-result-label">Voraussichtliche Erstattung</span>
            <span className="chat-result-amount">{refund.toLocaleString('de-DE')} €</span>
          </div>
          {fa && <div className="chat-result-fa"><p>🏛️ {fa.name} (FA-Nr. {fa.nummer})</p></div>}
          <button className="btn btn-primary" onClick={exportXML} style={{width:'100%',marginBottom:'1rem'}}>📥 ELSTER-XML exportieren</button>
          <p className="chat-result-hint">Importiere die XML in dein ELSTER-Portal unter <strong>www.elster.de</strong></p>
          <button className="btn btn-outline" onClick={onBack} style={{width:'100%'}}>Dashboard</button>
        </div>
      </div>
    </div>
  );
}

function LeftView({ onBack }) {
  return (
    <div className="wizard-chat">
      <div className="chat-header"><div className="container chat-header__inner">
        <button className="chat-back" onClick={onBack}><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <span className="chat-brand">SteuerWert</span><div/>
      </div></div>
      <div className="chat-body" style={{justifyContent:'center',textAlign:'center'}}>
        <div style={{fontSize:'3rem',marginBottom:'1rem'}}>👋</div>
        <h2>Bis bald!</h2>
        <p style={{color:'var(--color-text-secondary)',marginTop:'0.5rem'}}>Komm wieder, wenn du bereit bist.</p>
        <button className="btn btn-primary" onClick={onBack} style={{marginTop:'1.5rem'}}>Dashboard</button>
      </div>
    </div>
  );
}
