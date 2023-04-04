/**
* This file exports a function that when invoked, returns a new instance of an newSquares object
* should take a string parameter of length 81 representing sudoku puzzle, each char is 0-9, with 0 signifying empty space
*/

//These variables are declared here to be used in the class definition to avoid recreating commonly used information
const madeSquares = makeSquares();
const keys = Object.keys(madeSquares);
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];


/** class allSquares
 * Produces an object holding each square of a sudoku grid. These squares are each delivered an
 * appropriate display value from a sudoku puzzle string, which is an 81 character string holding
 * numbers 0-9, 0 indicating an empty square.
 */

class allSquares {
  constructor(puzzleString = emptyPuzzleMaker()) {

    if (!isValidPuzzle(puzzleString)) {
      console.log('Puzzle string was not valid')
      throw new Error('Puzzle string was not valid')
    }

    let squareId, puzzleVal;

    for (let i = 0; i < keys.length; i += 1) {
      squareId = keys[i];
      puzzleVal = puzzleString[i]
      const possibleVal = new Set(numbers);

      if (puzzleVal === '0') {
        this[squareId] = {
          ...madeSquares[squareId],
          possibleVal
        }
      } else {
        this[squareId] = {
          ...madeSquares[squareId],
          displayVal: puzzleVal,
          fixedVal: true,
          possibleVal
        }
      }
    }
  }

  //Prototype methods:

  /** Notes on find duplicates:
   * I can actually do this recursively and only visit the peers of my current this if I found a change that needed to
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
  */

  findDuplicates() {
    // let squareId
    for (const squareId of keys) {
      const square = this[squareId];
      //for each square,
      if (square.displayVal === '0') continue;
      //set duplicate to false
      square.duplicate = false;
      //I need to iterate over the peers
      square.peers.forEach(peer => {
        //for each peer,
        //I need to compare the display value of the this[peer] to my square's display value.
        if (square.displayVal === this[peer].displayVal) {
          //update duplicated to true if they're the same
          square.duplicate = true;
          return;
        }
      });
    }
  }
}

/** createNewSquares
 * 
 * @param {string} puzzleString sudoku puzzle string, which is an 81 character string holding
 * characters 0-9
 * @returns a new instance of the allSquares class.
 */

const createNewSquares = (puzzleString) => {
  return new allSquares(puzzleString)
}

export default createNewSquares;

////////////////////////////////////////////////////////////////////////////////////////////////////

/*Testing

const emptyPuzzle = emptyPuzzleMaker();
const samplePuzzle = '077000044400009610800634900094052000358460020000800530080070091902100005007040802';

const grid = createNewSquares(samplePuzzle);
grid.findDuplicates();
console.log(grid)
// */


/** emptyPuzzleMaker
 * @returns an empty puzzle string, comprises 81 0's
 */
function emptyPuzzleMaker() {
  count = 81;
  result = '';
  while (count > 0) {
    result += '0'
    count -= 1;
  }
  return result;
}

/** makeSquares
 * 
 * Used to make an 'allSquares' class object rubric. It would be computationally expensive to generate the specific strings and peers 
 * sets anew every time.
 * 
 * @returns an object populated with 'square' objects having property keys 'A1' - 'I9' corresponding to square position
 *  in the sudoku grid. Rows are the letters, columns are the numbers.
 */

function makeSquares () {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const rows = [];
  const cols = []
  const boxes = [];
  for (let i = 0; i < 9; i += 1) {
    rows[i] = [];
    cols[i] = [];
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
        possibleVal: 'will be replaced by a set later. Didn\'t want any shared references between class instances', //new Set(numbers),
        peers: 'Will be replaced by a Set holding all of the squares names that share this squares row, column, or box'
      }
    });
  })

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
        })
      })
      boxes.push(box);
    }
  }

  const allUnits = rows.concat(cols).concat(boxes);
  // console.log(allUnits)

  const keys = Object.keys(madeSquares);
  // console.log(keys)
  keys.forEach(key => {
    //for each array in allUnits that contains my key, I'm gonna add each element from that array to my peers set on my allSquares[key]peers prop
    const keysPeers = allUnits.reduce((acc, currentArray) => {
      if (currentArray.includes(key)) return acc.concat(currentArray)
      else return acc;
    }, [])
 
    madeSquares[key].peers = new Set(keysPeers)
 
    //remove this key from my peers set
    madeSquares[key].peers.delete(key)
  })
  
  return madeSquares;
}

/** isValidPuzzle
 * 
 * Checks input parameter to see if string if exactly 81 characters long and each character is
 * a string representaion of the numbers 0-9
 * 
 * @param {string} puzzleString A string to be tested to see if it's a valid sudoku puzzle
 * @returns boolean
 */

function isValidPuzzle(puzzleString) {
  if (puzzleString.length !== 81) {
    console.log('puzzle string length isn\'t 81')
    return false;
  }

  let result = true;
  const numStringRegex = /[0123456789]/;

  for (let i = 0; i < puzzleString.length; i += 1){
    if (!(numStringRegex.test(puzzleString[i]))) {
      console.log('character', `'${puzzleString[i]}'`, 'was found in puzzle string. Only strings representing nums 0-9 are allowed.')
      result = false;
    }
  }
  return result;
}
