// Game code

import { Player } from '../model/Player.js';

export const PLAYER_NAME = 'HAX';

export var team = {
    members: [],
    projectProg: 0,
    energy: 50,
    challenges: [],
    teamSkill: [0, 0, 0, 0, 0],
}


// set up the canvas
function setupCanvas(id, w, h) {
    let canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.width = w;
    canvas.height = h;

    document.body.appendChild(canvas);

    return canvas;
}

let canvas = setupCanvas('game', 288, 224);
let ctx = canvas.getContext('2d');

let guiCanvas = setupCanvas('guiCanvas', 288, 54);
let ctx2 = guiCanvas.getContext('2d');

let camera = { x: 0, y: 0 };

let area, story;

// gui
let dialogImage, projectBarImage, teamBarImage, energyBarImage, fillerBarImage, areaImage, backgroundImage;


export let npcs = [];
let items = [];


// directionals
var upKey = 38; //[Up]
var leftKey = 37; //[Left]
var rightKey = 39; //[Rigt]
var downKey = 40; //[Down]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

// A and B
var a_key = 90; //[Z]
var b_key = 88; //[X]

// select and start
var select_key = 16; //[Shift]
var start_key = 13; //[Enter]

var actionKeySet = [a_key, b_key, select_key, start_key];
var keys = [];

var player = new Player();
var playerImage = player.skin;


/////////////////     GENERIC FUNCTIONS   ///////////

//checks if an element is in an array
function inArr(arr, e) {
    if (arr.length == 0)
        return false;
    return arr.indexOf(e) !== -1
}


//////////////////  PLAYER CONTROLS /////////////////

//directional movement
function goNorth(sprite, _area) {
    if (!sprite.moving) {
        sprite.initPos = Math.floor(sprite.y / _area.size) * _area.size;
        sprite.lastPos = [Math.floor(sprite.x / _area.size), Math.floor(sprite.y / _area.size)];
        sprite.dir = "north";
        sprite.action = "travel";
    }
}

function goSouth(sprite, _area) {
    if (!sprite.moving) {
        sprite.initPos = Math.floor(sprite.y / _area.size) * _area.size;
        sprite.lastPos = [Math.floor(sprite.x / _area.size), Math.floor(sprite.y / _area.size)];
        sprite.dir = "south";
        sprite.action = "travel";
    }
}

function goEast(sprite, _area) {
    if (!sprite.moving) {
        sprite.initPos = Math.floor(sprite.x / _area.size) * _area.size;
        sprite.lastPos = [Math.floor(sprite.x / _area.size), Math.floor(sprite.y / _area.size)];
        sprite.dir = "east";
        sprite.action = "travel";
    }
}

function goWest(sprite, _area) {
    if (!sprite.moving) {
        sprite.initPos = Math.floor(sprite.x / _area.size) * _area.size;
        sprite.lastPos = [Math.floor(sprite.x / _area.size), Math.floor(sprite.y / _area.size)];
        sprite.dir = "west";
        sprite.action = "travel";
    }
}

//movement on the map
function travel(sprite, _area) {
    if (sprite.action === "travel") { //continue if allowed to move
        var curspeed = sprite.speed;


        //travel north
        if (sprite.dir == "north") {
            if (Math.floor(sprite.y) > (sprite.initPos - _area.size) && !collide(_area, sprite)) {
                sprite.velY = curspeed;
                sprite.y += velControl(Math.floor(sprite.y), -sprite.velY, (sprite.initPos - _area.size));
                sprite.moving = true;
            } else {
                sprite.velY = 0;
                sprite.action = "idle";
                sprite.moving = false;
            }
        } else if (sprite.dir == "south") {
            if (Math.floor(sprite.y) < (sprite.initPos + _area.size) && !collide(_area, sprite)) {
                sprite.velY = curspeed;
                sprite.y += velControl(Math.floor(sprite.y), sprite.velY, (sprite.initPos + _area.size));
                sprite.moving = true;
            } else {
                sprite.velY = 0;
                sprite.action = "idle";
                sprite.moving = false;
            }
        } else if (sprite.dir == "east") {
            if (Math.floor(sprite.x) < (sprite.initPos + _area.size) && !collide(_area, sprite)) {
                sprite.velX = curspeed;
                sprite.x += velControl(Math.floor(sprite.x), sprite.velX, (sprite.initPos + _area.size));
                sprite.moving = true;
            } else {
                sprite.velX = 0;
                sprite.action = "idle";
                sprite.moving = false;
            }
        } else if (sprite.dir == "west") {
            if (Math.floor(sprite.x) > (sprite.initPos - _area.size) && !collide(_area, sprite)) {
                sprite.velX = curspeed;
                sprite.x += velControl(Math.floor(sprite.x), -sprite.velX, (sprite.initPos - _area.size));
                sprite.moving = true;
            } else {
                sprite.velX = 0;
                sprite.action = "idle";
                sprite.moving = false;
            }
        }
    }
}

