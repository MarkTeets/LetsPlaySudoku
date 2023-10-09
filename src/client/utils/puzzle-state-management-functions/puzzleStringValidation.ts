/** isValidPuzzleString
 *
 * Checks input parameter to see if string if exactly 81 characters long and each character is
 * a string representation of the numbers 0-9
 *
 * @param {string} puzzleString A string to be tested to see if it's a valid sudoku puzzle
 * @returns boolean
 */
export const isValidPuzzleString = (puzzleString: string): boolean => {
  if (puzzleString.length !== 81) {
    return false;
  }

  const numStringRegex = /[0123456789]/;
  let result = true;

  for (let i = 0; i < puzzleString.length; i += 1) {
    if (!numStringRegex.test(puzzleString[i])) {
      result = false;
    }
  }
  return result;
};

/** isValidPencilString
 *
 * Checks an incoming pencil string to make sure it's a valid string. Pencil strings are comprised
 * of squareIds followed by whatever numbers are present in for that square. For example, a pencil
 * square string representing pencilled in numbers 1 and 4 at square A1 and 5 and 8 at G6 is
 * "A114G658".
 * Returns true if the string matches the pattern, and false if not
 *
 * @param pencilString
 * @returns boolean
 */
export const isValidPencilString = (pencilString: string): boolean => {
  // First check to see if the general shape is correct
  const pencilRegex = /[A-I][1-9]{2,10}/g;
  const matches = pencilString.match(pencilRegex);
  if (!matches) return false;

  const joinedMatches = matches.join('');
  if (joinedMatches.length !== pencilString.length) return false;

  // Then check to make sure there are no duplicate squareIds
  const squareRegex = /[A-I][1-9]/g;
  const squareMatches = pencilString.match(squareRegex);
  if (!squareMatches) return false;

  const uniqueMatches = new Set(squareMatches);
  return squareMatches.length === uniqueMatches.size;
};
