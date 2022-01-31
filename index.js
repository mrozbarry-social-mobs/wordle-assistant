const fs = require('fs/promises');

const args = process.argv.slice(2);

const getArg = (fn, fallback = '') => {
  return args.find(fn) || fallback;
};

const known = args[0].toLowerCase().split('');
const hits = getArg((a => a.startsWith('--hit=')), '--hit=').split('=')[1].toLowerCase().split('');
const misses = getArg((a => a.startsWith('--miss=')), '--miss=').split('=')[1].toLowerCase().split('');

fs.readFile('./five-letter-words.txt')
  .then((data) => {
    const letterPositionCheckers = known.map((letter, index) => {
      return letter === '_'
        ? () => true
        : (word) => word[index] === letter;
    });

    const words = data.toString().split('\n')
      .filter((word) => letterPositionCheckers.every((checker) => checker(word)))
      .filter((word) => hits.every((hitLetter) => word.includes(hitLetter)))
      .filter((word) => !misses.some((missLetter) => word.includes(missLetter)));

    console.log(words.join('\n'));
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });
