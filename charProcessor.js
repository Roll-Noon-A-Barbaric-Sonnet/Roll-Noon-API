'use strict'

const Character = require('./CharacterModel');
const axios = require('axios');
const itemFormatter = require('./itemFormatter');

//Welcome to the CPU! (Character Processing Unit)

//This function will contain the mega-ultra processing that takes all the plain objects for equipment and proficiencies and whatnot and turns them into better objects with stats and such, and also sorts all of that stuff. Buckle up. 

//Now remember folks: 
  //-charData[0] has the default data for race in an object. This has some variations, but generally can contain: 
    //-ability score bonuses (to be added to the abilities in charData[5]) (DONE)
    //-languages (array, add to language list) (DONE)
    //-proficiencies(always present, often empty) (DONE)
    //-size (add to description/details section most likely) (DONE)
    //-speed (not sure where we want this yet, but we REALLY want it) (DONE)
    //-traits. some have none, some only optional ones. make sure to get trait_options or whatever added in here. (DONE)

  //-charData[1] has the default stuff for the class. Similar to race:
    //-proficiencies (these are always weapons/armor/tools, and as such can be handled with a fair bit of simplicity.) (DONE)
    //-proficiencyBonus just a number, but critical for many calculations. (DONE)
    //-savingThrows used to populate the saves row in stats, which we should gather data for after adding in ability boosts. (DONE)
    //startingEquipment as good a place as any to add equipment choices in. Sometimes there will already be stuff here. 
    //-subclass. One day when we support spells, we will need additional gets for this. But NOT THIS DAY. (DONE)
    //spellcasting. Maybe. If it is here, we need to synthesize it into either a feature or section. Of special interest is spellcasting.spellcasting_ability.index, which contains a lowercase index for the spellcasting stat, which lets us calculate Save DC, which would be a handy thing to add to the feature. (DONE)
    //-class-specific (the bringer of despair), which holds.... any other random thing. That is gonna be a rather verbose algorithm. 

  //-charData[2] is all the choices that we sent out. Might be useful for gathering info in [3];

  //-charData[3] is the answers for the charData[2] choices, followed by the background choices. This will be the main sorting effort. 

  //-charData[4] is basic character information in the form [name, race, class, description]. all strings. (DONE)

  //-charData[5] is an object with properties like cha and str. the properties have values that are numbers. good idea to make a parralel array with modifiers pretty early on. (DONE)
  //speaking of which: 

const statList = ['str','dex','con','int','wis','cha'];
const statToMod = (stat) => Math.floor((stat-10)/2);

