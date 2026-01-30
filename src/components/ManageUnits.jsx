import { useEffect, useState } from "react";

export default function ManageUnits() {
  const [mode, setMode] = useState("create"); // "create" oder "edit"
  const [unitName, setUnitName] = useState("");
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [existingUnits, setExistingUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");

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
    <div className="card">
      <h2>Einheiten verwalten</h2>

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

      {/* Wörterliste */}
      <div className="word-list">
        <h3>Wörter:</h3>
        {words.map((word, index) => (
          <div key={index} className="word-item" style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <input
              type="text"
              value={word}
              onChange={e => updateWord(index, e.target.value)}
              style={{ flex: 1, marginRight: "5px" }}
            />
            <button onClick={() => removeWord(index)}>✖</button>
          </div>
        ))}
      </div>

      <button onClick={saveUnit} disabled={!unitName || words.length === 0}>
        Speichern
      </button>
    </div>
  );
}
