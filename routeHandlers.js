'use strict'
const charProcessor = require('./charProcessor');
const Character = require('./CharacterModel');
const axios = require('axios');

//-----------------JUST JWT THINGS----------------------
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const client = jwksClient({
  jwksUri: 'https://dev-8t9i1g9e.us.auth0.com/.well-known/jwks.json'
});

// From jwt docs
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

//test route. Hi! 
let test = (req,res) => {
  console.log('test hit');
  res.send('Welcome to the Character Sonnet Server. Head to https://charactersonnet.quest/ to make a character.')
}

let testCpu = async (req,res) => {
  let charData= req.body;
  let newChar = await charProcessor(charData);
  console.log('new character!',newChar);
  res.send(newChar);
}
//------------------------CRUD-------------------------- 

let findCharByEmail = (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      let userEmail = user.email;
      Character.find({email: userEmail}, (err, characters) => {
        
        // const parsedCharacters = characters.map(char=>{
        //   let tempObj = JSON.parse(char.character);
        //   char.character = tempObj;
        // })
        // JSON.parse(characters);
        console.log(characters);
        res.send(characters);
      });
    };
  });
}

let addChar = (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      console.log('data:',req.body);
      let charObj = charProcessor(req.body);
      console.log(charObj)
      const newChar = new Character ({
        character: JSON.stringify(charObj),
        email: user.email
      });
      newChar.save((err, newCharData)=> {
        res.send(newCharData);
      });
    }
  }
  );
} 

let deleteChar = (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('invalid token');
    } else { 
      let charId = req.params.id;

      Character.deleteOne({_id: charId, email: user.email})
        .then(deletedCharData => {
          console.log(deletedCharData);
          res.send('this time the cat was a character, but was nonetheless deleted');
        });
    }
  });
}


// Copy paste this entire line in after test for things to work good.
// , findCharByEmail, addChar, deleteChar

module.exports = {test, testCpu, addChar, findCharByEmail,deleteChar}

