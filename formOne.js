'use strict'

const axios = require('axios');

//THISSERVER/formOne?race=RACE&charClass=CLASS
const formOne = async (req,res) => {
  console.log('form1 calling');
  const race = req.query.race;
  const charClass = req.query.charClass;
  //backend support for higher levels was fairly easy, so we wrote in some future proofing
  const level = 1;

  // get primary data for race and class
  let raceData = await axios.get(`https://www.dnd5eapi.co/api/races/${race}`);
  let classData = await axios.get(`https://www.dnd5eapi.co/api/classes/${charClass}`);
  
  //get nested weapon arrays
  let martialWeapons = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/martial-weapons`);
  let simpleWeapons = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/simple-weapons`);
  
  //The data from the equip categories needs to be formatted like the others
  let formatEquip = item => ({equipment: item, quantity:1});
  
  //start an object to search in later
  const optionArrays = {
    'martial-weapons': martialWeapons.data.equipment.map(item=>formatEquip(item)),
    'simple-weapons': simpleWeapons.data.equipment.map(item=>formatEquip(item))
  };

  // get class-specific nested equipment arrays
  if (charClass == 'sorcerer' || charClass == 'warlock' || charClass == 'wizard') {
    let arcaneFoci = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/arcane-foci`);
    optionArrays['arcane-foci'] = arcaneFoci.data.equipment.map(item=>formatEquip(item));
  }
  if (charClass == 'barbarian' || charClass == 'ranger') {
    let martialMelee = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/martial-melee-weapons`);
    optionArrays['martial-melee-weapons'] = martialMelee.data.equipment.map(item=>formatEquip(item));
  }

  if (charClass =='ranger') {
    let simpleMelee = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/simple-melee-weapons`)
    optionArrays['simple-melee-weapons'] = simpleMelee.data.equipment.map(item=>formatEquip(item));
  }

  if (charClass == 'bard') {
    let instruments = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/musical-instruments`);
    optionArrays['musical-instruments'] = instruments.data.equipment.map(item=>formatEquip(item));
  }
  if (charClass == 'cleric' || charClass == 'paladin') {
    let holySymbols = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/holy-symbols`);
    optionArrays['holy-symbols'] = holySymbols.data.equipment.map(item=>formatEquip(item));
  }
  if (charClass == 'druid') {
    let druidFoci = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/druidic-foci`);
    optionArrays['druidic-foci'] = druidFoci.data.equipment.map(item=>formatEquip(item));
  }

  
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
    mail[0].traits = [...mail[0].traits,...subRaceData.data.racial_traits];
    mail[0].proficiencies = [...mail[0].proficiencies,...subRaceData.data.starting_proficiencies];
    //and find all those extra options
    subRaceData.data.language_options?mail[2].push(subRaceData.data.language_options):'';
    subRaceData.data.racial_trait_options?mail[2].push(subRaceData.data.racial_trait_options):'';

  }
  
  //raceData Maps
  mail[0].languages = raceData.data.languages.map(language=>language.index);
  mail[0].abilities = raceData.data.ability_bonuses.map(ability_bonus=>({
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
  mail[1].savingThrows = charClassData.saving_throws.map(save => save.name.toLowerCase());
  mail[1].startingEquipment = charClassData.starting_equipment;
  
  //Classdata Options

  //get ready for the storm of work to make equipment happen
  charClassData.starting_equipment_options.forEach(choice => {
    //Are all the options a single item? great!
    if (choice.from.every(item=>item.equipment)) {
      mail[2].push(choice)
    //Are there some options that are multiple items? hmm...
    } else {
      //we're gonna need to just overhaul the from array
      let newFrom = [];
      //lets take it one by one.
        choice.from.forEach(option=>{
          //once again, regular items get a free pass. 
          if (option['equipment']) {
            newFrom.push(option);
            //if the option is a list, just stick the list together and ship it. 
          } else if (option[0] && Object.keys(option).every(key=>option[key]['equipment'])) {
            let multiName = [];
            let multiItems = [];
            Object.keys(option).forEach(key=>{
              multiName.push(option[key].equipment.name);
              multiItems.push(option[key]);
            });
            newFrom.push({
              equipment:  {
                name: multiName.join(', '),
                multi: true,
                items: multiItems,
                index: 'multi'
              },
              quantity: 1
            })
            //but if there are options within options, we are gonna need to call in our ringer (optionArrays)
          } else {
            //We need to go... deeper. 
            //is the option just a nested option? if so, get the list and ship it. 
            if (option['equipment_option']) {
              newFrom = [...newFrom,...optionArrays[option.equipment_option.from.equipment_category.index]];
            } else if (option['equipment_category']) {
              newFrom = [...newFrom,...optionArrays[option.equipment_category.index]];
            } else { 
              //only the truly awful options make it this far. 'just' a nested option indeed. 
              // get the list from the nested options so we can synthesize all the variations in to multis
              optionArrays[option[1].equipment_option.from.equipment_category.index].map(item=>{
                //luckily the item/options hybrids have consistent ordering
                let multiName = [item.equipment.name,option[0].equipment.name];
                let multiItems = [item, option[0]];
                
                newFrom.push({
                  equipment:  {
                    name: multiName.join(', '),
                    multi: true,
                    items: multiItems,
                    index: 'multi'
                  },
                  quantity: 1
                })
              })
            };
          };
        });
        choice.from = newFrom;
        mail[2].push(choice);
    };
  });

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
      }))
    }
  })).then(data => res.send(mail));
  
  console.log('you\'ve got mail!');
};

module.exports = formOne;