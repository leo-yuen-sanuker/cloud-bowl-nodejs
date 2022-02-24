const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {
  let reqBody = req.body
  console.log("req.body: ", JSON.stringify(reqBody, null, 2).replace("\n", "\\n"));

//   let myself = "https://nodejs-bot-25cbybmeaa-uc.a.run.app"
  let myself = reqBody._links.self.href
  let myselfState = Object.entries(reqBody.arena.state).find(e=>(e[0] === myself))
  console.log("myselfState: ", myselfState)

  let faceLeft = 0
  let faceRight = 0
  let faceUp = 0
  let faceDown = 0
  let blockedLeft = 0
  let blockedRight = 0
  let blockedUp = 0
  let blockedDown = 0
  let allState = Object.entries(reqBody.arena.state).map( e => {
    if (e[0] === myself) {
      return ({...e[1], "myself": true})
    }
    let result = {
      ...e[1],
      "xDiff": myselfState.x - e[1].x,
      "yDiff": myselfState.y - e[1].y,
    }
    if (result.xDiff === 0) {
      if (!blockedUp) {
        if (result.yDiff === 1) {
          blockedUp = 1
        }
      }
      if (!blockedDown) {
        if (result.yDiff === -1) {
          blockedDown = 1
        }
      }
      if (!faceUp) {
        if ((result.yDiff > 0) && (result.direction === "S")) {
          faceDown = 1
        }
      }
      if (!faceDown) {
        if ((result.yDiff < 0) && (result.direction === "N")) {
          faceUp = 1
        }
      }
    }
    if (result.yDiff === 0) {
      if (!blockedRight) {
        if (result.yDiff === 1) {
          blockedRight = 1
        }
      }
      if (!blockedLeft) {
        if (result.yDiff === -1) {
          blockedLeft = 1
        }
      }
      if (!faceLeft) {
        if ((result.xDiff < 0) && (result.direction === "W")) {
          faceLeft = 1
        }
      }
      if (!faceLeft) {
        if ((result.xDiff > 0) && (result.direction === "E")) {
          faceRight = 1
        }
      }
    }
    return result
  })

  let runAway = false
  if ((faceLeft+faceRight+faceUp+faceDown) >= 1) {
    runAway = true
  }
  let blocked = false
  if (runAway) {
    let cantF = (blockedLeft && (myselfState.direction === "W")) ||(blockedRight && (myselfState.direction === "E")) ||(blockedUp && (myselfState.direction === "N")) ||(blockedDown && (myselfState.direction === "S"))
    if (cantF ) {
      res.send('L')
      console.log('LLLLLL')
    } else {
      res.send('F')
      console.log('FFFF')
    }
  } else {
    console.log('TTTT')
    res.send('T')
  }
});

app.listen(process.env.PORT || 8080);
