import React, { useState, useEffect } from 'react';

const numStringRegex = /[0123456789]/;

const SquareDisplay = ({ square, index, onInputChange }) => {
  const { id, displayVal } = square;

  const [currentVal, setCurrentVal] = useState(displayVal === '0'? '' : displayVal);

  // useEffect(() => {
  //   console.log(id, 'rendered')
  // });

  const handleValueChange = (e) => {
    let newVal = e.currentTarget.value;
    if (newVal === '') newVal = '0';
    if (numStringRegex.test(newVal)) {
      setCurrentVal(e.currentTarget.value);
      onInputChange(id, newVal);
    } else {
      alert('Please enter a number from 1-9');
    }
  };

  return (
    inputMaker(square, currentVal, index, handleValueChange)
  );
};

export default SquareDisplay;

//////////////////////////////////////////////////////////////////////////////////////////////


function inputMaker(square, currentVal, index, handleValueChange) {
  const { id, displayVal, duplicate, fixedVal } = square;
  let classes = `square-display _${displayVal} ${index}`;

  if (duplicate) classes += ' duplicate-number';
    
  if (fixedVal) {
    return <input key={`Input-${id}`} type="text" className={classes} id={id} value={displayVal} disabled />;
  }
  return <input key={`Input-${id}`} type="text" className={classes} id={id} maxLength={1} value={currentVal} onChange={(e) => handleValueChange(e)} />;
}
  



/* So I originally had the number disappear every time you clicked into a non-fixed box, but
then I realized their number didn't come back if you didn't change it. So I made the number come
back on a blur. Then I realized there was no way for them to delete a number. So I made it simpler 
and don't do anything on clicks or blurs anymore

  const handleClick = () => {
    // setCurrentVal('')
    // emptySetter(true);
  }

  const handleBlur = () => {
    // if (currentVal === '' && displayVal !== '0') {
    //     setCurrentVal(displayVal)
    // }
  }

*/