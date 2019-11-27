const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.get('/', (req, res) => {});

app.listen(3000, () => console.log('app listening on 3000'));