////velocity control
//function _velControl(cur, value, max) {
//
//    function _util(_x) {
//            if (_x === 0) {
//                return 1;
//            }
//
//            let curPlusVal = cur + _x;
//
//            //increment or decrement
//            if (_x > 0) {
//                return
//                if (curPlusVal > max)
//                    return _util(Math.floor(_x / 2));
//                else
//                    return _x;
//            } else if (_x < 0) {
//                if (curPlusVal < max)
//                    return _util(Math.floor(_x / 2));
//                else
//                    return _x;
//            }
//    }
//
//    return _util(value);
//}


function velControl(cur, value, max) {
    if (value === 0) {
        return 1;
    }

    let curPlusVal = cur + value;

    //increment or decrement
    if (value > 0) {
        if (curPlusVal > max)
            return velControl(cur, Math.floor(value / 2), max);
        else
            return value;
    } else if (value < 0) {
        if (curPlusVal < max)
            return velControl(cur, Math.floor(value / 2), max);
        else
            return value;
    }
}


function lockMotion(sprite) {
    sprite.moving = false;
    sprite.action = "idle";
    sprite.velY = 0;
    sprite.velX = 0;
}


///////////////   INTERACT   ////////////////


//the interact function
function canInteract(sprite, item, _area) {
    if (!item.show)
        return false;

    //get the positions
    var rx;
    var ry;
    if (sprite.dir === "north" || sprite.dir === "west") {
        rx = Math.ceil(sprite.x / _area.size);
        ry = Math.ceil(sprite.y / _area.size);
    } else if (sprite.dir === "south" || sprite.dir === "east") {
        rx = Math.floor(sprite.x / _area.size);
        ry = Math.floor(sprite.y / _area.size);
    }

    //decide if adjacent to sprite
    var t = item;
    var xArea = [];
    var yArea = [];
    if (t.area !== null) {
        var t_ba = item.area;

        //get bounding box area
        for (var z = 0; z < t_ba.w; z++) {
            xArea.push(t_ba.x + t.x + z);
        }
        for (var z = 0; z < t_ba.h; z++) {
            yArea.push(t_ba.y + t.y + z);
        }
    } else {
        xArea.push(Math.ceil(t.x / _area.size));
        yArea.push(Math.ceil(t.y / _area.size));
    }

    //determine if able to interact
    if (sprite.dir === "north" && (inArr(xArea, rx) && inArr(yArea, ry - 1)))
        return true;
    else if (sprite.dir === "south" && (inArr(xArea, rx) && inArr(yArea, ry + 1)))
        return true;
    else if (sprite.dir === "east" && (inArr(xArea, rx + 1) && inArr(yArea, ry)))
        return true;
    else if (sprite.dir === "west" && (inArr(xArea, rx - 1) && inArr(yArea, ry)))
        return true;

    return false;
}

//the talk function
function canTalk(sprite, other_pers, _area) {
    if (other_pers.moving || !other_pers.show)
        return false;

    //get the positions
    var rx;
    var ry;
    if (sprite.dir === "north" || sprite.dir === "west") {
        rx = Math.ceil(sprite.x / _area.size);
        ry = Math.ceil(sprite.y / _area.size);
    } else if (sprite.dir === "south" || sprite.dir === "east") {
        rx = Math.floor(sprite.x / _area.size);
        ry = Math.floor(sprite.y / _area.size);
    }

    //decide if adjacent to sprite
    let nx = Math.floor(other_pers.x / _area.size);
    let ny = Math.floor(other_pers.y / _area.size);

    if (sprite.dir == "north" && (rx == nx) && (ry - 1 == ny))
        return true;
    else if (sprite.dir == "south" && (rx == nx) && (ry + 1 == ny))
        return true;
    else if (sprite.dir == "east" && (rx + 1 == nx) && (ry == ny))
        return true;
    else if (sprite.dir == "west" && (rx - 1 == nx) && (ry == ny))
        return true;
}

//faces the main character
function faceOpposite(npc) {
    if (player.dir === "north")
        npc.dir = "south";
    else if (player.dir === "south")
        npc.dir = "north"
    else if (player.dir === "west")
        npc.dir = "east"
    else if (player.dir === "east")
        npc.dir = "west"
}

//non-cutscene specific behavior
function defaultBehavior(npc, _area, _story) {
    if (!_story.cutscene) {
        if (npc.interact) {
            clearInterval(npc.wt);
            npc.wt = 0;
        }
        if (npc.move === "drunk_walk" && !npc.interact && npc.show) {
            if (npc.wt == 0 && !npc.moving) {
                npc.wt = setInterval(function () {
                    drunkardsWalk(_area, npc, npc.boundary);
                    clearInterval(npc.wt);
                    npc.wt = 0;
                }, (Math.random() * 2 + 1) * 1000);
            }
        }
    } else {
        clearInterval(npc.wt);
        npc.wt = 0;
    }
}


