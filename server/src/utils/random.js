export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/** Generates a 6-char uppercase room code */
export function roomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
