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
        console.log('charArray',characters);
        let parsedCharacters = characters.map((char,ind)=>{
          let tempObj = JSON.parse(char.character);
          console.log('parsed:',tempObj)
          return {
            '_id': char._id,
            'character': tempObj,
            'email':char.email,
            '__v': char.__v
          }
        })
        console.log('sending:',parsedCharacters);
        res.send(parsedCharacters);
      });
    };
  });
}

let findCharId = (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      Character.findById(req.params.id, (err, characters) => {
        console.log('charArray',characters);
        let parsedCharacters = characters.map((char,ind)=>{
          let tempObj = JSON.parse(char.character);
          console.log('parsed:',tempObj)
          return {
            '_id': char._id,
            'character': tempObj,
            'email':char.email,
            '__v': char.__v
          }
        })
        console.log('sending:',parsedCharacters);
        res.send(parsedCharacters);
      });
    };
  });
}

let addChar = async (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, {}, async function(err, user) {
    if(err) {
      res.status(500).send('Invalid token');
    } else {
      console.log('data:',req.body);
      let charObj = await charProcessor(req.body);
      console.log('processed:',charObj);
      let stringChar = JSON.stringify(charObj);
      console.log('stringified:',stringChar);
      const newChar = new Character ({
        character: JSON.stringify(charObj),
        email: user.email
      });
      newChar.save((err, newCharData)=> {
        console.log('newCharData:',newCharData);
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

module.exports = {test, testCpu, addChar, findCharByEmail,deleteChar}

