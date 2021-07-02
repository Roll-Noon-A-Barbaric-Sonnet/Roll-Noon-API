const axios = require('axios')

const itemFormatter = async invArr => {
  let finalInventory = []; 
  
  Promise.all(invArr.map(async item => {
    
    let itemResp = await axios.get(`https://www.dnd5eapi.co${item.equipment.url}`);
    let itemInfo = itemResp.data;
    if (itemInfo.equipment_category.index==='armor') {
      item = {
       'name':`Armor: ${itemInfo.name}`, 
       'type':'armor',
       'armor_class': itemInfo.armor_class
       }
       finalInventory.push(item)
   } else if (itemInfo.equipment_category.index==='weapon') {
     item = {
       'name': itemInfo.name,
       'type': 'weapon',
       'damage': itemInfo.damage,
       'range': itemInfo.range,
       'properties': itemInfo.properties
     }
     finalInventory.push(item)
   } else {
     let quant = item.quantity;
     item = {
       'name':item.equipment.name,
       'type':'other',
       'quantity': quant
     };
     finalInventory.push(item)
   };
   return 'ok';
  })).then(data=> {
    console.log('finalInventory:',finalInventory);
  })
  return finalInventory
}

module.exports = itemFormatter;
