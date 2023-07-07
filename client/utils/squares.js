/**
* This file exports a function that when invoked, returns a new instance of an allSquares object
* should take a string parameter of length 81 representing sudoku puzzle, each char is 0-9, with 0 signifying empty space
*/

/** makeSquares
 * 
 * Used to make an 'allSquares' class object rubric. It would be computationally expensive to generate the specific strings and peers 
 * sets anew every time.
 * 
 * @returns an object holding:
 *  1. madeSquares object populated with 'square' objects having property keys 'A1' - 'I9' corresponding to square position
 *  in the sudoku grid. Rows are the letters, columns are the numbers.
 *  2. boxes array to be used for displaying the puzzle in the future
 *  3. keys array holding all of the Id strings of each square
 */

const makeSquares = () => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const rows = [];
  const cols = [];
  const boxes = [];

  for (let i = 0; i < 9; i++){
    rows.push([]);
    cols.push([]);
  }

  const madeSquares = {};

  //This statement populates keys into rows, cols, and the allSquares object, with the keys in the allSquares objects having their initial state.
  letters.forEach((letter, i) => {
    numbers.forEach((number, j) => {
      //creates an alphanumeric key for each square with letters for rows and numbres for columns
      const key = letter.concat(number);
      //Adds each key having the same letter to appropriate subarray of the rows array
      rows[i].push(key);
      //Adds each key having the same number to appropriate subarray of the cols array
      cols[j].push(key);
      //adds a key to the allSquares object having it's display set to 0 and possible values including all the possible values it could be
      madeSquares[key] = {
        //not sure if I'll need this key yet, it depends on how I set up my react. If all of this just goes into my react state I'll want it. I think this object might just be my state
        id: key,
        displayVal: '0',
        duplicate: false,
        fixedVal: false,
        possibleVal: 'will be replaced by a set later. Didn\'t want any shared references between class instances',
        peers: 'Will be replaced by a Set holding all of the squares names that share this squares row, column, or box'
      };
    });
  });

  const letterBoxes = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']];
  const numBoxes = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];

  //Aggregates keys for each 9 square box
  for (const letterBox of letterBoxes) {
    for (const numBox of numBoxes) {
      const box = [];
      letterBox.forEach(letter => {
        numBox.forEach(number => {
          const key = letter.concat(number);
          box.push(key);
        });
      });
      boxes.push(box);
    }
  }

  const allUnits = rows.concat(cols).concat(boxes);

  const keys = Object.keys(madeSquares);

  keys.forEach(key => {
    //for each array in allUnits that contains my key, I'm gonna add each element from that array to my peers set on my allSquares[key]peers prop
    const keysPeers = allUnits.reduce((acc, currentArray) => {
      if (currentArray.includes(key)) return acc.concat(currentArray);
      else return acc;
    }, []);
 
    madeSquares[key].peers = new Set(keysPeers);
 
    //remove this key from my peers set
    madeSquares[key].peers.delete(key);
  });
  
  return {
    madeSquares,
    boxes,
    keys,
    numbers
  };
};


//These variables are declared here to be used in the class definition to avoid recreating commonly used information
const { madeSquares, keys, boxes, numbers } = makeSquares();
const numStringRegex = /[0123456789]/;
export const unitBoxes = boxes;


/** emptyPuzzleMaker
 * @returns an empty puzzle string, comprises 81 0's
 */

const emptyPuzzleMaker = () => {
  return '0'.repeat(81);
};


/** isValidPuzzle
 * 
 * Checks input parameter to see if string if exactly 81 characters long and each character is
 * a string representaion of the numbers 0-9
 * 
 * @param {string} puzzleString A string to be tested to see if it's a valid sudoku puzzle
 * @returns boolean
 */

const isValidPuzzle = (puzzleString) => {
  if (puzzleString.length !== 81) {
    // console.log('puzzle string length isn\'t 81');
    return false;
  }

  let result = true;

  for (let i = 0; i < puzzleString.length; i += 1){
    if (!(numStringRegex.test(puzzleString[i]))) {
      // console.log('character', `'${puzzleString[i]}'`, 'was found in puzzle string. Only strings representing nums 0-9 are allowed.');
      result = false;
    }
  }
  return result;
};


/** class allSquares
 * Produces an object holding each square of a sudoku grid. These squares are each delivered an
 * appropriate display value from a sudoku puzzle string, which is an 81 character string holding
 * numbers 0-9, 0 indicating an empty square.
 */

class allSquares {
  constructor(puzzleString = emptyPuzzleMaker()) {

    if (!isValidPuzzle(puzzleString)) {
      // console.log('Puzzle string was not valid');
      throw new Error('Puzzle string was not valid');
    }

    let squareId, puzzleVal;

    for (let i = 0; i < keys.length; i += 1) {
      squareId = keys[i];
      puzzleVal = puzzleString[i];
      const possibleVal = new Set(numbers);

      if (puzzleVal === '0') {
        this[squareId] = {
          ...madeSquares[squareId],
          possibleVal
        };
      } else {
        this[squareId] = {
          ...madeSquares[squareId],
          displayVal: puzzleVal,
          fixedVal: true,
          possibleVal
        };
      }
    }
  }
}


