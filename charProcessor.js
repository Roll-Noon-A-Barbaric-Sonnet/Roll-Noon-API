'use strict'

const Character = require('./CharacterModel');
const axios = require('axios');

//Welcome to the CPU! (Character Processing Unit)

//This function will contain the mega-ultra processing that takes all the plain objects for equipment and proficiencies and whatnot and turns them into better objects with stats and such, and also sorts all of that stuff. Buckle up. 

//Now remember folks: 
  //-charData[0] has the default data for race in an object. This has some variations, but generally can contain: 
    //-ability score bonuses (to be added to the abilities in charData[5])
    //-languages (array, add to language list)
    //-proficiencies(always present, often empty)
    //-size (add to description/details section most likely)
    //-speed (not sure where we want this yet, but we REALLY want it)
    //-traits. some have none, some only optional ones. make sure to get trait_options or whatever added in here. 

  //-charData[1] has the default stuff for the class. Similar to race:
    //-proficiencies (these are always weapons/armor/tools, and as such can be handled with a fair bit of simplicity.)
    //-proficiencyBonus just a number, but critical for many calculations. 
    //-savingThrows used to populate the saves row in stats, which we should gather data for after adding in ability boosts. 
    //startingEquipment as good a place as any to add equipment choices in. Sometimes there will already be stuff here.
    //-subclass. One day when we support spells, we will need additional gets for this. But NOT THIS DAY. 
    //spellcasting. Maybe. If it is here, we need to synthesize it into either a feature or section. Of special interest is spellcasting.spellcasting_ability.index, which contains a lowercase index for the spellcasting stat, which lets us calculate Save DC, which would be a handy thing to add to the feature. 
    //-class-specific (the bringer of despair), which holds.... any other random thing. That is gonna be a rather verbose algorithm. 

  //-charData[2] is all the choices that we sent out. Might be useful for gathering info in [3];

  //-charData[3] is the answers for the charData[2] choices, followed by the background choices. This will be the main sorting effort. 

  //-charData[4] is basic character information in the form [name, race, class, description]. all strings. 

  //-charData[5] is an object with properties like cha and str. the properties have values that are numbers. good idea to make a parralel array with modifiers pretty early on.
  //speaking of which: 

const statList = ['str','dex','con','int','wis','cha'];
const statToMod = (statNum) => Math.floor((stat-10)/2);

const charProcessor = (charData) => {
  //lets let the pieces out of that ghastly array. 
  let raceObj = charData[0];
  let classObj = charData[1];
  let charChoices = charData[2];
  let charAnswers = charData[3];
  let charInfo = charData[4];
  let statsObj = charData[5];
  //first thing: stats! Oh, and proficiency bonus. 
  let profBonus = classObj.proficiencyBonus;
  //Step1: gather the stat changes. 
  charAnswers.find(ans=>ans.ability_score)?raceArray.abilities.push(charAnswers.find(ans=>ans.ability_score)):'';
  //Step2: Apply them. 
  raceObj.abilities.forEach(boost=>{
    boost.index?
    statsObj[boost.index] += boost.bonus :
    statsObj[boost.ablility_score.index] += boost.bonus;  
  })
  //Now make a modifiers Object. 
  let modsObj = {
    'str': statToMod(statsObj.str),
    'dex': statToMod(statsObj.dex),
    'con': statToMod(statsObj.con),
    'int': statToMod(statsObj.int),
    'wis': statToMod(statsObj.wis),
    'cha': statToMod(statsObj.cha)
  }
  console.log(modsObj);
  //Might as well do saving throws now:
  let savesObj = modsObj;
  classObj.savingThrows.forEach(save=>{
    savesObj[save.toLowerCase()] += profBonus;
  });
  //lets put those attribute objects in here for safekeeping. 
  statBlock = [statsObj,modsObj,savesObj];
  console.log(statBlock)



}

module.exports = charProcessor;