import { useState } from "react";
import Setup from "./components/Setup";
import Trainer from "./components/Trainer";
import { shuffleArray, pickUniqueWords } from "./utils/vocabUtils";
import "./App.css";

export default function App() {
  const [words, setWords] = useState(null);

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
      {!words && <Setup onStart={startTrainer} />}
      {words && <Trainer words={words} onFinish={() => setWords(null)} />}
    </div>
  );
}
