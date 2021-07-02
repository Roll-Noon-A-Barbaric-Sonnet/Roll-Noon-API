'use strict'

const Character = require('./CharacterModel');
const axios = require('axios');

// //-----------------JUST JWT THINGS----------------------
// const jwt = require('jsonwebtoken');
// const jwksClient = require('jwks-rsa');
// const client = jwksClient({
//   jwksUri: 'our URI here'
// });

//From jwt docs
// function getKey(header, callback){
//   client.getSigningKey(header.kid, function(err, key) {
//     var signingKey = key.publicKey || key.rsaPublicKey;
//     callback(null, signingKey);
//   });
// };



//test route. Hi! 
let test = (req,res) => {
  console.log('test hit');
  res.send('Welcome to the Character Sonnet Server. Head to https://charactersonnet.quest/ to make a character.')
}

//------------------------CRUD-------------------------- 

// let findCharByEmail = (req,res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   jwt.verify(token, getKey, {}, function(err, user) {
//     if(err) {
//       res.status(500).send('Invalid token');
//     } else {
//       let userEmail = user.email;
//       Character.find({email: userEmail}, (err, characters) => {
//         const parsedCharacters = JSON.parse(characters);
//         console.log(parsedCharacters);
//         res.send(parsedCharacters);
//       });
//     };
//   });
// }

// let addChar = (req,res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   jwt.verify(token, getKey, {}, function(err, user) {
//     if(err) {
//       res.status(500).send('Invalid token');
//     } else {
//          //we will probably need to do some formatting and 800 get requests here. maybe have that function in a  module. 
//       const newChar = new Character ({
//         character: JSON.stringify(req.body.character),
//         email: user.email
//       });
//       newChar.save((err, newCharData)=> {
//         res.send(newCharData);
//       });
//     }
//   });
// } 

// let deleteChar = (req,res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   jwt.verify(token, getKey, {}, function(err, user) {
//     if(err) {
//       res.status(500).send('invalid token');
//     } else { 
//       let charId = req.params.id;

//       Character.deleteOne({_id: charId, email: user.email})
//         .then(deletedCharData => {
//           console.log(deletedBookData);
//           res.send('this time the cat was a character, but was nonetheless deleted');
//         });
//     }
//   });
// }

module.exports = {test}
// Copy paste this entire line in after test for things to work good.
// , findCharByEmail, addChar, deleteChar