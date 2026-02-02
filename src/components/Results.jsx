import { useState } from "react";

export default function Results({ words, onFinish, onSave }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSave() {
    setLoading(true);
    // Call onSave which will handle the API call and return to home
    onSave();
  }

  return (
    <div className="card results-card">
      <h2>Übersicht der gespielten Vokabeln</h2>

      {!showConfirm ? (
        <>
          <p className="results-prompt">
            Möchtest du eine Übersicht aller Vokabeln in der Reihenfolge sehen, die eben abgelaufen ist?
          </p>
          <div className="button-group">
            <button onClick={onFinish} className="btn-secondary">
              Nein
            </button>
            <button onClick={() => setShowConfirm(true)} className="btn-primary">
              Ja
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="words-list-results">
            {words.map((word, index) => (
              <div key={index} className="word-result-item">
                <span className="result-index">{index + 1}</span>
                <span className="result-word">{word}</span>
              </div>
            ))}
          </div>

          <div className="button-group">
            <button onClick={onFinish} className="btn-secondary">
              Beenden
            </button>
            <button onClick={handleSave} className="btn-primary" disabled={loading}>
              {loading ? "Wird gespeichert..." : "Einheit speichern"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
