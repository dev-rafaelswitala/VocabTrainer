import { useEffect, useState } from "react";

export default function PlayedUnits({ onBack }) {
  const [sessions, setSessions] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then(res => res.json())
      .then(files => {
        setSessions(files);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fehler beim Laden der Sessions:", err);
        setLoading(false);
      });
  }, []);

  function handleSearch() {
    if (!searchId.trim()) return;

    const padded = searchId.trim().padStart(4, "0");
    fetch(`/api/sessions/${padded}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert("Session nicht gefunden");
          setSelectedSession(null);
        } else {
          setSelectedSession(data);
        }
      })
      .catch(err => {
        console.error("Fehler:", err);
        alert("Session nicht gefunden");
        setSelectedSession(null);
      });
  }

  return (
    <div className="card played-units-card">
      <h2>Gespeicherte Lerneinheiten</h2>

      {selectedSession ? (
        <>
          <button onClick={() => setSelectedSession(null)} className="btn-back">
            ← Zurück zur Liste
          </button>

          <div className="session-detail">
            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{selectedSession.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Datum:</span>
              <span className="detail-value">{selectedSession.day}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Uhrzeit:</span>
              <span className="detail-value">{selectedSession.time}</span>
            </div>

            <h3>Vokabeln in Reihenfolge:</h3>
            <div className="words-list-played">
              {selectedSession.words.map((word, index) => (
                <div key={index} className="word-played-item">
                  <span className="played-index">{index + 1}</span>
                  <span className="played-word">{word}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="search-section">
            <h3>Nach ID suchen</h3>
            <div className="search-row">
              <input
                type="text"
                placeholder="z. B. 0117"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                maxLength="4"
              />
              <button onClick={handleSearch} className="btn-search">
                Suchen
              </button>
            </div>
          </div>

          <h3>Alle Sessions ({sessions.length})</h3>
          {loading ? (
            <p>Wird geladen...</p>
          ) : sessions.length === 0 ? (
            <p className="empty-text">Noch keine Lerneinheiten gespeichert.</p>
          ) : (
            <div className="sessions-grid">
              {sessions.map(filename => {
                const id = filename.replace(".json", "");
                return (
                  <button
                    key={filename}
                    className="session-item"
                    onClick={() => {
                      fetch(`/api/sessions/${id}`)
                        .then(res => res.json())
                        .then(data => setSelectedSession(data));
                    }}
                  >
                    {id}
                  </button>
                );
              })}
            </div>
          )}

          <button onClick={onBack} className="btn-secondary" style={{ marginTop: 24 }}>
            Zurück zur Startseite
          </button>
        </>
      )}
    </div>
  );
}