///////////////////     COLLISIONS     ////////////////


//if hit a collision point on the wall
function hitWall(sprite, _area) {
    //get the positions
    var rx;
    var ry;

    if (sprite.dir === "north" || sprite.dir === "west") {
        rx = Math.ceil(sprite.x / _area.size);
        ry = Math.ceil(sprite.y / _area.size);
    } else if (sprite.dir === "south" || sprite.dir === "east") {
        rx = Math.floor(sprite.x / _area.size);
        ry = Math.floor(sprite.y / _area.size);
    }


    //edge of map = undecided
    if ((sprite.dir === "west" && rx - 1 < 0) ||
        (sprite.dir === "east" && rx + 1 >= _area.cols) ||
        (sprite.dir === "north" && ry - 1 < 0) ||
        (sprite.dir === "east" && ry + 1 >= _area.rows))
        return;


    if ((sprite.dir == "north" && _area.map[ry - 1][rx] === 1) ||
        (sprite.dir == "south" && _area.map[ry + 1][rx] === 1) ||
        (sprite.dir == "east" && _area.map[ry][rx + 1] === 1) ||
        (sprite.dir == "west" && _area.map[ry][rx - 1] === 1)) {

        return true;
    }

    return false;
}

//if hit another sprite
function hitNPC(sprite, _area) {
    //get the positions
    var rx;
    var ry;
    if (sprite.dir === "north" || sprite.dir === "west") {
        rx = Math.ceil(sprite.x / _area.size);
        ry = Math.ceil(sprite.y / _area.size);
    } else if (sprite.dir === "south" || sprite.dir === "east") {
        rx = Math.floor(sprite.x / _area.size);
        ry = Math.floor(sprite.y / _area.size);
    }

    //decide if adjacent to sprite
    var ouch = false;
    for (var i = 0; i < npcs.length; i++) {
        var n = npcs[i];

        if (n == sprite || !n.show)
            continue;

        let nx = Math.floor(n.x / _area.size);
        let ny = Math.floor(n.y / _area.size);

        if (sprite.dir == "north" && (rx == nx) && (ry - 1 == ny))
            ouch = true;
        else if (sprite.dir == "south" && (rx == nx) && (ry + 1 == ny))
            ouch = true;
        else if (sprite.dir == "east" && (rx + 1 == nx) && (ry == ny))
            ouch = true;
        else if (sprite.dir == "west" && (rx - 1 == nx) && (ry == ny))
            ouch = true;
    }
    return ouch;
}

//if hit a specific boundary area
function hitBoundary(_area, sprite, boundary) {
    //boundary in the form [x,y,w,h]
    if (boundary == null) {
//        console.error('Boundaries can\'t be hit if they don\'t exist');
        return false;
    }

    //get the positions
    var rx;
    var ry;
    if (sprite.dir === "north" || sprite.dir === "west") {
        rx = Math.ceil(sprite.x / _area.size);
        ry = Math.ceil(sprite.y / _area.size);
    } else if (sprite.dir === "south" || sprite.dir === "east") {
        rx = Math.floor(sprite.x / _area.size);
        ry = Math.floor(sprite.y / _area.size);
    }


    //edge of map = undecided
    if (rx - 1 < 0 || rx + 1 >= _area.cols || ry - 1 < 0 || ry + 1 >= _area.cols)
        return;

    //get bounding box area
    var xArea = [];
    for (var z = 0; z < boundary.w; z++) {
        xArea.push(boundary.x + z);
    }
    var yArea = [];
    for (var z = 0; z < boundary.h; z++) {
        yArea.push(boundary.y + z);
    }

    if (sprite.dir == "north" && (!inArr(xArea, rx) || !inArr(yArea, ry - 1)))
        return true;
    else if (sprite.dir == "south" && (!inArr(xArea, rx) || !inArr(yArea, ry + 1)))
        return true;
    else if (sprite.dir == "east" && (!inArr(xArea, rx + 1) || !inArr(yArea, ry)))
        return true;
    else if (sprite.dir == "west" && (!inArr(xArea, rx - 1) || !inArr(yArea, ry)))
        return true;

    return false;
}

function hitItem(sprite, _area) {
    //get the positions
    var rx;
    var ry;

    if (sprite.dir === "north" || sprite.dir === "west") {
        rx = Math.ceil(sprite.x / _area.size);
        ry = Math.ceil(sprite.y / _area.size);
    } else if (sprite.dir === "south" || sprite.dir === "east") {
        rx = Math.floor(sprite.x / _area.size);
        ry = Math.floor(sprite.y / _area.size);
    }

    //decide if adjacent to sprite
    var ouch = false;
    for (var i = 0; i < items.length; i++) {
        var n = items[i];

        if (n == sprite || !n.show)
            continue;

        let nx = Math.floor(n.x / _area.size);
        let ny = Math.floor(n.y / _area.size);

        if (sprite.dir == "north" && (rx == nx) && (ry - 1 == ny))
            ouch = true;
        else if (sprite.dir == "south" && (rx == nx) && (ry + 1 == ny))
            ouch = true;
        else if (sprite.dir == "east" && (rx + 1 == nx) && (ry == ny))
            ouch = true;
        else if (sprite.dir == "west" && (rx - 1 == nx) && (ry == ny))
            ouch = true;
    }
    return ouch;
}