/** createNewSquares
 * 
 * @param {string} puzzleString sudoku puzzle string, which is an 81 character string holding
 * characters 0-9
 * @returns a new instance of the allSquares class.
 */

export const createNewSquares = (puzzleString) => {
  return new allSquares(puzzleString);
};


/** Notes on find duplicates:
 * I can actually do this recursively and only visit the peers of my changed square if I found a change that needed to
 * occur. I'm thinking too hard. All I need to do run this every time I change a number, and then change the 'duplicate'
 * property of the affected peer. The problem is making sure I get rid of the other duplicate when I get rid of that 
 * selection. 
 * 
 * One solution is to recurrsively check all peers until I hit an iteration where nothing needs to change.
 * A better solution is to add a 'previous value' key to check and see if the previous value was the reason
 * one of the peers was a duplicate, and if so get rid of it. Actuallty I think I'd have to go the recursive 
 * route, because if there are multiple reasons a single block is duplicated I'd have to check each of them.
 * 
 * Alright, essentially I've figured out that I'd have to check every peer recursively until I went a round without
 * making a change. For now I'm gonna brute force it and check the entire array.
 * 
 * On second thought, recursion might be slower without tail-call optimization. I should look into this
*/

const findDuplicates = (allSquares) => {
  // let squareId
  for (const squareId of keys) {
    const square = allSquares[squareId];
    //for each square,
    if (square.displayVal === '0') continue;
    //set duplicate to false
    square.duplicate = false;
    //I need to iterate over the peers
    square.peers.forEach(peer => {
      //for each peer,
      //I need to compare the display value of the allSquares[peer] to my square's display value.
      if (square.displayVal === allSquares[peer].displayVal) {
        //update duplicated to true if they're the same
        square.duplicate = true;
        return;
      }
    });
  }
};

const deepCopyAllSquares = (allSquares) => {
  // Make a deep copy of the allSquares object
  const newAllSquareObj = {};
  for (const id of keys) {
    newAllSquareObj[id] = {
      ...allSquares[id],
      possibleVal: new Set(allSquares[id].possibleVal),
      peers: new Set(allSquares[id].peers)
    };
  }
  return newAllSquareObj;
};

/** createProgressString
 * Takes an allSquares object and creates a string representing the current state of the puzzle
 * 
 * @param {object} allSquares 
 * @returns {string}
 */

export const createProgressString = (allSquares) => {
  let progress = '';

  for (const key of keys) {
    progress += allSquares[key].displayVal;
  }

  // console.log('progress string from createProgressString:', progress);

  return progress;
};

/** updateSquaresFromProgress
 * 
 *  Takes an allSquares object and returns a new allSquares object updated with the correct numbers from a progress string
 * 
 * @param {Object} allSquares 
 * @param {String} progress 
 * @returns new allSquares object
 */

export const updateSquaresFromProgress = (allSquares, progress) => {
  // Make a deep copy of the allSquares object
  const newAllSquareObj = deepCopyAllSquares(allSquares);
  
  // Replace every display value to reflect the value from progress, but the "fixedVal" value will be preserved from the original allSquares creation
  for (let i = 0; i < keys.length; i++) {
    newAllSquareObj[keys[i]].displayVal = progress[i];
  }

  // Account for duplicates
  findDuplicates(newAllSquareObj);

  return newAllSquareObj;
};

/** newAllSquares
 * Given an allSquares object, a squareID, and a newly entered value in an input, return a deep copy with appropriate values
 * 
 * @param {object} allSquares Current state of the puzzle 
 * @param {string} squareId Id of the changed square 
 * @param {string} newVal New value of the changed square 
 * @returns {object} New state of puzzle
 */

export const newAllSquares = (allSquares, squareId, newVal) => {
  // If the state value hasn't changed, skip the function and just return the original object
  if (allSquares[squareId].displayVal === newVal) {
    // alert('state has not changed');
    return allSquares;
  }
  // Make a deep copy of the allSquares object
  const newAllSquareObj = deepCopyAllSquares(allSquares);

  // Change the specific values for the square that was changed
  newAllSquareObj[squareId].displayVal = newVal;
  newAllSquareObj[squareId].duplicate = false;
  // Iterate over the entire grid and check each square to see if it had duplicate values within the squares in its peers Set
  // If so, change the duplicate value of said square to true
  findDuplicates(newAllSquareObj);
  return newAllSquareObj;
};


/** isPuzzleFinished
 *  Checks if a puzzle is complete by checking to see if there are no empty spaces and no duplicates in the puzzle
 * 
 * @param {object} allSquares 
 * @returns {boolean}
 */

export const isPuzzleFinished = (allSquares) => {
  for (const squareId of keys) {
    if (allSquares[squareId].displayVal === '0' || allSquares[squareId].duplicate) {
      return false;
    }
  }
  return true;
};





////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*Testing

const emptyPuzzle = emptyPuzzleMaker();
// console.log(emptyPuzzle.length)
const samplePuzzle = '077000044400009610800634900094052000358460020000800530080070091902100005007040822';

// console.log(keys.length)

const grid = createNewSquares(samplePuzzle);
findDuplicates(grid);
// console.log(grid);

const newGrid = newAllSquares(grid, 'A1', '1')
// console.log(newGrid['A1'].displayVal)

// */