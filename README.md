![D&D](https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Dungeons_%26_Dragons_5th_Edition_logo.svg/1920px-Dungeons_%26_Dragons_5th_Edition_logo.svg.png)

# Roll-Noon
A Dungeons and Dragons 5e character creator, and keeper.</br>
Roll-Noon makes it easy for you to create, customize, and store your D&D 5e characters.</br></br>

# Creators
[Benjamin Arno](https://github.com/Barnord)</br>
[Steven Boston](https://github.com/Steven-Boston)</br>
[Joel Connell](https://github.com/zgameboyz)</br>
[Benjamin Ibarra](https://github.com/BeniBarra)</br></br>

# Resources
Built with [React.js](https://reactjs.org/) & [React-bootstrap](https://react-bootstrap.github.io/) </br>
API from [D&D 5th Edition API](http://www.dnd5eapi.co/)</br>
Using:
- [auth0](https://auth0.com/docs)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [mongoDB](https://www.npmjs.com/package/mongodb)
- [mongoose](https://mongoosejs.com/)
- [Node.js](https://nodejs.org/en/)

# User Stories

- As a user, I want an informative landing page that explains what the site can do for me. 
- As a user, I want a beginner-friendly application to help me learn Dungeons and Dragons and also create characters.
- As a user, I want a set of multi-stage forms that walk me through the character creation process. 
- As a user, I want the character information that is generated to be in a user friendly, custom format. 
- As a user, I want to be able to view, update, and delete previously created characters

# Database Schema

Our database schema will store individual characters that our class creates with all the data for displaying that character. For example:
```javascript
{
name: 'Tywin'
proficiencies: ['stealth','Persuasion'],
features: ['sneak attack','Cunning Action'],
stats: {
  str: 10,
  dex: 20,
  con: 12,
  int: 14,
  wis: 12,
  Cha: 16
  }
}
```

# Wireframes

![wf1](https://cdn.discordapp.com/attachments/858135354015481887/859154208074891294/CS_Mobile_Form.png)
![wf2](https://cdn.discordapp.com/attachments/858135354015481887/859154182132203570/CS_Mobile_Character_Page.png)
![wf3](https://cdn.discordapp.com/attachments/858135354015481887/859154122527211530/CS_Mobile_Landing.png)
![wf4](https://cdn.discordapp.com/attachments/858135354015481887/859154150817660958/CS_Mobile_Dash.png)
![wf5](https://cdn.discordapp.com/attachments/858135354015481887/859114558941429791/Character_Sonnet_Landing.png)
![wf6](https://cdn.discordapp.com/attachments/858135354015481887/859114585792446494/Character_Sonnet_Dashboard.png)
![wf7](https://cdn.discordapp.com/attachments/858135354015481887/859134892922372106/CS_Character_Page.png)
![wf8](https://cdn.discordapp.com/attachments/858135354015481887/859134947674292264/CS_Form.png)