//if hit another generic object
function hitOther(sprite, other, _area) {
    //get the positions
    var rx;
    var ry;
    if (sprite.dir === "north" || sprite.dir === "west") {
        rx = Math.ceil(sprite.x / _area.size);
        ry = Math.ceil(sprite.y / _area.size);
    } else if (sprite.dir === "south" || sprite.dir === "east") {
        rx = Math.floor(sprite.x / _area.size);
        ry = Math.floor(sprite.y / _area.size);
    }
    //decide if adjacent to sprite
    var nx = Math.floor(other.x / _area.size);
    var ny = Math.floor(other.y / _area.size);

    if (sprite.dir == "north" && (rx == nx) && (ry - 1 == ny))
        return true;
    else if (sprite.dir == "south" && (rx == nx) && (ry + 1 == ny))
        return true;
    else if (sprite.dir == "east" && (rx + 1 == nx) && (ry == ny))
        return true;
    else if (sprite.dir == "west" && (rx - 1 == nx) && (ry == ny))
        return true;

    return false;
}

function screenEdge(sprite, _area) {
    //get the positions
    var rx;
    var ry;

    if (sprite.dir === "north" || sprite.dir === "west") {
        rx = Math.ceil(sprite.x / _area.size);
        ry = Math.ceil(sprite.y / _area.size);
    } else if (sprite.dir === "south" || sprite.dir === "east") {
        rx = Math.floor(sprite.x / _area.size);
        ry = Math.floor(sprite.y / _area.size);
    }

    if (sprite.dir == "north" && (ry - 1 < 0))
        return true;
    else if (sprite.dir == "south" && (ry + 1 == _area.rows))
        return true;
    else if (sprite.dir == "east" && (rx + 1 == _area.cols))
        return true;
    else if (sprite.dir == "west" && (rx - 1 < 0))
        return true;

    return false;
}

//grouped collision checker
function collide(_area, sprite, boundary = null) {
    //return false;
    // console.log('collide');
    return hitNPC(sprite, _area) || hitWall(sprite, _area) || hitItem(sprite, _area) || hitBoundary(_area, sprite, boundary) || screenEdge(sprite, _area);
}

function goodSpot(x, y, _map, _rows, _cols, _npcs, _items) {
    for (var r = 0; r < _rows; r++) {
        for (var c = 0; c < _cols; c++) {
            if (r == y && c == x && _map[r][c] == 1) {
                return false;
            }
        }
    }

    for (var a = 0; a < _npcs; a++) {
        if (_npcs[a].x == x && _npcs[a].y == y)
            return false;
    }
    for (var b = 0; b < _items; b++) {
        if (_items[b].x == x && _items[b].y == y)
            return false;
    }
    return true;
}


///////////////////   CAMERA  /////////////////////

//have the camera follow the player
function panCamera(_area) {
        //camera displacement
    if ((player.x >= (canvas.width / 2)) && (player.x <= (_area.map[0].length * _area.size) - (canvas.width / 2)))
        camera.x = player.x - (canvas.width / 2);

    if ((player.y >= (canvas.height / 2) - _area.size / 2) && (player.y <= (_area.map.length * _area.size) - (canvas.height / 2)))
        camera.y = player.y - (canvas.height / 2 - _area.size / 2);
}

//reset the camera's position on the player
function resetCamera(_area) {
    camera.x = 0;
    camera.y = 0;

    if ((player.x > (_area.map[0].length * _area.size) - (canvas.width / 2)))
        camera.x = (_area.map[0].length * _area.size) - canvas.width;


    if ((player.y > (_area.map.length * _area.size) - (canvas.height / 2)))
        camera.y = (_area.map.length * _area.size) - canvas.height;
}


///////////////////    NPCS    //////////////////


//random walking
function drunkardsWalk(_area, sprite, boundary=null) {
    console.log('im drunk');

    var dice;
    var directions = ["north", "south", "west", "east"];

    if (!sprite.moving) {
        var pseudoChar = {
            dir: directions[0],
            x: sprite.x,
            y: sprite.y
        }
        //check if it would hit other character
        do {
            dice = Math.floor(Math.random() * directions.length);
            pseudoChar.dir = directions.splice(dice, 1)[0];

            //no options left
            if (directions.length == 0)
                return;

        } while (collide(_area, pseudoChar, boundary) || hitOther(pseudoChar, player, _area))

        //move in direction
        if (pseudoChar.dir === "north") {
            goNorth(sprite, _area);
        } else if (pseudoChar.dir === "south") {
            goSouth(sprite, _area);
        } else if (pseudoChar.dir === "west") {
            goWest(sprite, _area);
        } else if (pseudoChar.dir === "east") {
            goEast(sprite, _area);
        }
    }
}

