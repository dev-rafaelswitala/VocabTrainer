import { useState } from "react";
import Setup from "./components/Setup";
import Trainer from "./components/Trainer";
import Results from "./components/Results";
import ManageUnits from "./components/ManageUnits";
import PlayedUnits from "./components/PlayedUnits";
import { shuffleArray, pickUniqueWords } from "./utils/vocabUtils";
import "./App.css";

export default function App() {
  const [words, setWords] = useState(null);
  const [results, setResults] = useState(null); // { wordList, config }
  const [mode, setMode] = useState("trainer"); // "trainer", "manage", "played"

  async function startTrainer(config) {
    // config.units: array of filenames
    const all = [];
    for (const u of config.units) {
      try {
        const res = await fetch(`/data/${u}`);
        const data = await res.json();
        if (Array.isArray(data.words)) all.push(...data.words);
      } catch (e) {
        console.error("Fehler beim Laden von", u, e);
      }
    }

    let vocab = all;
    if (config.random) vocab = shuffleArray(vocab);
    if (config.amount) vocab = pickUniqueWords(vocab, config.amount);

    setWords(vocab);
  }

  function handleTrainerFinish(wordList) {
    // wordList contains the words in the order they were played
    setResults({ wordList });
    setWords(null);
  }

  async function handleSessionSave(wordList) {
    // Get next ID
    const idRes = await fetch("/api/nextId");
    const { nextId } = await idRes.json();

    // Get current date and time
    const now = new Date();
    const day = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}_${String(now.getDate()).padStart(2, "0")}`;
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} Uhr`;

    // Save session
    try {
      const res = await fetch("/api/saveSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: nextId,
          day,
          time,
          words: wordList
        })
      });
      const data = await res.json();
      alert("Lerneinheit erfolgreich gespeichert!");
      setResults(null);
      setMode("trainer");
    } catch (e) {
      console.error("Fehler beim Speichern:", e);
      alert("Fehler beim Speichern der Lerneinheit");
    }
  }

  return (
    <div className="app">
      <div className="main-content">
        {mode === "trainer" && !words && !results && (
          <Setup onStart={startTrainer} onShowPlayed={() => setMode("played")} onManage={() => setMode("manage")} />
        )}
        {mode === "trainer" && words && (
          <Trainer words={words} onFinish={handleTrainerFinish} />
        )}
        {mode === "trainer" && results && (
          <Results
            words={results.wordList}
            onFinish={() => {
              setResults(null);
              setMode("trainer");
            }}
            onSave={() => handleSessionSave(results.wordList)}
          />
        )}
        {mode === "manage" && <ManageUnits onBack={() => setMode("trainer")} />}
        {mode === "played" && <PlayedUnits onBack={() => setMode("trainer")} />}
      </div>

      {/* Button immer am unteren Rand */}
      <div className="bottom-button">
        {mode === "manage" && (
          <button onClick={() => setMode("trainer")} className="btn-secondary">
            ← Zurück zur Startseite
          </button>
        )}
      </div>
    </div>
  );
}

