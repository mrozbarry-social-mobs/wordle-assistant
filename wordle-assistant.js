export const results = {
  correct: 'g',
  letterExists: 'y',
  incorrect: 'x',
};

export class Guess {
  constructor(word, result) {
    this.word = word.toLowerCase();
    this.result = result;

    this.wordPartial = this.word.split('').map((letter, index) => {
      if (this.result[index] !== results.correct) return null;
      return letter;
    });

    this.lettersNotInPosition = this.word.split('').map((letter, index) => {
      if (this.result[index] === results.correct) return null;
      return letter;
    });

    this.excludedLetters = this.word.split('').map((letter, index) => {
      if (this.result[index] !== results.incorrect) return null;
      return letter;
    }).filter(Boolean);
  }
}

Guess.fromArg = (arg) => {
  const [word, result] = arg.split('.');
  return new Guess(word, result);
}

export class WordleAssistant {
  constructor(wordSize = 5, carryOver = {}) {
    this.wordSize = wordSize;
    this.wordPartial = carryOver.wordPartial || Array.from({ length: this.wordSize }, () => null);
    this.lettersNotInPosition = carryOver.lettersNotInPosition || Array.from({ length: this.wordSize }, () => []);
    this.excludedLetters = (carryOver.excludedLetters || []);
    this.words = carryOver.words || [];
    this.guesses = carryOver.guesses || [];
  }

  guess(guess) {
    const wordPartial = this.wordPartial
      .map((kpl, index) => guess.wordPartial[index] || kpl);

    const lettersNotInPosition = this.lettersNotInPosition
      .map((letters, index) => (
        letters.concat(guess.lettersNotInPosition[index]).filter(Boolean)
      ));

    const goodLetters = Array.from(
      new Set(wordPartial.concat(lettersNotInPosition).filter(Boolean))
    );

    const excludeLetters = this.excludedLetters
      .concat(guess.excludedLetters)
      .filter((letter) => Boolean(letter) && !goodLetters.includes(letter));

    return new WordleAssistant(
      this.wordSize,
      {
        wordPartial,
        lettersNotInPosition,
        excludedLetters: Array.from(new Set(excludeLetters)),
        words: this.words.concat(guess.word),
        guesses: this.guesses.concat(guess),
      },
    );
  }

  suggest(dictionary) {
    return dictionary
      .map(word => word.toLowerCase())
      .filter(this.mustMatchWordPartial.bind(this))
      .filter(this.cannotBeAWordAlreadyGuessed.bind(this))
      .filter(this.cannotHaveExcludedLetters.bind(this))
      .filter(this.cannotHaveLettersInIncorrectPositions.bind(this));
  }

  cannotBeAWordAlreadyGuessed(word) {
    return !this.words.includes(word);
  }

  mustMatchWordPartial(word) {
    return this.wordPartial.every((letter, index) => (
      letter ? letter === word[index] : true
    ));
  }

  cannotHaveExcludedLetters(word) {
    return !this.excludedLetters.some((letter) => word.includes(letter));
  }

  cannotHaveLettersInIncorrectPositions(word) {
    return !this.lettersNotInPosition.some((letters, index) => {
      return letters.length > 0
        ? letters.includes(word[index])
        : false
    });
  }
}