//look in random directions
function drunkardsLook(sprite) {
    var dice;
    var directions = ["north", "south", "west", "east"];
    dice = Math.floor(Math.random() * 4);
    sprite.dir = directions[dice];
}

//act upon the robot pathQueue
function smallStep(robot) {
    if (robot.pathQueue.length != 0 && !robot.moving) { //if not already moving and not an empty pathQueue
        var nextStep = robot.pathQueue[0];
        var curX = Math.floor(robot.x / 16);
        var curY = Math.floor(robot.y / 16);

        //changing y pos
        if (curX == nextStep[0]) {
            if (nextStep[1] < curY)
                goNorth(robot, _area);
            else if (nextStep[1] > curY)
                goSouth(robot, _area);
        }
        //changing x pos
        else if (curY == nextStep[1]) {
            if (nextStep[0] < curX)
                goWest(robot, _area);
            else if (nextStep[0] > curX)
                goEast(robot, _area);
        }
        //remove the node once reached
        robot.lastPos = robot.pathQueue.shift();
        //robot.lastPos = [Math.floor(robot.x / _area.size), Math.floor(robot.y / _area.size)];
    }
}


////////////////////////          RENDER         //////////////////////

export function allImagesAreReady(verbose=false) {

    let namedImages = [
        [dialogImage, 'dialogImage'],
        [projectBarImage, 'projectBarImage'],
        [teamBarImage, 'teamBarImage'],
        [energyBarImage, 'energyBarImage'],
        [fillerBarImage, 'fillerBarImage'],
        [areaImage, 'areaImage'],
    ];

    namedImages.push.apply(namedImages, npcs.map(npc => [npc.skin, `npc(${npc.name})`]));
    namedImages.push.apply(namedImages, items.map(item => [item.skin, `npc(${item.name})`]));
    namedImages.push([player.skin, `player(${player.name})`]);

    return namedImages.every(namedImage => {
        let _image = namedImage[0];
        let _name = namedImage[1];

        let _decision = (_image && _image.width && _image.width != 0);

        if (verbose) {
            console.log(`-- The image "${_name}" is ready?`, _decision, _image);
        }

        return _decision;
    });
}

export function readyAllTheThings() {
    npcs.forEach(npc => {
        npc.ready = true;
    });

    items.forEach(item => {
        item.ready = true;
    });
}


function drawchar(sprite) {
    ctx.drawImage(sprite.skin, sprite.x, sprite.y);
}


function renderItem(item) {
    if (item.show && item.ready)
        ctx.drawImage(item.skin, item.x, item.y);
}

function drawBars() {

    //background gui
    ctx2.drawImage(projectBarImage, 2, 4);
    ctx2.drawImage(energyBarImage, 96, 4);
    ctx2.drawImage(teamBarImage, 190, 4);

    //health bar gui
    ctx2.drawImage(fillerBarImage, 0, 0, 88, 12, 8, 36, (team.projectProg / 100) * 88, 12);
    ctx2.drawImage(fillerBarImage, 0, 0, 88, 12, 102, 36, (team.energy / 100) * 88, 12);

    //team stats gui
    ctx2.fillStyle = "#ff0000";
    ctx2.fillText(team.teamSkill[0], 196, 46);
    ctx2.fillText(team.teamSkill[1], 216, 46);
    ctx2.fillText(team.teamSkill[2], 236, 46);
    ctx2.fillText(team.teamSkill[3], 250, 46);
    ctx2.fillText(team.teamSkill[4], 272, 46);
}

//render everything
// guaranteed to run after all images are loaded
async function render(_area, _story) {
    ctx.save();

    ctx.translate(-camera.x, -camera.y);

    //clear everything
    ctx.clearRect(camera.x, camera.y, canvas.width, canvas.height);



    ctx.drawImage(backgroundImage, 0, 0);

    //re-draw bg
    var ptrn = ctx.createPattern(backgroundImage, 'repeat'); // Create a pattern with this image, and set it to "repeat".
    ctx.fillStyle = ptrn;
    ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);

    //draw hack area
    if (_area.scene === "main") {
        ctx.drawImage(areaImage, 0, 32);
    } else if (_area.scene === "hall") {
        ctx.drawImage(areaImage, 0, 0);
    }

    // draw the buildings if behind player

    for (var i = 0; i < items.length; i++) {
        renderItem(items[i]);
    }

    //if npc behind player
    for (var c = 0; c < npcs.length; c++) {
        drawchar(npcs[c]);
    }

    //draw player
    drawchar(player);

    //gui
    drawGUI(_story);


    //if(_story.area === "vals")
    //drawTestMap(levelList[1]);

    ctx.restore();
    // requestAnimationFrame(render);

}

