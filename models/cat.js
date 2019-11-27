const mongoose = require('mongoose');

const catSchema = mongoose.Schema({
  name: String,
  age: Number,
  type: String
});

module.exports = mongoose.model('Cat', catSchema);
