'use strict'

const axios = require('axios');

let test = (req,res) => {
  console.log('connection made')
  res.send('lets make a character')
}

module.exports = {test}