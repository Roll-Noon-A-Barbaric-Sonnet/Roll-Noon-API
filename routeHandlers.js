'use strict'

const axios = require('axios');

let test = (req,res) => {
  console.log('connection made')
  res.send('lets make a character')
}

let formOne = async (req,res) => {
  console.log('form1 calling');
  const race = req.query.race;
  const charClass = req.query.charClass;

  let raceData = await axios.get(`https://www.dnd5eapi.co/api/races/${race}`);
  let classData = await axios.get(`https://www.dnd5eapi.co/api/classes/${charClass}`);

}

// let getAll = (req,res) => {
//   res.send
// }


module.exports = {test}