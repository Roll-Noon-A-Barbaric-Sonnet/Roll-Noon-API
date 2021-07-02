'use strict'
const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  character: String,
  email: String
})

const Character = mongoose.model('Character', characterSchema)

module.exports = Character;