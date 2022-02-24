const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {
  let reqBody = req.body
  console.log("req.body: ", JSON.stringify(reqBody, null, 2).replaceAll("\n", "\\n"));

//   let myself = "https://nodejs-bot-25cbybmeaa-uc.a.run.app"
  let myself = reqBody._links.self.href
  let myselfStatus = Object.entries(reqBody.arena.state).find(e=>(e[0] === myself))
  console.log("myselfStatus: ", myselfStatus)

  const moves = ['F', 'T', 'L', 'R'];
  // t23r532egwr3hrt
  // res.send(moves[Math.floor(Math.random() * moves.length)]);
  res.send('L');
});

app.listen(process.env.PORT || 8080);
