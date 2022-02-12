import fs from 'fs/promises';
import { bgGreen, bgYellowBright, whiteBright, black, gray } from 'colorette';
import { WordleAssistant, Guess, results } from './wordle-assistant.js';

const guesses = process.argv.slice(2);
const columns = 10;

const resultToColor = {
  [results.correct]: (letter) => bgGreen(whiteBright(letter)),
  [results.letterExists]: (letter) => bgYellowBright(black(letter)),
  [results.incorrect]: (letter) => gray(letter),
};

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

    console.log('Guesses:');
    assistant.guesses.forEach((guess) => {
      const letters = guess.word
        .split('')
        .map((letter, index) => {
          const result = guess.result[index];
          return resultToColor[result](` ${letter.toUpperCase()} `);
        });
      console.log(' ' + letters.join(''));
    });
    console.log();

    const suggestions = assistant.suggest(words);

    console.log(`Possible words (${suggestions.length}):`);

    suggestions
      .sort()
      .reduce((lines, item, index) => {
        if (index % columns === 0) lines.push([]);
        lines[lines.length - 1].push(item);
        return lines;
      }, [])
      .forEach((line) => console.log(' ' + line.join('   ')));
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });
