import test from 'ava';
import { WordleAssistant, Guess } from './wordle-assistant.js';

const dictionary = [
  'banks',
  'boast',
  'broad',
  'bzzzz',
  'coast',
  'toads',
  'toast',
  'tiger',
];

test('suggests all words', (t) => {
  const assist = new WordleAssistant(5);
  t.deepEqual(assist.suggest(dictionary), dictionary);
});


test('suggests only words that start with b', (t) => {
  const assist = new WordleAssistant(5)
    .guess(new Guess('bxxxx', 'gxxxx'));

  t.deepEqual(assist.suggest(dictionary), [
    'banks',
    'boast',
    'broad',
    'bzzzz',
  ]);
});

test('ignores words that have already been guessed and were incorrect', (t) => {
  const assist = new WordleAssistant(5)
    .guess(new Guess('toast', 'xgggg'))
    .guess(new Guess('coast', 'xgggg'))

  t.deepEqual(assist.suggest(dictionary), [
    'boast',
  ]);
});
