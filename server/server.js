const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

const PORT = 1234;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);

app.get('/api', (req, res) => {
  res.send('hello world from express!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`)
});

module.exports = app;