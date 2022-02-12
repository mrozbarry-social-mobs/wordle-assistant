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

    this.includedLetters = this.word.split('').map((letter, index) => {
      if (this.result[index] === results.incorrect) return null;
      return letter;
    }).filter(Boolean);
  }
}

Guess.fromArg = (arg) => {
  const [word, result] = arg.split('.');
  return new Guess(word, result);
}

const unique = arr => Array.from(new Set(arr));

export class WordleAssistant {
  constructor(wordSize = 5, carryOver = {}) {
    this.wordSize = wordSize;
    this.wordPartial = carryOver.wordPartial || Array.from({ length: this.wordSize }, () => null);
    this.lettersNotInPosition = carryOver.lettersNotInPosition || Array.from({ length: this.wordSize }, () => []);
    this.excludedLetters = unique(carryOver.excludedLetters || []);
    this.includedLetters = unique(carryOver.includedLetters || []);
    this.guesses = carryOver.guesses || [];
  }

  guess(guess) {
    const wordPartial = this.wordPartial
      .map((kpl, index) => guess.wordPartial[index] || kpl);

    const lettersNotInPosition = this.lettersNotInPosition
      .map((letters, index) => (
        letters.concat(guess.lettersNotInPosition[index]).filter(Boolean)
      ));

    const includedLetters = this.includedLetters
      .concat(guess.includedLetters)
      .filter(Boolean);

    const excludedLetters = this.excludedLetters
      .concat(guess.excludedLetters)
      .filter((letter) => Boolean(letter) && !includedLetters.includes(letter));

    const guesses = this.guesses.concat(guess);

    return new WordleAssistant(
      this.wordSize,
      {
        wordPartial,
        lettersNotInPosition,
        excludedLetters,
        includedLetters,
        guesses,
      },
    );
  }

  suggest(dictionary) {
    return dictionary
      .map(word => word.toLowerCase())
      .filter(this.mustMatchWordPartial.bind(this))
      .filter(this.cannotBeAWordAlreadyGuessed.bind(this))
      .filter(this.cannotHaveExcludedLetters.bind(this))
      .filter(this.mustHaveAllIncludedLetters.bind(this))
      .filter(this.cannotHaveLettersInIncorrectPositions.bind(this));
  }

  cannotBeAWordAlreadyGuessed(word) {
    return !this.guesses.find(g => g.word === word);
  }

  mustMatchWordPartial(word) {
    return this.wordPartial.every((letter, index) => (
      letter ? letter === word[index] : true
    ));
  }

  mustHaveAllIncludedLetters(word) {
    return this.includedLetters.every((letter) => word.includes(letter));
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
