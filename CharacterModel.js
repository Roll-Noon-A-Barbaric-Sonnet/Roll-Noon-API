'use strict';
const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  // Saving character as a JSON string is QUITE the hack. Would be much better to save each field individually.
  character: String,
  email: String
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
