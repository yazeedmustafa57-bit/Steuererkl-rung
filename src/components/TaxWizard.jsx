import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { findFinanzamtByPLZ } from '../data/finanzaemter';

const ALL_QUESTIONS = [
  // ─── Step 0: Willkommen ───
  { id: 'welcome', type: 'welcome', question: 'Hallo! Möchtest du deine Steuererklärung für 2025 machen?', field: null },

  // ─── Step 1: Persönliche Daten ───
  { id: 'firstName', type: 'text', question: 'Wie ist dein Vorname?', field: ['personal','firstName'], placeholder: 'z.B. Max' },
  { id: 'lastName', type: 'text', question: 'Und dein Nachname?', field: ['personal','lastName'], placeholder: 'z.B. Mustermann' },
  { id: 'birthDate', type: 'date', question: 'Wann bist du geboren?', field: ['personal','birthDate'] },
  { id: 'maritalStatus', type: 'choice', question: 'Wie ist dein Familienstand?', field: ['personal','maritalStatus'],
    options: [{ value: 'single', label: 'Ledig' }, { value: 'married', label: 'Verheiratet' }, { value: 'divorced', label: 'Geschieden' }, { value: 'widowed', label: 'Verwitwet' }] },
  { id: 'children', type: 'number', question: 'Für wie viele Kinder bekommst du Kindergeld?', field: ['personal','children'], placeholder: '0', min: 0, max: 10 },
  { id: 'taxClass', type: 'choice', question: 'Welche Steuerklasse hast du?', field: ['income','taxClass'],
    options: [{ value: '1', label: 'I – ledig/getrennt' }, { value: '2', label: 'II – Alleinerziehend' }, { value: '3', label: 'III – Verh. (besser)' }, { value: '4', label: 'IV – Verh. (Standard)' }, { value: '5', label: 'V – Verh. (schlechter)' }] },

  // ─── Step 2: Adresse ───
  { id: 'street', type: 'text', question: 'Deine Straße und Hausnummer?', field: ['address','street'], placeholder: 'Musterstraße 42' },
  { id: 'plz', type: 'plz', question: 'Wie ist deine Postleitzahl?', field: ['address','plz'], placeholder: 'z.B. 10115' },

  // ─── Step 3: Einkünfte ───
  { id: 'hasIncome', type: 'yesno', question: 'Hattest du 2025 ein Job?', field: ['income','hasIncome'] },
  { id: 'salary', type: 'number', question: 'Wie viel hast du 2025 brutto verdient?', field: ['income','salary'], placeholder: '€', depends: ['income','hasIncome', 'yes'] },
  { id: 'otherIncome', type: 'yesno', question: 'Hattest du noch andere Einkünfte? (Miete, Kapital, etc.)', field: ['income','hasOtherIncome'] },
  { id: 'otherIncomeAmount', type: 'number', question: 'Wie viel waren das?', field: ['income','otherIncome'], placeholder: '€', depends: ['income','hasOtherIncome', 'yes'] },

  // ─── Step 4: Werbungskosten ───
  { id: 'hasExpenses', type: 'yesno', question: 'Hattest du berufliche Ausgaben?', field: ['expenses','hasExpenses'] },
  { id: 'commuting', type: 'number', question: 'Wie viele Kilometer fährst du einfach zur Arbeit?', field: ['expenses','commuting'], placeholder: 'km', depends: ['expenses','hasExpenses', 'yes'] },
  { id: 'homeOffice', type: 'number', question: 'Wie viele Tage warst du 2025 im Home-Office?', field: ['expenses','homeOffice'], placeholder: 'Tage', depends: ['expenses','hasExpenses', 'yes'] },
  { id: 'workMaterials', type: 'number', question: 'Hast du Arbeitsmittel gekauft? (Computer, Bücher, etc.)', field: ['expenses','workMaterials'], placeholder: '€', depends: ['expenses','hasExpenses', 'yes'] },
  { id: 'training', type: 'number', question: 'Was hast du für Fortbildungen ausgegeben?', field: ['expenses','training'], placeholder: '€', depends: ['expenses','hasExpenses', 'yes'] },

  // ─── Step 5: Sonderausgaben ───
  { id: 'hasSpecial', type: 'yesno', question: 'Hast du gespendet oder Handwerker bezahlt?', field: ['special','hasSpecial'] },
  { id: 'donations', type: 'number', question: 'Wie viel hast du gespendet?', field: ['special','donations'], placeholder: '€', depends: ['special','hasSpecial', 'yes'] },
  { id: 'craftsmen', type: 'number', question: 'Was hast du für Handwerker ausgegeben? (Rechnung, Lohn)', field: ['special','craftsmen'], placeholder: '€', depends: ['special','hasSpecial', 'yes'] },
  { id: 'householdServices', type: 'number', question: 'Hattest du haushaltsnahe Dienstleistungen? (Putzhilfe, Garten)', field: ['special','householdServices'], placeholder: '€', depends: ['special','hasSpecial', 'yes'] },

  // ─── Step 6: Vorsorge ───
  { id: 'healthInsurance', type: 'number', question: 'Was zahlst du jährlich für die Krankenversicherung?', field: ['health','healthInsurance'], placeholder: '€' },
  { id: 'nursingInsurance', type: 'number', question: 'Und für die Pflegeversicherung?', field: ['health','nursingInsurance'], placeholder: '€' },
  { id: 'pensionContributions', type: 'number', question: 'Was zahlst du in die Rentenversicherung?', field: ['health','pensionContributions'], placeholder: '€' },

  // ─── Step 7: Dokumente ───
  { id: 'documents', type: 'documents', question: 'Hast du deine Belege bereit?', field: null },

  // ─── Step 8: Finanzamt ───
  { id: 'finanzamtCheck', type: 'finanzamt', question: 'Deine Daten werden an dieses Finanzamt gesendet:', field: null },

  // ─── Step 9: Zusammenfassung ───
  { id: 'summary', type: 'summary', question: 'Alles bereit für deine Steuererklärung!', field: null },
];

