# Wordle Assistant

Output a list of 5-letter words based on known positions, known hit letters, and known missing letters.

## Usage

```bash
npm start -- <known letters> --hit=<letters that must be in word, but unknown position> --miss=<letters that cannot be in the word>
# example to solve maybe 'mouse'
npm start -- "mo___" --miss="t" --hit="s"
```

## Credit

 - 5-letter word list
   - [charlesreid1/five-letter-words](https://github.com/charlesreid1/five-letter-words)
 - Mob
   - Segel
   - Alex
