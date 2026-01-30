import { useEffect, useState } from "react";

export default function Setup({ onStart }) {
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState("");
  const [random, setRandom] = useState(true);
  const [amount, setAmount] = useState("");

  // Einheiten vom Node-Backend laden
  useEffect(() => {
    fetch("/api/units")
      .then(res => res.json())
      .then(files => {
        setUnits(files);
        if (files.length > 0) {
          setUnit(files[0]); // erste Einheit automatisch auswählen
        }
      })
      .catch(err => {
        console.error("Fehler beim Laden der Einheiten:", err);
      });
  }, []);

  function handleStart() {
    if (!unit) return;

    onStart({
      unit,
      random,
      amount: amount ? Number(amount) : null
    });
  }

 return (
    <div className="card">
      <h2>VocabTrainer</h2>

      <div className="form-group">
        <label>Einheit wählen</label>
        <select value={unit} onChange={e => setUnit(e.target.value)}>
          {units.map(u => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          checked={random}
          onChange={() => setRandom(!random)}
        />
        <span>Zufällige Reihenfolge</span>
      </div>

      <div className="form-group">
        <label>Anzahl Vokabeln (optional)</label>
        <input
          type="number"
          placeholder="z. B. 10"
          onChange={e => setAmount(e.target.value)}
        />
      </div>

      <button onClick={handleStart} disabled={!unit}>
        Start
      </button>
    </div>
  );
}
