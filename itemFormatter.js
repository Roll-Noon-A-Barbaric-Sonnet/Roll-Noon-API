const axios = require('axios');

const itemFormatter = async invArr => {
  // let finalInventory = [];

  // to do this in a less push-y way...
  let finalInventory = await Promise.all(invArr.map(async item => {
    let itemResp = await axios.get(`https://www.dnd5eapi.co${item.equipment.url}`);
    let itemInfo = itemResp.data;
    if (itemInfo.equipment_category.index==='armor') {
      item = {
        'name':`Armor: ${itemInfo.name}`, 
        'type':'armor',
        'armor_class': itemInfo.armor_class
      };
    } else if (itemInfo.equipment_category.index==='weapon') {
      item = {
        'name': itemInfo.name,
        'type': 'weapon',
        'damage': itemInfo.damage,
        'range': itemInfo.range,
        'properties': itemInfo.properties
      };
    } else {
      let quant = item.quantity;
      item = {
        'name':item.equipment.name,
        'type':'other',
        'quantity': quant
      };
    }
    // since you're doing the same thing in every condition, better to just extract that line to the bottom
    return item;
  }));
  return finalInventory;
};

module.exports = itemFormatter;
