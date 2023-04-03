const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json('I\'m the one you want')
  return;
  // res.json([
  //   {
  //     username: 'Mark',
  //     age: 34
  //   },
  //   {
  //     username: 'Kelsi',
  //     age: 29
  //   }
  // ])
});

module.exports = router;