const charProcessor = async (charData) => {
  let character = {};
  //lets let the pieces out of that ghastly array. 
  let raceObj = charData[0];
  let classObj = charData[1];
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

  //Might as well do saving throws now:
  let savesObj = {
    'str': statToMod(statsObj.str),
    'dex': statToMod(statsObj.dex),
    'con': statToMod(statsObj.con),
    'int': statToMod(statsObj.int),
    'wis': statToMod(statsObj.wis),
    'cha': statToMod(statsObj.cha)
  }
  classObj.savingThrows.forEach(save=>{
    savesObj[save] = savesObj[save] + profBonus;
  });
  //lets put those attribute objects in here for safekeeping. 
  let statBlock = [statsObj,modsObj,savesObj];
  //next we need to get some of that basic data from race/class so that there are places to sort to: 
  let traitArray = raceObj.traits;
  let languageArray = raceObj.languages;

  //Once we have gathered all of the skills, we will get a uniform format.
  let skillArray = raceObj.proficiencies.filter(prof=>/skill-/.test(prof.index));
  
  //this array will have all proficiencies other than skills, as simple strings.
  let toolWeapArr = [
    //racial proficiencies are inconsistent, and need to be adjusted to fit nicely into the list. 
    ...raceObj.proficiencies.filter(prof=>!/skill-/.test(prof.index)).map(prof=>{
      return prof.index ? prof.name : prof;
    }),
    //no such problem in class ones, though names need to be fixed on those. 
    ...classObj.proficiencies
  ];
  //equipment gathering
  let inventoryArray = classObj.startingEquipment;
  //class features
  let featureArray = classObj.features;
  //Now that that is all set up, we can start sifting the rest of the answers:
    //a lot of this algorithm will be checking urls with regex.
      // ability bonuses are lingering in the choice array, but have already been handled above. (DONE)
      // languages have 'languages' in their url, traits have 'traits'. They can be sent in as just name though. (DONE)
      // equipment has obj.equipment (DONE)
      // weapon and armor profs do not currently exist in the choices, but in the future they probably will. (DONE)
      // tools profs have a url of 'custom'. might need to change it to 'custom-tools' in the future, but for now it works. 
      // features have feature in the URL. (DONE)
      // skills have 'skill' in the URL. some have 'skills-' in name like above, but this is not consistent. (DONE)
  charAnswers.forEach(ans=>{
    if(ans.equipment) {
      if (ans.equipment.multi===true) {
        ans.equipment.items.forEach(item=>{
          inventoryArray.push(item);
        });
      } else {
      inventoryArray.push(ans);
      }
    } else if (/skill/.test(ans.url)) {
      skillArray.push(ans)
    } else if (/feature/.test(ans.url)) {
      featureArray.push(ans);
    } else if (/languages/.test(ans.url)) {
      languageArray.push(ans.name);
    } else if (/traits/.test(ans.url)) {
      traitArray.push(ans);
    } else if (/custom/.test(ans.url)||/proficiencies/.test(ans.url)){
      toolWeapArr.push(ans.name);
    } else {
      console.log('answer sorting, anomalous answer:', ans);
    }
  });

  //formatting
    //Skills need to have their names fixed! They can be: 'Skill: Perception' or just 'Perception'. The indexes have a parallel problem. 
    skillArray.forEach((prof,ind) =>{
      if (/Skill: /.test(prof.name)) {
        skillArray[ind] = {
        'name':prof.name.slice(7),
        'index':prof.index.slice(6)
        }
      } else {
        skillArray[ind] = {
          'name':prof.name,
          'index':prof.index
        }
      }
    });
    //axios everything
    const get5ethings = async url => await axios.get(`https://www.dnd5eapi.co${url}`);
    //especially the equipment. that needs stats. 
    //this is the tricky part. What is an equipment? A miserable pile of secrets. 
      //We need to find weapons and armor in particular, but there is no way to know what type of item we have on our hands. Let the get requests begin!
    let shield = false;
    if (inventoryArray.find(item=>item.equipment.index==='shield')) {
      shield = true;
    }


/////////////////////////////////////////////////////////////////////////////////////////////////////
  
    let finalInventory =await itemFormatter(inventoryArray)
    console.log('finalInventory:',finalInventory);


    //features need descriptions. 
    featureArray.forEach(feature=>{
      let featureInfo = get5ethings(feature.url);
      feature = {
        'name': featureInfo.name,
        'description':featureInfo.desc
      };
      return feature;
    });
  

    let armorClass = 10; 
    //calculations (HP and Armor Class)
    let hitPoints = classObj.hitDie + modsObj.con;
    let armor = finalInventory.find(item=>(item.type==='armor'&&item.armor_class.base>9))
    if (armor) {
    let armorStats = armor.armor_class;
    armorClass = armorStats.base + (armorStats.dex_bonus==true?armorStats.max_bonus>modsObj.dex?armorStats.max_bonus:modsObj.dex:0)+(shield?2:0);
    } else {
      armorClass = 10 + modsObj.dex;
    }
  character = {
    'name': charInfo[0],
    'race': charInfo[1],
    'class': charInfo[2],
    'level': 1,
    'description': charInfo[3],
    'hitPoints': hitPoints,
    'armorClass': armorClass,
    'statBlock': statBlock,
    'profBonus': profBonus,
    'equipment':inventoryArray,
    'size': raceObj.size,
    'speed': raceObj.speed,
    'traits':traitArray,
    'skills':skillArray,
    'languages':languageArray,
    'proficiencies':toolWeapArr,
    'features':featureArray,
    'classSpecific': classObj.classSpecific
  }

  classObj.spellcasting?character.spellcasting = classObj.spellcasting : '';
  

  return character;
}

module.exports = charProcessor;