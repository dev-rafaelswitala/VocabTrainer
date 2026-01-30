import { useState } from "react";

export default function Trainer({ words, onFinish }) {
  const [index, setIndex] = useState(0);

  function next() {
    if (index + 1 < words.length) {
      setIndex(index + 1);
    } else {
      onFinish();
    }
  }

  return (
    <div className="card">
      <div className="progress">
        Vokabel {index + 1} von {words.length}
      </div>

      <h1>{words[index]}</h1>

      <button onClick={next}>Weiter</button>
    </div>
  );
}
