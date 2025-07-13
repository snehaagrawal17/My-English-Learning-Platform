export default function(words) {
  return words.map(word => ({
    word,
    score: Math.floor(Math.random() * 10) + 1
  }));
}
