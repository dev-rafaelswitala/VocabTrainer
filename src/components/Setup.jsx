import { useEffect, useState } from "react";

export default function Setup({ onStart, onShowPlayed, onManage }) {
  const [units, setUnits] = useState([]);
  const [selected, setSelected] = useState([]);
  const [random, setRandom] = useState(true);
  const [amount, setAmount] = useState("");

  // Einheiten vom Node-Backend laden
  useEffect(() => {
    fetch("/api/units")
      .then(res => res.json())
      .then(files => {
        setUnits(files);
        if (files.length > 0) {
          setSelected([files[0]]);
        }
      })
      .catch(err => {
        console.error("Fehler beim Laden der Einheiten:", err);
      });
  }, []);

  function toggleUnit(u) {
    setSelected(prev => (prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u]));
  }

  function handleStart() {
    if (!selected || selected.length === 0) return;

    onStart({
      units: selected,
      random,
      amount: amount ? Number(amount) : null
    });
  }

  function displayName(u) {
    return u.replace(/\.json$/i, "");
  }

  return (
    <div className="card setup-card">
      <h2>VocabTrainer</h2>

      <div className="form-group">
        <label>Einheiten wählen</label>
        <div className="units-grid-container">
          <div className="units-grid-6col">
            {units.map(u => (
              <button
                key={u}
                type="button"
                className={"unit-item " + (selected.includes(u) ? "selected" : "")}
                onClick={() => toggleUnit(u)}
              >
                {displayName(u)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          checked={random}
          onChange={() => setRandom(!random)}
        />
        <span>Zufällige Reihenfolge</span>
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label>Anzahl Vokabeln (optional)</label>
          <input
            type="number"
            placeholder="z. B. 10"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="input-amount"
          />
        </div>
      </div>

      <div className="setup-button-group">
        <button onClick={handleStart} disabled={selected.length === 0} className="btn-primary">
          Start
        </button>
        <button onClick={onManage} className="btn-secondary-small">
          Verwalten
        </button>
        <button onClick={onShowPlayed} className="btn-secondary">
          Einheiten
        </button>
      </div>
    </div>
  );
}
