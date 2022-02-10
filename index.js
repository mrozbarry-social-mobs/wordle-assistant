import fs from 'fs/promises';
import { WordleAssistant, Guess } from './wordle-assistant.js';

const guesses = process.argv.slice(2);

fs.readFile('./five-letter-words.txt')
  .then((data) => {
    const words = data
      .toString()
      .split('\n')
      .filter(Boolean)
      .map(w => w.toLowerCase());

    const assistant = guesses.reduce((wordle, guess) => {
      return wordle.guess(Guess.fromArg(guess));
    }, new WordleAssistant(5));

    console.log('Word list:\n', assistant.suggest(words).join('\n'));
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });
