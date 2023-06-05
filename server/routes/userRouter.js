const express = require('express');
const router = express.Router();

const data = {
  message: 'I\'m the one you want',
};

router.get('/', (req, res) => {
  console.log(data);
  res.status(200).json(data);
});

module.exports = router;