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

  //mail 0 will be race data, mail 1 will be class data, mail 2 will be options 
  let mail = [];
  mail[2] = [];
  //Racedata statics
  mail[0] = {
    'speed': raceData.data.speed,
    'size': raceData.data.size,
    'traits': raceData.data.traits,
    'proficiencies': raceData.data.starting_proficiencies
  } 
  
  //raceData conditionals
  raceData.data.ability_bonus_options?mail[2].push(raceData.data.ability_bonus_options):'';
  raceData.data.language_options?mail[2].push(raceData.data.language_options):'';
  raceData.data.trait_options?mail[2].push(raceData.data.trait_options):'';
  
  //check for subrace, and if there is one....
  if (raceData.data.subraces[0]) {
    //get its data
    let subRaceData = await axios.get(`https://www.dnd5eapi.co${raceData.data.subraces[0].url}`);
    //add additional ability bonuses and languages to the race ones. 
    raceData.data.ability_bonuses=[...raceData.data.ability_bonuses,...subRaceData.data.ability_bonuses];
    raceData.data.languages=[...raceData.data.languages,...subRaceData.data.languages]; 
    //add the additional traits and proficiencies
    mail[0].traits = [...mail[0].traits,subRaceData.data.racial_traits];
    mail[0].proficiencies = [...mail[0].proficiencies,subRaceData.data.starting_proficiencies];
    //and find all those extra options
    subRaceData.data.language_options?mail[2].push(subRaceData.data.language_options):'';
    subRaceData.data.racial_trait_options?mail[2].push(subRaceData.data.racial_trait_options):'';

  }
  
  //raceData Maps
  mail[0].languages = raceData.data.languages.map(language=>language.index);
  console.log(raceData.data.ability_bonuses);
  mail[0].abililties = raceData.data.ability_bonuses.map(ability_bonus=>({
    'index': ability_bonus.ability_score.index,
    'bonus': ability_bonus.bonus
  }));

  mail[1] = {}
  


  console.log('you\'ve got mail!', mail);
  res.send(mail);
}

// let getAll = (req,res) => {
//   res.send
// }


module.exports = {test, formOne}