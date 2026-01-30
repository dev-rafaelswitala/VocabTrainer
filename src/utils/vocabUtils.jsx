export function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function pickUniqueWords(words, amount) {
  return shuffleArray(words).slice(0, amount);
}
