'use strict'

const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT
const MONGODB = process.env.MONGODB


const formOne = require('./formOne.js');
const routeHandlers = require('./routeHandlers.js');

//--------------------------Mongoose Things-------------------------
const mongoose = require('mongoose');

mongoose.connect(MONGODB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongo Online')
});

//--------------------------Routes---------------------------------
app.get('/', routeHandlers.test);

app.post('/add',routeHandlers.addChar);

app.get('/formOne', formOne);

app.get('/characters', routeHandlers.findCharByEmail)

app.get('/characters/:id', routeHandlers.findCharId)

app.delete('/characters/:id', routeHandlers.deleteChar)

app.get('/', routeHandlers.test)

app.get('*', (req,res)=>{
  console.log('whoops, 404')
  res.status(404).send('You\'ve strayed from the path.');
})

//------------------------------Ears---------------------------------
app.listen(PORT, () => {console.log(`listening on port ${PORT}`);});