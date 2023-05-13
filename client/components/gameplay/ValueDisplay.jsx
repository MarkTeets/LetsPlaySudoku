import React, { useState, useEffect } from 'react';
// import './stylesheets/ValueDisplay.css'
const numStringRegex = /[0123456789]/

const ValueDisplay = ({ square, onValueDisplayClick, onInputChange }) => {
  const { id, displayVal, duplicate } = square;

  const [currentVal, setCurrentVal] = useState(displayVal === '0'? '' : displayVal)

  // useEffect(() => {
  //   console.log(id, 'rendered')
  // });

  const handleValueChange = (e) => {
    let newVal = e.currentTarget.value;
    if (newVal === '') newVal = '0';
    if (numStringRegex.test(newVal)) {
      setCurrentVal(e.currentTarget.value)
      onInputChange(id, newVal)
    } else {
      alert('Please enter a number from 1-9')
    }
  }

  return (
    inputMaker(square, currentVal, handleValueChange)
  )
}

export default ValueDisplay;

//////////////////////////////////////////////////////////////////////////////////////////////


function inputMaker(square, currentVal, handleValueChange) {
  const { id, displayVal, duplicate, fixedVal } = square;
  let classes = `value-display _${displayVal}`

  if (duplicate) classes += ' duplicate-number';
    
  if (fixedVal) {
    return <input type="text" className={classes} id={id} value={displayVal} disabled />;
  }
  return <input type="text" className={classes} id={id} maxLength={1} value={currentVal} onChange={(e) => handleValueChange(e)} />;
  // return <input type="text" className={classes} id={id} maxLength={1} value={currentVal} />;
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