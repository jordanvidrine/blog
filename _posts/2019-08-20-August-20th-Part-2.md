---
layout: post
date: '2019-08-20 12:00:00'
---
### **Eloquent Javascript Chapter 16**
In my previous post, I wrote about the resources I have been and continue to use while learning Javascript. One of the best ones has been Eloquent Javascript.

The latest chapter was tough, but the more I sat with it and examined the code line by line, as well as inside of a debugger, the more I understood what was going on. I went through all of the code of the chapter and ran it in the FireFox Developer debugger OVER AND OVER again! Each time I had a realization, I commented near the line of code what was happening.

I feel like I have a pretty good handle of how the code now works and what exactly is happening behind the scenes. I believe what I am most impressed with about this chapter, and the book in general, is just how much can be done with PURE javascript.
<!--more-->

The chapter walked the reader through all of the code to create a platform based game, inspired by the browser based game [Dark Blue](http://www.lessmilk.com/games/10).

![Game Example](https://eloquentjavascript.net/img/darkblue.png)

I know for a fact that by ability to sit (4ish hours) with this code and go through it line by line was helped by my going through the Watch and Code courses by Gordon Zhu that I wrote about in my previous post. I felt pretty accomplished being able to go through this and understand the inner workings as well. It's a good feeling!

The following is the code from the chapter, with my insights that I came to while reading through and working with the code in the debugger.
```javascript

// SECOND function to run - Called as an argument to runLevel
class Level {
  constructor(plan) {
    // plan is passed as a string of chars to build a level off of
    // rows will be an array of arrays. Each array will be an array of its characters from
    // left to right. The height and width of the level will be determined on the length
    // of rows as well as the length of the arrays within rows
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;

    // startActors are the movables characters in the game ie. player, coins, moving lava
    // they will be placed ON TOP of the background grid of the "level"
    this.startActors = [];

    // this section will convert the characters in the arrays in rows to arrays of their
    // corresponding level parts. ie. wall, lava, empty background
    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        // when converting the characters to their level parts, this looks at the levelChars Object
        // to determine what character corresponds to what
        let type = levelChars[ch];
        // if the levelChars[ch] returns "wall", "empty", "lava" it is a background part/string
        // if the levelChars[ch] returns an object, it is stored in the startActors to later be
        // placed on top of the background level design
        if (typeof type === "string") return type;
        this.startActors.push(
          // if the part of the level is an 'actor', the create method on that actor is called
          // by giving the coordinates of the actor, as well as the corresponding character
          // that character is stored in the startActors array, and in its place in the background
          // level design will be an empty area
          type.create(new Vec(x, y), ch));
          return "empty";
      })
    })
  }
}

// SIXTEENTH function to be Called
// checks if an actor touches something it should not
// it is passed a vector object of the possible new position, as well as the size of the actor
// and the type of object the actor should not be touching
Level.prototype.touches = function(pos, size, type) {
  // the following take into consideration the projected movement, and the size of the actor moving
  // to get the possible space the actor would move in
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);

  // this sections checks if the actor is touching whatever was passed as type to the function
  // either coin, lava, or wall
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      // if the player would go outside of the bounds of the level, it will be treated as if
      // the player is hitting a wall
      let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;

      // if the player is not going out of bounds, the pssobile coordinate is checked by calling
      // up the rows with an x and a y coord passed
      let here = isOutside ? "wall" : this.rows[y][x];
      // if here = the type that was passed, touching will return true
      // if not, it will return false
      if (here == type) return true;
    }
  }
  return false
};

class State {
  // EIGTH function to be run.
  // it is passed the level, the actors at level.startActors, as well as a status (playing)
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  // SEVENTH function to be run. Called inside of runLevel
  // it is only passed the level function and will create a new instance of State
  // it will return a State object
  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find(a => a.type == "player");
  }
}

// THIRTEENTH function to be run
// its arguments are the timeStep from the anonymous animation function and an object of keys
// either being pressed down or not
State.prototype.update = function(time, keys) {
  // defines actors as an array of actor objects returned from any of the actors update methods
  // the timestep, keys object, and the state is passed to the actor update method
  let actors = this.actors.map(actor => actor.update(time, this, keys));

  // creates a new state with the current level, an array of updated actors, and the current status
  let newState = new State(this.level, actors, this.status);

  // if the game is still being played, return the new state
  if (newState.status != "playing") return newState;

  // defines player as the new state player
  let player = newState.player;

  // if this player is touching lava, the game is over
  if (this.level.touches(player.pos, player.size, "lava")) {
    return new State(this.level, actors, "lost");
  }

  // if the actor is not the player, and the player overlaps with any actor
  // newState will resolve to whatever the result of actor.collide is
  for (let actor of actors) {
    if (actor != player && overlap(actor, player)) {
      // this calls the collide method on any actor that the currently iterating actor will
      // collide with
      newState = actor.collide(newState);
    }
  }
  return newState;
};

class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  // FIFTEENTH function call
  // this will return a NEW vector object position using the current x and y positions plus
  // the new positions passed as a vector object in the method as 'other'
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}

class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() { return "player"; }

  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)),
                      new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 1.5);

const playerXSpeed = 7;
const gravity = 15;
const jumpSpeed = 8;

// FOURTEENTH function call - called from state.update
// this will be called EVERY time the player is moving
// it is passed a timeStep, the current state, and the keys currently pressed down as an object
Player.prototype.update = function(time, state, keys) {
  let xSpeed = 0;

  // if the left arrow is being pressed, speed will be negative (going backwards 7)
  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  // if right arrow is pressed, speed will be positive (going forwards 7)
  if (keys.ArrowRight) xSpeed += playerXSpeed;

  // defines pos as the CURRENT position of the player
  // pos is a vector object with an x and y coordinates as keys
  let pos = this.pos;

  // this will define movedX by calling the plus method on the pos vector object
  // it passes a new vector object as its argument with X equaling +7 or -7 multiplied by
  // the time step
  let movedX = pos.plus(new Vec(xSpeed * time, 0));

  // by using where the player will move on the X axis, this checks if the player is touching a wall
  // if touches returns false then the position is
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }

  // I am assuming here that the posX and posY must be handled individually with each animation
  // update
  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));
  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }
  return new Player(pos, new Vec(xSpeed, ySpeed));
};

class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() { return "lava"; }

  static create(pos, ch) {
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}

Lava.prototype.size = new Vec(1, 1);
Lava.prototype.collide = function(state) {
  return new State(state.level, state.actors, "lost");
};
Lava.prototype.update = function(time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "wall")) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    return new Lava(this.pos, this.speed.times(-1));
  }
};

class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() { return "coin"; }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos,
                    Math.random() * Math.PI * 2);
  }
}

Coin.prototype.size = new Vec(0.6, 0.6);
Coin.prototype.collide = function(state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "coin")) status = "won";
  return new State(state.level, filtered, status);
};
Coin.prototype.update = function(time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
                  this.basePos, wobble);
};

const levelChars = {
  ".": "empty", "#": "wall", "+": "lava",
  "@": Player, "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};

// SIXTH function to be run. It is called inside of drawGrid
// elt is passed the name of the node to be created, an object containing styles to attach to
// the created node, as well as children to attach to the created node
function elt(name, attrs, ...children) {

  // dom is defined as a node created with document.createElement passed with the first argument
  let dom = document.createElement(name);

  // if a styles object is passed, the styles are set on the node that was created
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }

  // if children are passed, each one will be attached to the node created
  for (let child of children) {
    dom.appendChild(child);
  }

  // the created node is returned from this function
  return dom;
}

// FOURTH function to run - called inside runLevel
class DOMDisplay {
  // this function will create the visual element of the game. It is passed the parent node
  // (document.body) and the level (an object returned by the Level constructor)
  constructor(parent, level) {

    // this will set this.dom to html to be returned by elt, elt is passed a node name, styles for
    // that node name, and a list of children to append to the node in the first argument
    // in this instance, a div will be created with the class of game, and the table returned
    // from drawGrid will be appended to that div
    this.dom = elt("div", {class: "game"}, drawGrid(level));

    // setting actorLayor to null, no actors have been added yet
    this.actorLayer = null;

    // the div with the level table inside will now be appended to the parent (document.body)
    parent.appendChild(this.dom);
  }
  clear() {this.dom.remove();}
}

DOMDisplay.prototype.syncState = function(state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};

DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // The viewport
  let left = this.dom.scrollLeft, right = left + width;
  let top = this.dom.scrollTop, bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5))
                         .times(scale);

  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }
  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop = center.y + margin - height;
  }
};

const scale = 20;
const wobbleSpeed = 8, wobbleDist = 0.07;

// FIFTH function to run, called in DOMDisplay as an argument to elt
// it will create the table grid that is used as the background of the level
function drawGrid(level) {
  // elt is a node creator. it will be called here to build the grid level background
  // it is being called here with table as its first argument. A table will be the parent node
  // of this function. It is passed styles for that parent node for the second argument. The third
  // argument will be a spread out array created by calling elt on each 'row' of the array of rows
  // in the level object. Each of those rows will also have cells created in them by calling ELT
  // on each character in the array. EX. The following would be created from the example
  //
  // level.rows = [['empty','empty','empty']]
  // <table>
  // <tr><td class='empty'/><td class='empty'/><td class='empty'/><tr/>
  // </table>
  //
  // drawGrid returns a created table with a class of background based on the level object
  // given to it.
  return elt("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    elt("tr", {style: `height: ${scale}px`},
        ...row.map(type => elt("td", {class: type})))
      ));
}

function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}

// determines if any actors will overlap one another, returns true or false
function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.x &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y;
}

// TWELTH function to be called, called from arrowKeys
function trackKeys(keys) {
  // create an empty object
  let down = Object.create(null);

  // defines a function that will track keys passed as array into trackKeys
  function track(event) {
    // if any of the keys in the keys array are pressed down
    // this function will add the key to the down object with the value of true or false
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }

  // adds event listeners to the window to track keypresses
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

// ELEVENTH funcion to be called, called inside of runAnimation's anonymous function
// returns an object
const arrowKeys =
  // calls trackKeys with the keys to be looking for
  trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

// NINTH function to be run? called inside of a promise function in runLevel
function runAnimation(frameFunc) {

  // lastTime is set to null, it isnt defined yet
  let lastTime = null;

  // the requestAnimationFrame callback with time argument, will be populated by
  // requestAnimationFrame
  function frame(time) {
    if (lastTime != null) {
      // calculates the time between this request call and the last
      let timeStep = Math.min(time - lastTime, 100) / 1000;

      // uses the timeStep to call frameFunc, the anonymous function defined in runLevel
      if (frameFunc(timeStep) === false) return;
    }

    // on first call, sets time to the time the first requestAnimationFrame was called
    lastTime = time;
    // will be called again
    requestAnimationFrame(frame);
  }

  // this calls window.requestAnimationFrame with the frame function as its argument, and will
  // be passed an integer as the current time
  requestAnimationFrame(frame);
}

// THIRD function to run
function runLevel(level, Display) {
  // defining the display by running the function passed to the second argument to runLevel
  // ie. DOMDisplay
  let display = new Display(document.body, level);

  // The state.start method will be called here
  let state = State.start(level);

  // not sure what is happening here yet
  let ending = 1;

  // run level will return a promise here
  return new Promise(resolve => {

    // run animation will be called with an anonymous function to be run inside of runAnimation
    // upon timestep being defined in runAnimation, this anonymous function will be called
    // TENTH function ?
    runAnimation(time => {
      // timeStep is passed as the time argument
      // state.update will be called with the time
      // and arrowKeys (an object of what keys are pressed)
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}

// FIRST function to run
async function runGame(plans, Display) {
  let lives = 3;
// this for loop cycles through to plans array to execute runLevel on each level plan in the array
for (let level = 0; level < plans.length;) {
  console.log(lives)
  // status will be set according the promise that runLevel returns. Since runLevel is a time based
  // game, the promise returned must be placed on player inputs over time. So this function will
  // pretty much be stopped, waiting on the player to complete or lose the level before it continues

  // runLevel accepts a level and a display
  let status = await runLevel(new Level(plans[level]),
                              Display);
  if (status == "won") level++;
  if (status == "lost") lives--;
}
console.log("You've won!");
}

```
