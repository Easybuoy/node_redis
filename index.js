const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
require('dotenv').config();

const Cat = require('./models/cat');
const { DB_URL, REDIS_PORT, REDIS_ADDRESS } = process.env;
const client = redis.createClient(REDIS_PORT, REDIS_ADDRESS);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  client.get('http://localhost:3000/', (err, cats) => {
    if (err) {
      throw err;
    }
    if (cats) {
      return res.json({ cats: JSON.parse(cats) });
    } else {
      Cat.find()
        .then(data => {
          client.setex(
            'http://localhost:3000/',
            10,
            JSON.stringify(data),
            err => {
              if (err) {
                throw err;
              }
            }
          );
          res.json({ cats: data, status: 'success' });
        })
        .catch(err => res.json({ err, status: 'error' }));
    }
  });
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  Cat.find({ _id: id })
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
    .then(data => res.json({ cats: data, status: 'success' }))
    .catch(err => res.json({ err, status: 'error' }));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`app listening on ${PORT}`));
