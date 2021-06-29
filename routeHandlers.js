'use strict'

const axios = require('axios');

let test = (req,res) => {
  console.log('connection made')
  res.send('lets make a character')
}

//THISSERVER/formone?race=RACE&charClass=CLASS
let formOne = async (req,res) => {
  console.log('form1 calling');
  const race = req.query.race;
  const charClass = req.query.charClass;

  let raceData = await axios.get(`https://www.dnd5eapi.co/api/races/${race}`);
  let classData = await axios.get(`https://www.dnd5eapi.co/api/classes/${charClass}`);

  res.send([raceData.data,classData.data]);
  // //mail 0 will be race data, mail 1 will be class data, mail 2 will be options 
  // let mail = [];
  // mail[0] = {
  // 'speed': raceData.data.speed,
  // 'size': raceData.data.size,
  // 'abililties': {
  //   'index': raceData.data.
  // }
  // }
  // mail[1] = {

  // }
  // mail[2] = {

  // }


  console.log('you\'ve got mail!', mail);
}

// let getAll = (req,res) => {
//   res.send
// }


module.exports = {test, formOne}