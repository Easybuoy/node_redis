const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');

const Cat = require('./models/cat');
require('dotenv').config();

const client = redis.createClient(6379, '127.0.0.1');

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  client.get('http://localhost:3000/', (err, cats) => {
    console.log(err);
    if (err) {
      throw err;
    }
    if (cats) {
        console.log(cats)
      return res.json({ cats: JSON.parse(cats) });
    } else {
      console.log('aaa');
      Cat.find()
        .then(data => {
          client.set('http://localhost:3000/', JSON.stringify(data), err => {
            if (err) {
              throw err;
            }
          });
          res.json({ cats: data });
        })
        .catch(err => res.json({ err }));
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
    .then(data => res.json({ cats: data }))
    .catch(err => res.json({ err }));
});

app.listen(3000, () => console.log('app listening on 3000'));
