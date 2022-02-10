export class Guess {
  constructor(word, result) {
    this.word = word.toLowerCase();
    this.result = result;

    this.knownPositionLetters = this.word.split('').map((letter, index) => {
      if (this.result[index] !== 'g') return null;
      return letter;
    });

    this.knownMispositionLetters = this.word.split('').map((letter, index) => {
      if (this.result[index] !== 'y') return null;
      return letter;
    });

    this.knownIncludedLetters = this.word.split('').map((letter, index) => {
      if (this.result[index] === 'd') return null;
      return letter;
    }).filter(Boolean);

    this.knownExcludedLetters = this.word.split('').map((letter, index) => {
      if (this.result[index] !== 'd') return null;
      return letter;
    }).filter(Boolean);
  }
}

Guess.fromArg = (arg) => {
  const [word, result] = arg.split('.');
  return new Guess(word, result);
}

export class WordleAssistant {
  constructor(wordSize = 5, carryOver = {}, guesses = 0) {
    this.wordSize = wordSize;
    this.knownPositionLetters = carryOver.knownPositionLetters || Array.from({ length: this.wordSize }, () => null);
    this.knownMispositionLetters = carryOver.knownMispositionLetters || Array.from({ length: this.wordSize }, () => []);
    this.knownIncludedLetters = carryOver.knownIncludedLetters || [];
    this.knownExcludedLetters = (carryOver.knownExcludedLetters || []).filter;
    this.words = carryOver.words || [];
    this.guesses = guesses;
  }

  guess(guess) {
    return new WordleAssistant(
      this.wordSize,
      {
        knownPositionLetters: this.knownPositionLetters.map((kpl, index) => guess.knownPositionLetters[index] || kpl),
        knownMispositionLetters: this.knownMispositionLetters.map((letters, index) => letters.concat(guess.knownMispositionLetters[index]).filter(Boolean)),
        knownIncludedLetters: Array.from(new Set(this.knownIncludedLetters.concat(guess.knownIncludedLetters))),
        knownExcludedLetters: Array.from(new Set(this.knownExcludedLetters.concat(guess.knownExcludedLetters))),
        words: this.words.concat(guess.word),
      },
      this.guesses + 1,
    );
  }

  suggest(dictionary) {
    const list = dictionary
      .map(word => word.toLowerCase())
      .filter(this.filterWithKnownPositionLetters.bind(this))
      .filter(this.filterWithLetters.bind(this))
      .filter(this.filterWithMispositionedLetters.bind(this));

    return list.slice(0, 20);
  }

  filterWithKnownPositionLetters(word) {
    return this.knownPositionLetters.every((letter, index) => letter ? letter === word[index] : true);
  }

  filterWithLetters(word) {
    const containsIncludedLetters = this.knownIncludedLetters.every((letter) => word.includes(letter));
    const containsExcludedLetters = this.knownExcludedLetters.some((letter) => word.includes(letter));
    return containsIncludedLetters && !containsExcludedLetters;
  }

  filterWithMispositionedLetters(word) {
    return this.knownPositionLetters.some((letter, index) => letter ? letter !== word[index] : true);
  }
}
