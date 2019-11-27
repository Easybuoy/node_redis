const express = require('express');
const mongoose = require('mongoose');

const Cat = require('./models/cat');
require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  Cat.find()
    .then(data => res.json({ cats: data }))
    .catch(err => res.json({ err }));
});

app.post('/', (req, res) => {
  const { name, age, type } = req.body;
  const catsData = {
    name,
    age,
    type
  };
  Cat.create(catsData)
    .then(data => res.json({ cats: data }))
    .catch(err => res.json({ err }));
});

app.listen(3000, () => console.log('app listening on 3000'));