function drawGUI(_story) {
    drawDialog(_story);
    drawBars();
}


////////////////////   DIALOGUE     ///////////////////

//show dialog gui
function drawDialog(_story) {
    var dialogue = _story.dialogue;
    var choice = _story.choice_box;
    if (dialogue.show) {
        ctx.drawImage(dialogImage, camera.x, camera.y);
        //wrapText(dialogue.text[dialogue.index], camera.x + 12, camera.y + 116)
        showText();

        /*
        if(choice.show){
        	//choice boxes
        	for(var c=0;c<choice.options.length;c++){
        		var cx = camera.x+6;
        		var cy = camera.y+95+(-11*(c+1));
        		ctx.drawImage(optionIMG, cx, cy);
        		ctx.font = "6px Gameboy";
        		ctx.fillText(choice.options[choice.options.length-(c+1)], cx+4, cy+9);
        	}

        	//select
        	ctx.drawImage(selectIMG, camera.x+6, camera.y+95+(11*(choice.index-choice.options.length)));
        }
        */


        if (choice.show) {
            //get the maximum x length
            var longest = 10;
            if (!hasMultiLine(_story)) {
                longest = bigChoice(choice.options);
            }

            //choice boxes
            var cx = camera.x + 3;
            for (var c = 0; c < choice.options.length; c++) {
                var cy = camera.y + 95 + (-((optionIMG.height - 2) / 2) * (sumLines(c, _story)));

                //var cy = camera.y+95+(-(optionIMG.height-1)*((sumLines(c, _story)*11)+1));
                ctx.drawImage(optionIMG, 0, 0, optionIMG.width, optionIMG.height,
                    cx, cy, (longest / 10) * (optionIMG.width), (choice.lines[c] / 2) * optionIMG.height);
                choiceText(choice.options[c], choice.lines[c], cy + 9);

                //ctx.font = "6px Gameboy";
                //ctx.fillText(choice.options[choice.options.length-(c+1)], cx+4, cy+9);
            }

            //select
            var cy2 = camera.y + 95 - ((optionIMG.height - 2) / 2) * (sumLines(choice.index, _story));
            //((((optionIMG.height-2)/2)*(sumLines(choice.index, _story)))*(choice.index-choice.options.length)),

            ctx.drawImage(selectIMG, 0, 0, selectIMG.width, selectIMG.height,
                cx, cy2,
                (longest / 10) * (selectIMG.width), (choice.lines[choice.index] / 2) * selectIMG.height);
        }
    }
}

//find the longest line of text
function bigChoice(arr) {
    var longest = 0;
    for (var i = 0; i < arr.length; i++) {
        longest = (arr[i].length > longest ? arr[i].length : longest);
    }
    return longest + 1;
}

//wrap the text if overflowing on the choice box
function choiceText(text, lines, y) {
    var texts = text.split(" | ");
    ctx.font = "14px Courier";
    for (var l = 0; l < lines; l++) {
        ctx.fillText(texts[l], camera.x + 7, y + (l * 9));
    }
}

//
function sumLines(i, _story) {
    var lines = _story.choice_box.lines;
    var sum = 0;
    for (var l = i; l < lines.length; l++) {
        sum += lines[l];
    }
    return sum;
}

function hasMultiLine(_story) {
    for (var l = 0; l < _story.choice_box.lines.length; l++) {
        if (_story.choice_box.lines[l] > 1)
            return true;
    }
    return false;
}

//typewriter functions
var tw = 0;
var curLine = 0; //current line index
var curText = "";
var text_speed = 85;
var text_time = 0; //typewriter effect
var texting = false; //currently typing
var lineTexts = ["", ""]; //the two lines that can be shown on screen
var maxWidth = 140;
var lineHeight = 32;
var jump = -1;

function typewrite() {

    //pre-processing and reset
    if (!texting) {
        curText = story.dialogue.text[story.dialogue.index]; //set the text to the NPC or item text
        if (!curText)
            return;

        //check if section jump
        if (jump == -1) {
            var jumper = curText.match(/<[0-9]+>/g);
            if (jumper) {
                curText = curText.replace(/<[0-9]+>/g, "");
                jump = parseInt(jumper[0].replace(/[<>]/g, ""));
            }
        }
        curText = curText.replace(/<[0-9]+>/g, ""); //catch the stragler
        tw = 0;
        curLine = 0;
        clearText();
        ctx.font = "16px Courier";
        ctx.fillStyle = "#000000";
        texting = true;
    }
    if (tw < curText.length) {
        //if at a new line reset
        if (curText[tw] === "|") {
            tw++;
            curLine++;
            if (curLine > 1) {
                lineTexts[0] = lineTexts[1];
                lineTexts[1] = "";
            }
        }
        //append letters
        else {
            if (curLine == 0)
                lineTexts[0] += curText[tw];
            else
                lineTexts[1] += curText[tw];
        }
        text_time = setTimeout(typewrite, text_speed);
        tw++;
    } else {
        texting = false;
        clearTimeout(text_time);
    }
}

