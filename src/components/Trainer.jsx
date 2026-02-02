import { useState } from "react";

export default function Trainer({ words, onFinish }) {
  const [index, setIndex] = useState(0);

  function next() {
    if (index + 1 < words.length) {
      setIndex(index + 1);
    } else {
      // Training is finished, send back the words in the order they were played
      onFinish(words);
    }
  }

  function handleCancel() {
    // Bring user zurück zur Übersicht
    onFinish(words);
  }

  return (
    <div className="card trainer-card">
      <div className="progress">
        Vokabel {index + 1} von {words.length}
      </div>

      <h1>{words[index]}</h1>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={next} className="btn-primary">Weiter</button>
        <button onClick={handleCancel} className="btn-secondary">Abbrechen</button>
      </div>
    </div>
  );
}
