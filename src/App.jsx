import { useState } from "react";
import Setup from "./components/Setup";
import Trainer from "./components/Trainer";
import ManageUnits from "./components/ManageUnits";
import { shuffleArray, pickUniqueWords } from "./utils/vocabUtils";
import "./App.css";

export default function App() {
  const [words, setWords] = useState(null);
  const [mode, setMode] = useState("trainer"); // "trainer" oder "manage"

  async function startTrainer(config) {
    const res = await fetch(`/data/${config.unit}`);
    const data = await res.json();

    let vocab = data.words;
    if (config.random) vocab = shuffleArray(vocab);
    if (config.amount) vocab = pickUniqueWords(vocab, config.amount);

    setWords(vocab);
  }

  return (
    <div className="app">
      <div className="main-content">
        {mode === "trainer" && !words && <Setup onStart={startTrainer} />}
        {mode === "trainer" && words && (
          <Trainer words={words} onFinish={() => setWords(null)} />
        )}
        {mode === "manage" && <ManageUnits />}
      </div>

      {/* Button immer am unteren Rand */}
      <div className="bottom-button">
        <button onClick={() => setMode("manage")}>Einheiten verwalten</button>
      </div>
    </div>
  );
}