function clearText() {
    lineTexts[0] = "";
    lineTexts[1] = "";
    clearTimeout(text_time);
}

function showText() {
    ctx.fillStyle = "#000000";
    ctx.fillText(lineTexts[0], camera.x + 16, camera.y + 172);
    ctx.fillText(lineTexts[1], camera.x + 16, camera.y + 172 + lineHeight);
}


////////////////////   KEY FUNCTIONS  //////////////////


// key events
var keyTick = 0;
var kt = null;

//check for keydown
document.body.addEventListener("keydown", function (e) {
    //scroll through the options to choose for dialog
    if (story.cutscene && story.choice_box.show) {
        var c = story.choice_box;
        if (e.keyCode == downKey || e.keyCode == rightKey)
            story.choice_box.index = (c.index + 1) % c.options.length;
        else if (e.keyCode == upKey || e.keyCode == leftKey)
            story.choice_box.index = ((c.index + c.options.length) - 1) % c.options.length;
    }
});

//determine if valud key to press
document.body.addEventListener("keydown", function (e) {
    console.log(e.keyCode, moveKeySet, actionKeySet);
    if (inArr(moveKeySet, e.keyCode)) {
        keys[e.keyCode] = true;
    } else if (inArr(actionKeySet, e.keyCode)) {
        keys[e.keyCode] = true;
    }
});

//check for key released
document.body.addEventListener("keyup", function (e) {
    console.log(e.keyCode, moveKeySet, actionKeySet, "up");

    if (inArr(moveKeySet, e.keyCode)) {
        keys[e.keyCode] = false;
    } else if (inArr(actionKeySet, e.keyCode)) {
        keys[e.keyCode] = false;
        reInteract = true;
        text_speed = 85;
    }
});

//prevent scrolling with the game
window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if (([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)) {
        e.preventDefault();
    }
}, false);


