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
  const level = 1;

  let raceData = await axios.get(`https://www.dnd5eapi.co/api/races/${race}`);
  let classData = await axios.get(`https://www.dnd5eapi.co/api/classes/${charClass}`);

  const charClassData = classData.data

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
  mail[0].abililties = raceData.data.ability_bonuses.map(ability_bonus=>({
    'index': ability_bonus.ability_score.index,
    'bonus': ability_bonus.bonus
  }));

  //Classdata individual returns
  mail[1] = {
    'hitDie': charClassData.hit_die,
    'subclass': charClassData.subclasses[0].name
  }
  
  //Classdata Maps
  mail[1].proficiencies = charClassData.proficiencies.map(prof => prof.index);
  mail[1].savingThrows = charClassData.saving_throws.map(save => save.name);
  mail[1].startingEquipment = charClassData.starting_equipment.map(item => ({
    'name':item.equipment.name,
    'quantity': item.quantity
  }));
  
  //Classdata Options
  charClassData.starting_equipment_options.forEach(option => mail[2].push(option));
  charClassData.proficiency_choices.forEach(option => mail[2].push(option));
  charClassData.spellcasting? mail[1].spellcasting = charClassData.spellcasting: '';

  //Class levels
  const classLevel = await axios.get(`https://www.dnd5eapi.co/api/classes/${charClass}/levels`);
  const levelData = classLevel.data.filter(features => features.level<=level);
  const maxLevelData = levelData.filter(feature=>feature.level==level)[0];

  //Max level details
  mail[1].proficiencyBonus = maxLevelData.prof_bonus;
  mail[1].abilityScoreIncreases = maxLevelData.ability_score_bonuses;
  mail[1].classSpecific = maxLevelData.class_specific;
  mail[1].spellcasting? mail[1].spellcasting.spellSlots = maxLevelData.spellcasting : '';

  //Features for all acquired levels
  mail[1].features = levelData.reduce((acc, feat) => acc=[...acc,...feat.features],[]);

  Promise.all(levelData.map(lvl => {
    if (lvl.feature_choices[0]) {
      return Promise.all(lvl.feature_choices.map(async each => {
        let choiceData = await axios.get(`https://www.dnd5eapi.co${each.url}`)
        mail[2].push(choiceData.data.choice)
        console.log(choiceData.data.choice)
      }))
    }
  })).then(data => res.send(mail));
  
  // console.log('you\'ve got mail!', mail);
  // res.send(mail);
}

// let getAll = (req,res) => {
//   res.send
// }


module.exports = {test, formOne}