export default function TaxWizard({ onBack }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    personal: { firstName: '', lastName: '', birthDate: '', maritalStatus: 'single', children: '0' },
    address: { street: '', plz: '', city: '', country: 'Deutschland', finanzamt: null },
    income: { taxClass: '1', salary: '', otherIncome: '', hasIncome: null, hasOtherIncome: null },
    expenses: { commuting: '', homeOffice: '', workMaterials: '', training: '', hasExpenses: null },
    special: { donations: '', craftsmen: '', householdServices: '', hasSpecial: null },
    health: { healthInsurance: '', nursingInsurance: '', pensionContributions: '', hasPrivateInsurance: null },
    documents: [],
  });
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [chatEnd, setChatEnd] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step, inputValue]);

  const q = ALL_QUESTIONS[step];
  const isVisible = (question) => {
    if (!question.depends) return true;
    const [section, field, expected] = question.depends;
    return data[section]?.[field] === expected;
  };

  const getQuestionsToShow = () => {
    return ALL_QUESTIONS.filter((q, i) => {
      if (i > step) return false;
      if (q.id === 'documents' || q.id === 'finanzamtCheck' || q.id === 'summary') return true;
      return isVisible(q);
    });
  };

  const currentQ = (() => {
    let visibleIdx = 0;
    for (let i = 0; i <= step; i++) {
      if (isVisible(ALL_QUESTIONS[i])) visibleIdx++;
      if (i === step) break;
    }
    return visibleIdx;
  })();

  const totalVisible = ALL_QUESTIONS.filter((q, i) => {
    if (q.type === 'welcome' || q.type === 'documents' || q.type === 'finanzamt' || q.type === 'summary') return true;
    if (!isVisible(q)) return false;
    return i <= getLastVisibleIndex();
  }).length;

  const getLastVisibleIndex = () => {
    let idx = 0;
    for (let i = 0; i < ALL_QUESTIONS.length; i++) {
      if (isVisible(ALL_QUESTIONS[i])) idx = i;
    }
    return idx;
  };

  const getVisibleSoFar = () => {
    const result = [];
    for (let i = 0; i <= step; i++) {
      if (isVisible(ALL_QUESTIONS[i])) result.push(ALL_QUESTIONS[i]);
    }
    return result;
  };

  const visibleSoFar = getVisibleSoFar();

  const handleAnswer = (answer) => {
    const current = ALL_QUESTIONS[step];
    if (current.field) {
      setData((prev) => {
        const d = { ...prev };
        const [section, field] = current.field;
        d[section] = { ...d[section], [field]: answer };
        return d;
      });
    }
    if (current.id === 'plz' && answer.length === 5) {
      const fa = findFinanzamtByPLZ(answer);
      if (fa) {
        setData((prev) => ({
          ...prev,
          address: { ...prev.address, plz: answer, city: fa.stadt, finanzamt: fa },
        }));
      } else {
        setData((prev) => ({
          ...prev,
          address: { ...prev.address, plz: answer },
        }));
      }
    }
    if (current.id === 'welcome' && answer === 'yes') {
      setStep(1);
    } else if (current.id === 'welcome' && answer === 'no') {
      setChatEnd(true);
    } else {
      // Find next visible question
      let next = step + 1;
      while (next < ALL_QUESTIONS.length) {
        if (isVisible(ALL_QUESTIONS[next])) break;
        next++;
      }
      if (next >= ALL_QUESTIONS.length) {
        setShowResult(true);
      } else {
        setStep(next);
      }
    }
    setInputValue('');
  };

  const renderQuestion = (question, idx) => {
    const isLast = idx === visibleSoFar.length - 1;

    switch (question.type) {
      case 'welcome':
        return isLast ? (
          <div className="chat-welcome" key={question.id}>
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
              <button className="btn btn-primary chat-action-btn" onClick={() => handleAnswer('yes')}>
                Los geht's! 🚀
              </button>
              <button className="btn btn-outline chat-action-btn" onClick={() => handleAnswer('no')}>
                Vielleicht später
              </button>
            </div>
          </div>
        ) : null;

      case 'text':
      case 'number':
      case 'date':
      case 'plz':
        return isLast ? (
          <div className="chat-question" key={question.id}>
            <div className="chat-bubble chat-bubble--bot">
              <p>{question.question}</p>
            </div>
            <div className="chat-input-area">
              <input
                className="chat-input"
                type={question.type === 'date' ? 'date' : question.type === 'number' || question.type === 'plz' ? 'text' : 'text'}
                inputMode={question.type === 'number' ? 'numeric' : question.type === 'plz' ? 'numeric' : 'text'}
                placeholder={question.placeholder || ''}
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (question.type === 'plz') {
                    const cleaned = val.replace(/\D/g, '').slice(0, 5);
                    setInputValue(cleaned);
                    if (cleaned.length === 5) {
                      const fa = findFinanzamtByPLZ(cleaned);
                      if (fa) {
                        setData((prev) => ({
                          ...prev,
                          address: { ...prev.address, plz: cleaned, city: fa.stadt, finanzamt: fa },
                        }));
                      }
                      setTimeout(() => handleAnswer(cleaned), 400);
                    }
                    return;
                  }
                  setInputValue(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) {
                    if (question.type === 'plz' && inputValue.length !== 5) return;
                    handleAnswer(inputValue.trim());
                  }
                }}
                autoFocus
              />
              <button
                className="chat-send"
                onClick={() => {
                  if (inputValue.trim()) {
                    handleAnswer(inputValue.trim());
                  }
                }}
                disabled={!inputValue.trim() || (question.type === 'plz' && inputValue.length !== 5)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M17 10L3 3l4 7-4 7 14-7z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        ) : null;

      case 'yesno':
        return isLast ? (
          <div className="chat-question" key={question.id}>
            <div className="chat-bubble chat-bubble--bot">
              <p>{question.question}</p>
            </div>
            <div className="chat-actions-row">
              <button className="chat-btn-choice chat-btn--yes" onClick={() => handleAnswer('yes')}>
                <span className="chat-btn-icon">👍</span> Ja
              </button>
              <button className="chat-btn-choice chat-btn--no" onClick={() => handleAnswer('no')}>
                <span className="chat-btn-icon">👎</span> Nein
              </button>
            </div>
          </div>
        ) : null;

      case 'choice':
        return isLast ? (
          <div className="chat-question" key={question.id}>
            <div className="chat-bubble chat-bubble--bot">
              <p>{question.question}</p>
            </div>
            <div className="chat-options-grid">
              {question.options.map((opt) => (
                <button key={opt.value} className="chat-option-btn" onClick={() => handleAnswer(opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : null;

      case 'documents':
        return isLast ? <DocumentChatStep key="docs" data={data} setData={setData} onContinue={() => {
          let n = step + 1;
          while (n < ALL_QUESTIONS.length) {
            if (isVisible(ALL_QUESTIONS[n])) break;
            n++;
          }
          setStep(n);
        }} /> : null;

      case 'finanzamt':
        return isLast ? <FinanzamtChatStep key="fa" data={data} onContinue={() => {
          let n = step + 1;
          while (n < ALL_QUESTIONS.length) {
            if (isVisible(ALL_QUESTIONS[n])) break;
            n++;
          }
          setStep(n);
        }} /> : null;

      case 'summary':
        return isLast ? <SummaryChatStep key="summary" data={data} onDone={() => setShowResult(true)} /> : null;

      default:
        return null;
    }
  };

  if (showResult) {
    return <ResultView data={data} onBack={onBack} />;
  }

  if (chatEnd) {
    return (
      <div className="wizard-chat">
        <div className="chat-header">
          <div className="container chat-header__inner">
            <button className="chat-back" onClick={onBack}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Dashboard
            </button>
            <span className="chat-brand">SteuerWert</span>
            <div />
          </div>
        </div>
        <div className="chat-body" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
          <h2>Bis bald!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Komm einfach wieder, wenn du bereit bist.</p>
          <button className="btn btn-primary" onClick={onBack} style={{ marginTop: '1.5rem' }}>Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-chat">
      <div className="chat-header">
        <div className="container chat-header__inner">
          <button className="chat-back" onClick={() => {
            // Go to previous visible question
            let prev = step - 1;
            while (prev >= 0) {
              if (isVisible(ALL_QUESTIONS[prev])) break;
              prev--;
            }
            if (prev >= 0) setStep(prev);
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="chat-brand">SteuerWert</span>
          <div className="chat-progress-text">{currentQ} von {totalVisible}</div>
        </div>
      </div>

      <div className="chat-progress-bar">
        <div className="chat-progress-fill" style={{ width: `${(currentQ / totalVisible) * 100}%` }} />
      </div>

      <div className="chat-body" ref={scrollRef}>
        <div className="container chat-container">
          {visibleSoFar.map((q, idx) => renderQuestion(q, idx))}
        </div>
      </div>
    </div>
  );
}

// ─── Document Step ───
function DocumentChatStep({ data, setData, onContinue }) {
  const fileRef = useRef(null);
  const [showList, setShowList] = useState(false);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          ...files.map((f) => ({ id: Date.now() + Math.random(), name: f.name, size: f.size, type: f.type })),
        ],
      }));
      setShowList(true);
    }
  };

  return (
    <div className="chat-question" key="docs">
      <div className="chat-bubble chat-bubble--bot">
        <p>Lade deine Belege hoch – das Finanzamt kann sie digital anfordern.</p>
        <p className="chat-hint">Lohnsteuerbescheinigung, Spendenquittungen, Handwerkerrechnungen</p>
      </div>

      <div className="chat-doc-upload" onClick={() => fileRef.current?.click()}>
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="4" width="32" height="32" rx="8" stroke="#ADEE68" strokeWidth="2" strokeDasharray="4 4"/>
          <path d="M20 14v12M14 20h12" stroke="#ADEE68" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>Klicke zum Hochladen</p>
        <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.png" style={{ display: 'none' }} onChange={handleUpload} />
      </div>

      {showList && data.documents.length > 0 && (
        <div className="chat-doc-list">
          {data.documents.map((d) => (
            <div key={d.id} className="chat-doc-item">
              <span>📄 {d.name}</span>
              <span className="chat-doc-size">({(d.size / 1024).toFixed(0)} KB)</span>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-primary" onClick={onContinue} style={{ marginTop: '1rem', width: '100%' }}>
        {data.documents.length > 0 ? `Weiter (${data.documents.length} Dateien)` : 'Weiter ohne Dateien'}
      </button>
    </div>
  );
}

// ─── Finanzamt Step ───
function FinanzamtChatStep({ data, onContinue }) {
  const fa = data.address.finanzamt;

  if (!fa) {
    return (
      <div className="chat-question">
        <div className="chat-bubble chat-bubble--bot">
          <p>⚠️ Wir konnten kein Finanzamt zu deiner PLZ finden. Bitte überprüfe deine Angaben.</p>
        </div>
        <button className="btn btn-primary" onClick={onContinue} style={{ width: '100%' }}>Trotzdem fortfahren</button>
      </div>
    );
  }

  return (
    <div className="chat-question">
      <div className="chat-bubble chat-bubble--bot">
        <p>Deine Daten werden an dieses Finanzamt gesendet:</p>
      </div>
      <div className="chat-fa-card">
        <div className="chat-fa-icon">🏛️</div>
        <div className="chat-fa-info">
          <strong>{fa.name}</strong>
          <p>Finanzamt-Nr: <code>{fa.nummer}</code></p>
          <p>{fa.adresse}</p>
          <p>📞 {fa.telefon}</p>
        </div>
      </div>
      <div className="chat-bubble chat-bubble--bot">
        <p>Stimmt das? Dann können wir zusammenfassen!</p>
      </div>
      <button className="btn btn-primary" onClick={onContinue} style={{ width: '100%' }}>
        Ja, weiter zur Zusammenfassung
      </button>
    </div>
  );
}

// ─── Summary Step ───
function SummaryChatStep({ data, onDone }) {
  const fa = data.address.finanzamt;
  const salary = parseFloat(data.income.salary) || 0;
  const estimatedRefund = Math.max(0, Math.round(salary * 0.12 + 1000));
  const p = data.personal;
  const inc = data.income;
  const exp = data.expenses;
  const sp = data.special;
  const he = data.health;

  return (
    <div className="chat-question">
      <div className="chat-bubble chat-bubble--bot">
        <p>Hier ist deine Zusammenfassung. Alles richtig?</p>
      </div>

      <div className="chat-summary-card">
        <div className="chat-summary-section">
          <h4>👤 Persönlich</h4>
          <p>{p.firstName} {p.lastName} • Geb. {p.birthDate}</p>
          <p>SK {inc.taxClass} • {p.maritalStatus === 'single' ? 'Ledig' : p.maritalStatus} • {p.children} Kind(er)</p>
        </div>
        <div className="chat-summary-section">
          <h4>📍 Adresse</h4>
          <p>{data.address.street}, {data.address.plz} {data.address.city}</p>
          {fa && <p className="chat-summary-fa">🏛️ {fa.name}</p>}
        </div>
        {salary > 0 && (
          <div className="chat-summary-section">
            <h4>💰 Einkünfte</h4>
            <p>{salary.toLocaleString('de-DE')} € {inc.otherIncome ? `+ ${inc.otherIncome} €` : ''}</p>
          </div>
        )}
        {exp.hasExpenses === 'yes' && (
          <div className="chat-summary-section">
            <h4>📄 Werbungskosten</h4>
            <p>{exp.commuting ? `${exp.commuting} km Fahrt • ` : ''}{exp.homeOffice ? `${exp.homeOffice} Tage Home-Office` : ''}</p>
          </div>
        )}
      </div>

      <div className="chat-refund-teaser">
        <span className="chat-refund-label">Voraussichtliche Erstattung</span>
        <span className="chat-refund-value">{estimatedRefund.toLocaleString('de-DE')} €</span>
        <span className="chat-refund-note">Berechnung durch das Finanzamt ist verbindlich</span>
      </div>

      <div className="chat-actions-row">
        <button className="btn btn-primary" onClick={onDone} style={{ flex: 1 }}>
          ✅ Absenden & XML exportieren
        </button>
      </div>
    </div>
  );
}

// ─── Result View ───
function ResultView({ data, onBack }) {
  const fa = data.address.finanzamt;
  const salary = parseFloat(data.income.salary) || 0;
  const estimatedRefund = Math.max(0, Math.round(salary * 0.12 + 1000));

  const downloadXML = () => {
    const p = data.personal;
    const a = data.address;
    const inc = data.income;
    const exp = data.expenses;
    const sp = data.special;
    const he = data.health;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ELSTER version="1.0">
  <Kopf>
    <HerstellerID>steuerwert_app</HerstellerID>
    <Verarbeitungsdatum>${new Date().toISOString().split('T')[0]}</Verarbeitungsdatum>
  </Kopf>
  <Steuererklaerung Jahr="2025">
    <Steuerpflichtiger>
      <Vorname>${p.firstName}</Vorname>
      <Nachname>${p.lastName}</Nachname>
      <Geburtsdatum>${p.birthDate}</Geburtsdatum>
      <Steuerklasse>${inc.taxClass}</Steuerklasse>
      <Familienstand>${p.maritalStatus}</Familienstand>
      <Kinder>${p.children}</Kinder>
      <Strasse>${a.street}</Strasse>
      <PLZ>${a.plz}</PLZ>
      <Ort>${a.city}</Ort>
    </Steuerpflichtiger>
    <Finanzamt>${fa?.nummer || ''}</Finanzamt>
    <Einkuenfte Brutto="${salary}" Weitere="${inc.otherIncome || 0}" />
    <Werbungskosten Fahrt="${exp.commuting || 0}" HomeOffice="${exp.homeOffice || 0}" Arbeitsmittel="${exp.workMaterials || 0}" Fortbildung="${exp.training || 0}" />
    <Sonderausgaben Spenden="${sp.donations || 0}" Handwerker="${sp.craftsmen || 0}" Haushalt="${sp.householdServices || 0}" />
    <Vorsorge Krankenversicherung="${he.healthInsurance || 0}" Pflege="${he.nursingInsurance || 0}" Rente="${he.pensionContributions || 0}" />
    <Erstattung Voraussichtlich="${estimatedRefund}" />
  </Steuererklaerung>
</ELSTER>`;

    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `steuererklaerung-2025-${p.lastName}.xml`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="wizard-chat">
      <div className="chat-header">
        <div className="container chat-header__inner">
          <button className="chat-back" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dashboard
          </button>
          <span className="chat-brand">SteuerWert</span>
          <div />
        </div>
      </div>
      <div className="chat-body" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div className="chat-result">
          <div className="chat-result-icon">🎉</div>
          <h2 className="chat-result-title">Geschafft!</h2>
          <div className="chat-result-refund">
            <span className="chat-result-label">Voraussichtliche Erstattung</span>
            <span className="chat-result-amount">{estimatedRefund.toLocaleString('de-DE')} €</span>
          </div>
          {fa && (
            <div className="chat-result-fa">
              <p>🏛️ {fa.name} (FA-Nr. {fa.nummer})</p>
              <p>📬 {fa.adresse}</p>
            </div>
          )}
          <button className="btn btn-primary" onClick={downloadXML} style={{ width: '100%', marginBottom: '0.75rem' }}>
            📥 ELSTER-XML exportieren
          </button>
          <p className="chat-result-hint">
            Importiere die XML-Datei in dein ELSTER-Portal unter <strong>www.elster.de</strong> und sende sie an dein Finanzamt.
          </p>
          <button className="btn btn-outline" onClick={onBack} style={{ width: '100%' }}>
            Zum Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