//check if any directional key is held down
function anyKey() {
    return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

//movement arrow keys
function moveKeys(_area) {
    if (!player.moving && !player.interact && !story.pause && !story.cutscene) {
        if (keyTick < 1) {
            if (keys[leftKey]) //left key
                player.dir = "west";
            else if (keys[rightKey]) //right key
                player.dir = "east";
            else if (keys[upKey]) //up key
                player.dir = "north";
            else if (keys[downKey]) //down key
                player.dir = "south";
        } else {
            if (keys[leftKey]) //left key
                goWest(player, _area);
            else if (keys[rightKey]) //right key
                goEast(player, _area);
            else if (keys[upKey]) //up key
                goNorth(player, _area);
            else if (keys[downKey]) //down key
                goSouth(player, _area);
        }
    }
}


//action and interaction keys
var reInteract = true;
var cutT = 0;

function actionKeys(_area, _story) {
    //interact [Z]
    var dialogue = _story.dialogue;
    if (keys[a_key] && !player.interact && !player.moving && normal_game_action(_story)) {
        for (var i = 0; i < items.length; i++) {
            if (canInteract(player, items[i], _area) && items[i].text) {

                _story.trigger = "touch_" + items[i].name;
                reInteract = false;
                player.other = items[i];
                player.interact = true;

                if (!_story.cutscene && !_story.triggerWord()) {
                    dialogue.text = items[i].text;
                    dialogue.index = 0;
                    typewrite();
                } else {
                    dialogue.index = 0;
                    _story.play(_area);
                    typewrite();
                }
                return;
            }
        }
        for (var i = 0; i < npcs.length; i++) {
            if (canTalk(player, npcs[i], _area) && npcs[i].text) {
                _story.trigger = "talk_" + npcs[i].name;

                //setup
                reInteract = false;
                player.other = npcs[i];
                player.other.interact = true;
                //faceOpposite(player.other);
                player.interact = true;
                clearInterval(npcs[i].wt);
                npcs[i].wt = 0;

                //normal interaction
                if (!_story.cutscene && !_story.triggerWord()) {
                    dialogue.text = npcs[i].text;
                    dialogue.index = npcs[i].text_index;
                    typewrite();
                }
                //cutscene interaction
                else {
                    dialogue.index = 0;
                    _story.play(_area);
                    typewrite();
                }
                return;
            }
        }
    }
    //finished current dialogue text
    else if (keys[a_key] && dialogue.show && reInteract && !texting) {
        var other = player.other;
        reInteract = false;
        //end of dialogue
        if (dialogue.index + 1 == dialogue.text.length) {
            player.interact = false;

            //select item if options showing
            if (_story.choice_box.show) {
                _story.trigger = "> " + _story.choice_box.options[_story.choice_box.index];
                _story.taskIndex++;
                dialogue.index = 0;
                _story.play(_area);
                typewrite();
                return;
            }

            //normal reset
            if (!_story.cutscene) {
                player.other.interact = false;
                if (jump !== -1) {
                    player.other.text_index = jump;
                    jump = -1;
                }
                dialogue.index = 0;
            } else {
                _story.taskIndex++;
            }
        }
        //still more dialogue left
        else {
            player.other.text_index++;
            dialogue.index++;
            typewrite();
        }
    }
    //increase typewriter speed
    else if (keys[a_key] && dialogue.show && texting) {
        text_speed = 40;
        reInteract = false;
    }

}


function normal_game_action(_story) {
    return (!_story.cutscene && reInteract && !_story.pause);
}


/////////////////////////     GAME FUNCTIONS    /////////////////////

let intervals = [];

var projInc = 0;

export function init(_area, _items, _story) {
    player.show = false;

    story = _story;
    story.setRandomPosition = randomPosition;

    var playerName = prompt("Enter your name");

    //set the timers
    intervals.push(setInterval(function () {
        team.energy -= (team.members.length);
    }, 5000));

    projInc = Math.floor(team.teamSkill[Math.floor(Math.random() * 5)] / 10) + (Math.floor(team.energy / 10) - 3);

    intervals.push(setInterval(function () {
        team.projectProg += (projInc > 0 ? projInc : 0);
        projInc = Math.floor(team.teamSkill[Math.floor(Math.random() * 5)] / 10) + (Math.floor(team.energy / 10) - 3)
        console.log("project increase by: " + projInc);
    }, 7000));

    story.player = player;
    story.team = team;
    story.player.name = playerName;
    player.show = true

    story.quest = "Demo";

    area = _area;

    backgroundImage = new Image();
    backgroundImage.src = "./sprites/background.png";

    dialogImage = new Image();
    dialogImage.src = './sprites/dialog_box.png';

    projectBarImage = new Image();
    projectBarImage.src = './sprites/projectbar.png';

    teamBarImage = new Image();
    teamBarImage.src = './sprites/teambar.png';

    energyBarImage = new Image();
    energyBarImage.src = './sprites/energypic.png';

    fillerBarImage = new Image();
    fillerBarImage.src = './sprites/fullbar.png';

    areaImage = new Image();
    if (area.scene === 'main') {
        areaImage.src = "./sprites/hackarea.png";
    } else if (area.scene === 'hall') {
        areaImage.src = "./sprites/Hallway.png";
    }

    player.x = area.startingCoordinates.x;
    player.y = area.startingCoordinates.y;

    // items

    items = _items;

    return area;
}

// todo: figure out what this is supposed to do
function startGame(_story) {
    _story.quest = "Register";
    _story.trigger = "start_game";
    makeHallArea();
    //resetCamera(area);
}


function randomPosition(item, _area) {
    let x = Math.floor(Math.random() * _area.cols);
    let y = Math.floor(Math.random() * _area.rows);

    while (!goodSpot(x, y, _area.map, _area.rows, _area.cols, npcs, items)) {
        x = Math.floor(Math.random() * _area.cols);
        y = Math.floor(Math.random() * _area.rows);
    }

    item.x = x * _area.size;
    item.y = y * _area.size;
}

export function animate() {
    requestAnimationFrame(animate);
    canvas.focus();
    render(area, story);

    story.play(area);

    //player movement
    var pixX = Math.round(player.x / area.size);
    var pixY = Math.round(player.y / area.size);

    if (!story.pause) {
        travel(player, area);
        if (player.action == "travel")
            story.trigger = "x" + pixX + "_y" + pixY;
    }

    panCamera(area);

    //npc movement
    if (!story.pause) {
        npcs.forEach(npc => {
            travel(npc, area);
            defaultBehavior(npc, area, story);
        });
    }

    //dialogue
    if (!story.cutscene) {
        if (player.interact) {
            story.dialogue.show = true;
        } else {
            story.dialogue.show = false;
            clearText();
        }
    }

    //keyboard ticks
    var akey = anyKey();
    if (akey && kt == 0) {
        kt = setInterval(function () {
            keyTick += 1
        }, 75);
    } else if (!akey) {
        clearInterval(kt);
        kt = 0;
        keyTick = 0;
    }
    moveKeys(area);
    actionKeys(area, story);


    if (team.energy <= 0 && !story.pause) {
        window.alert("RAN OUT OF ENERGY! GAME OVER");
        stopGame(story);
    } else if (team.projectProg >= 100 && !story.pause) {
        window.alert("CONGRATS! YOU FINISHED YOUR PROJECT!");
        stopGame(story);
    }
}

function stopGame(_story) {
    _story.pause = true;

    intervals.forEach(interval => {
        clearInterval(interval);
    });
}

