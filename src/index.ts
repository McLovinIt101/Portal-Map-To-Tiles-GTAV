import * as readline from 'readline';
import { combineImages } from './combineImages';
import { generateTiles } from './generateTiles';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter 1 to combine images or 2 to generate tiles: ', (answer) => {
  if (answer === '1') {
    combineImages().then(() => rl.close());
  } else if (answer === '2') {
    generateTiles().then(() => rl.close());
  } else {
    console.log('Invalid option');
    rl.close();
  }
});
