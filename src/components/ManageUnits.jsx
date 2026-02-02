import { useEffect, useState, useRef } from "react";

export default function ManageUnits({ onBack }) {
  const [mode, setMode] = useState("create"); // "create" oder "edit"
  const [unitName, setUnitName] = useState("");
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [existingUnits, setExistingUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const sidebarRef = useRef(null);

  // Vorhandene Einheiten laden
  useEffect(() => {
    fetch("/api/units")
      .then(res => res.json())
      .then(files => setExistingUnits(files))
      .catch(err => console.error("Fehler beim Laden der Einheiten:", err));
  }, []);

  // Ausgewählte Einheit zum Bearbeiten laden
  useEffect(() => {
    if (mode === "edit" && selectedUnit) {
      fetch(`/data/${selectedUnit}`)
        .then(res => res.json())
        .then(data => {
          setUnitName(data.name);
          setWords(data.words);
        })
        .catch(err => console.error("Fehler beim Laden der Datei:", err));
    }
  }, [mode, selectedUnit]);

  // Scroll to bottom if words exceed visible area (keep newest visible)
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    // small timeout to ensure rendering
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 0);
  }, [words.length]);

  function addWord() {
    if (newWord.trim() === "") return;
    setWords([...words, newWord.trim()]);
    setNewWord("");
  }

  function removeWord(index) {
    setWords(words.filter((_, i) => i !== index));
  }

  function updateWord(index, value) {
    const updated = [...words];
    updated[index] = value;
    setWords(updated);
  }

  function saveUnit() {
    if (!unitName) return alert("Bitte einen Namen eingeben!");
    if (words.length === 0) return alert("Bitte mindestens ein Wort hinzufügen!");

    const payload = { name: unitName, words };
    const filename = `${unitName}.json`;

    fetch("/api/saveUnit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, data: payload })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Gespeichert!");
        if (mode === "create") {
          setUnitName("");
          setWords([]);
          setNewWord("");
        }
        // Update Liste der Einheiten
        fetch("/api/units")
          .then(res => res.json())
          .then(files => setExistingUnits(files));
      })
      .catch(err => console.error("Fehler beim Speichern:", err));
  }

  return (
    <div className="card manage-units">
      <button onClick={onBack} className="btn-back">
        ← Zurück
      </button>
      
      <h2>Einheiten verwalten</h2>

      <div className="manage-row">
        <div className="manage-main">
          {/* Modus auswählen */}
          <div className="form-group">
            <label>Modus:</label>
            <select value={mode} onChange={e => setMode(e.target.value)}>
              <option value="create">Neue Einheit erstellen</option>
              <option value="edit">Bestehende bearbeiten</option>
            </select>
          </div>

          {/* Einheit auswählen im Bearbeiten-Modus */}
          {mode === "edit" && (
            <div className="form-group">
              <label>Einheit auswählen</label>
              <select
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
              >
                <option value="">-- Wähle eine Einheit --</option>
                {existingUnits.map(u => (
                  <option key={u} value={u}>
                    {u.replace(".json", "")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name der Einheit */}
          <div className="form-group">
            <label>Name der Einheit</label>
            <input
              type="text"
              value={unitName}
              onChange={e => setUnitName(e.target.value)}
            />
          </div>

          {/* Neue Wörter hinzufügen */}
          <div className="form-group">
            <label>Wörter hinzufügen</label>
            <input
              type="text"
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addWord()}
            />
            <button onClick={addWord}>Hinzufügen</button>
          </div>

          <button onClick={saveUnit} disabled={!unitName || words.length === 0}>
            Speichern
          </button>
        </div>

        <div className="manage-sidebar">
          <h3>Wörter:</h3>
          <div className="word-list-sidebar" ref={sidebarRef}>
            {words.map((word, index) => (
              <div key={index} className="word-item-sidebar">
                <input
                  type="text"
                  value={word}
                  onChange={e => updateWord(index, e.target.value)}
                />
                <button onClick={() => removeWord(index)}>✖</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
