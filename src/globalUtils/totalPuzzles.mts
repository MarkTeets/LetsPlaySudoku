// This file will be the single source of truth to hold onto how many puzzles are in the database
/**
 * I tried to make this work with typescript via the following options in the tsconfig.json
 * "allowImportingTsExtensions": true,
 * "noEmit":true
 *
 * But this interupted the functionality of a ts-loader emit. For now I'll just update this number manually
 * in both puzzleController and PuzzleSelectMenu
 */
const totalPuzzles = 501;

// export { totalPuzzles };

// Former code from puzzleController:
// Importing the totalNumber of puzzles from another file so it can be the single source of truth as this
// also needs to be used in the frontend, which imports via ES6 syntax. This method is simpler than adding
// "type": "module" to my package.json and removing every instance of 'require'
// let totalPuzzles;
// import('../../globalUtils/totalPuzzles.mts')
//   .then((module) => {
//     totalPuzzles = module.totalPuzzles;
//     // console.log('totalpuzzles from back', totalPuzzles);
//   })
//   .catch((err) => {
//     // console.log('totalPuzzles failed to import to puzzle controller', err.message);
//   });

// Former code from PuzzleSelectMenu:
// import { totalPuzzles } from '../../../globalUtils/totalPuzzles.mts';
