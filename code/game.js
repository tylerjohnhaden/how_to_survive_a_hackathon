//Game code//


//set up the canvas
var canvas = document.createElement("canvas");
canvas.id = "game";
var ctx = canvas.getContext("2d");
canvas.width = 288;
canvas.height = 224;
document.body.appendChild(canvas);

//background image
var bgPNG = new Image();
bgPNG.src = "../sprites/background.png";
bgPNG.onload = function(){
	ctx.drawImage(bgPNG, 0, 0);
};

//background image
var hackAreaPNG = new Image();
hackAreaPNG.src = "../sprites/hackarea.png";
hackAreaPNG.onload = function(){
	ctx.drawImage(hackAreaPNG, 0, 32);
};


//level
var map = [];
var rows = 12;
var cols = 18;
var size = story.size;
var level_loaded = false;
var collideTiles = [];
var tiles = new Image();
//tiles.src = "map/tileset.png";
var tilesReady = false;
tiles.onload = function(){
	tilesReady = true;
};
var tpr = 5; //tiles per row

//camera
var camera = {
	x : 0,
	y : 0
};

//lists
var items = [];
var npcs = [];


// directionals
var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

// A and B
var a_key = 90;   //[Z]
var b_key = 88;   //[X]

// select and start
var select_key = 16;   //[Shift]
var start_key = 13;   //[Enter]

var actionKeySet = [a_key, b_key, select_key, start_key];
var keys = [];


var playerIMG = new Image();
playerIMG.src = "../sprites/main.png";
var playerReady = false;
playerIMG.onload = function(){playerReady = true;};

var player = {
	//sprite properties
		name : "Hax",
		width : 16,
		height : 16,
		img : playerIMG,
		ready : playerReady,

		//movement
		speed : 2,
		initPos : 0,
		moving : false,
		x : 8 * size, 
		y : 4 * size,
		velX : 0,
		velY : 0,
		show : true,

		//other properties
		interact : false,
		other : null,
		pathQueue : [],
		lastPos : [],
		following : false,

}



/////////////////     GENERIC FUNCTIONS   ///////////

//checks if an element is in an array
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}



//////////////////  PLAYER CONTROLS /////////////////

//directional movement
function goNorth(sprite){
	if(!sprite.moving){
		sprite.initPos = Math.floor(sprite.y / size) * size;
		sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
		sprite.dir = "north";
		sprite.action = "travel";
	}
}
function goSouth(sprite){
	if(!sprite.moving){
		sprite.initPos = Math.floor(sprite.y / size) * size;
		sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
		sprite.dir = "south";
		sprite.action = "travel";
	}
}
function goEast(sprite){
	if(!sprite.moving){
		sprite.initPos = Math.floor(sprite.x / size) * size;
		sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
		sprite.dir = "east";
		sprite.action = "travel";
	}
}
function goWest(sprite){
	if(!sprite.moving){
		sprite.initPos = Math.floor(sprite.x / size) * size;
		sprite.lastPos = [Math.floor(sprite.x / size), Math.floor(sprite.y / size)];
		sprite.dir = "west";
		sprite.action = "travel";
	}
}

//movement on the map
function travel(sprite){
	if(sprite.action == "travel"){   //continue if allowed to move
		var curspeed = sprite.speed;

		//travel north
		if(sprite.dir == "north"){
			if(Math.floor(sprite.y) > (sprite.initPos - size) && !collide(sprite)){
				sprite.velY = curspeed;
				sprite.y += velControl(Math.floor(sprite.y), -sprite.velY, (sprite.initPos - size));
				sprite.moving = true;
			}else{
				sprite.velY = 0;
				sprite.action = "idle";
				sprite.moving = false;
			}
		}else if(sprite.dir == "south"){
			if(Math.floor(sprite.y) < (sprite.initPos + size) && !collide(sprite)){
				sprite.velY = curspeed;
				sprite.y += velControl(Math.floor(sprite.y), sprite.velY, (sprite.initPos + size));
				sprite.moving = true;
			}else{
				sprite.velY = 0;
				sprite.action = "idle";
				sprite.moving = false;
			}
		}else if(sprite.dir == "east"){
			if(Math.floor(sprite.x) < (sprite.initPos + size) && !collide(sprite)){
				sprite.velX = curspeed;
				sprite.x += velControl(Math.floor(sprite.x), sprite.velX, (sprite.initPos + size));
				sprite.moving = true;
			}else{
				sprite.velX = 0;
				sprite.action = "idle";
				sprite.moving = false;
			}
		}else if(sprite.dir == "west"){
			if(Math.floor(sprite.x) > (sprite.initPos - size) && !collide(sprite)){
				sprite.velX = curspeed;
				sprite.x += velControl(Math.floor(sprite.x), -sprite.velX, (sprite.initPos - size));
				sprite.moving = true;
			}else{
				sprite.velX = 0;
				sprite.action = "idle";
				sprite.moving = false;
			}
		}
	}
}

//velocity control
function velControl(cur, value, max){
	//increment or decrement
	if(value > 0){
		if((cur + value) > max)
			return velControl(cur, Math.floor(value/2), max);
		else
			return value;
	}else if(value < 0){
		if((cur + value) < max)
			return velControl(cur, Math.floor(value/2), max);
		else
			return value;
	}else{
		return 1;
	}
}



///////////////   INTERACT   ////////////////



//the interact function
function canInteract(person, item){
	if(!item.show)
		return false;

	//get the positions
		var rx;
		var ry;
		if(person.dir === "north" || person.dir === "west"){
			rx = Math.ceil(person.x / size);
			ry = Math.ceil(person.y / size);
		}else if(person.dir === "south" || person.dir === "east"){
			rx = Math.floor(person.x / size);
			ry = Math.floor(person.y / size);
		}
	
		//decide if adjacent to person
		var t = item;
		var xArea = [];
		var yArea = [];
		if(t.area !== null){
			var t_ba = item.area;

			//get bounding box area
			for(var z=0;z<t_ba.w;z++){
				xArea.push(t_ba.x+t.x+z);
			}
			for(var z=0;z<t_ba.h;z++){
				yArea.push(t_ba.y+t.y+z);
			}
		}else{
			xArea.push(t.x);
			yArea.push(t.y);
		}
		

		//determine if able to interact
		if(person.dir == "north" && (inArr(xArea, rx) && inArr(yArea, ry-1)))
			return true;
		else if(person.dir == "south" && (inArr(xArea, rx) && inArr(yArea, ry+1)))
			return true;
		else if(person.dir == "east" && (inArr(xArea, rx+1) && inArr(yArea, ry)))
			return true;
		else if(person.dir == "west" && (inArr(xArea, rx-1) && inArr(yArea, ry)))
			return true;
	
	return false;
}

//the talk function
function canTalk(person, other_pers){
	if(other_pers.moving || !other_pers.show)
		return false;

	//get the positions
		var rx;
		var ry;
		if(person.dir === "north" || person.dir === "west"){
			rx = Math.ceil(person.x / size);
			ry = Math.ceil(person.y / size);
		}else if(person.dir === "south" || person.dir === "east"){
			rx = Math.floor(person.x / size);
			ry = Math.floor(person.y / size);
		}
	
		//decide if adjacent to person
		nx = Math.floor(other_pers.x / size);
		ny = Math.floor(other_pers.y / size);

		if(person.dir == "north" && (rx == nx) && (ry-1 == ny))
			return true;
		else if(person.dir == "south" && (rx == nx) && (ry+1 == ny))
			return true;
		else if(person.dir == "east" && (rx+1 == nx) && (ry == ny))
			return true;
		else if(person.dir == "west" && (rx-1 == nx) && (ry == ny))
			return true;
}	

//faces the main character
function faceOpposite(npc){
	if(player.dir === "north")
		npc.dir = "south";
	else if(player.dir === "south")
		npc.dir = "north"
	else if(player.dir === "west")
		npc.dir = "east"
	else if(player.dir === "east")
		npc.dir = "west"
}

//non-cutscene specific behavior
function defaultBehavior(npc){
	if(!story.cutscene){
		if(npc.interact){
			clearInterval(npc.wt);
			npc.wt = 0;
		}
		if(npc.move === "drunk_walk" && !npc.interact && npc.show){
			if(npc.wt == 0 && !npc.moving){
				npc.wt = setInterval(function(){
					drunkardsWalk(npc, npc.boundary);
					clearInterval(npc.wt);
					npc.wt = 0;
				}, (Math.random() * 2 + 1)*1000);
			}
		}
	}else{
	  clearInterval(npc.wt);
	  npc.wt = 0;
	}
}

//grouped collision checker
function collide(sprite, boundary=null){
	return false;
	//return hitNPC(sprite) || hitItem(sprite) || hitWall(sprite) || hitBoundary(sprite, boundary)
}


///////////////////   CAMERA  /////////////////////


//if within the game bounds
function withinBounds(x,y){
	var xBound = (x >= Math.floor(camera.x / 16) - 1) && (x <= Math.floor(camera.x / 16) + (canvas.width / 16));
	return xBound;
}

//have the camera follow the player
function panCamera(){
	if(level_loaded){
		//camera displacement
		if((player.x >= (canvas.width / 2)) && (player.x <= (map[0].length * size) - (canvas.width / 2)))
			camera.x = player.x - (canvas.width / 2);

		if((player.y >= (canvas.height / 2) - size/2) && (player.y <= (map.length * size) - (canvas.height / 2)))
			camera.y = player.y - (canvas.height / 2 - size/2);
	}
	
}

//reset the camera's position on the player
function resetCamera(){
	camera.x = 0;
	camera.y = 0;

	if((player.x > (map[0].length * size) - (canvas.width / 2)))
		camera.x = (map[0].length * size) - canvas.width;

	if((player.y > (map.length * size) - (canvas.height / 2)))
		camera.y = (map.length * size) - canvas.height;
}




///////////////////    NPCS    //////////////////



//random walking
function drunkardsWalk(sprite, boundary=null){
	var dice;
	var directions = ["north", "south", "west", "east"];
	if(!sprite.moving){
		var pseudoChar = {dir : directions[0], x : sprite.x, y : sprite.y}
		//check if it would hit other character
		do{
			dice = Math.floor(Math.random() * directions.length);
			pseudoChar.dir = directions.splice(dice, 1)[0];

			//no options left
			if(directions.length == 0)
				return;
		
		}while(collide(pseudoChar, boundary) || hitOther(pseudoChar, player))

		//move in direction
		if(pseudoChar.dir === "north"){
			goNorth(sprite);
		}else if(pseudoChar.dir === "south"){
			goSouth(sprite);
		}else if(pseudoChar.dir === "west"){
			goWest(sprite);
		}else if(pseudoChar.dir === "east"){
			goEast(sprite);
		}
	}
}

//look in random directions
function drunkardsLook(sprite){
	var dice;
	var directions = ["north", "south", "west", "east"];
	dice = Math.floor(Math.random() * 4);
	sprite.dir = directions[dice];
}

//act upon the robot pathQueue
function smallStep(robot){
	if(robot.pathQueue.length != 0 && !robot.moving){       //if not already moving and not an empty pathQueue
		var nextStep = robot.pathQueue[0];
		var curX = Math.floor(robot.x / 16);
		var curY = Math.floor(robot.y / 16);

		//changing y pos
		if(curX == nextStep[0]){
			if(nextStep[1] < curY)
				goNorth(robot);
			else if(nextStep[1] > curY)
				goSouth(robot);
		}   
		//changing x pos    
		else if(curY == nextStep[1]){
			if(nextStep[0] < curX)
				goWest(robot);
			else if(nextStep[0] > curX)
				goEast(robot);
		}
		//remove the node once reached
		robot.lastPos = robot.pathQueue.shift();
		//robot.lastPos = [Math.floor(robot.x / size), Math.floor(robot.y / size)];
	}
}



////////////////////////          RENDER         //////////////////////

//check for render ok
function checkRender(){
	//tiles
	if(!tilesReady){
		tiles.onload = function(){
			tilesReady = true;
		};
	}


	//player
	if(!player.ready){
		player.img.onload = function(){player.ready = true;}
		if(player.img.width !== 0){
			player.ready = true;
		}
	}

	//npcs
	for(var a=0;a<npcs.length;a++){
		if(!npcs[a].ready){
			if(npcs[a].img.width !== 0){
				npcs[a].ready = true;
			}
		}
	}

	//item
	for(var i=0;i<items.length;i++){
		if(!items[i].ready){
			if(items[i].img.width !== 0){
				items[i].ready = true;
			}
		}
	}

	/*
	//gui
	if(!dialogReady){
		dialogIMG.onload = function(){dialogReady = true;};
	}
	*/
}


function drawchar(sprite){
	if(sprite.ready && sprite.show)
		ctx.drawImage(sprite.img, sprite.x, sprite.y);
}

//draw a character sprite
function drawsprite(sprite){
	updatesprite(sprite);
	rendersprite(sprite);
}

//update animation
function updatesprite(sprite){
	//update the frames
	if(sprite.ct == (sprite.fps - 1))
		sprite.curFrame = (sprite.curFrame + 1) % sprite.seqlength;
		
	sprite.ct = (sprite.ct + 1) % sprite.fps;
}
//draw the sprite
function rendersprite(sprite){
	//set the animation sequence
	var sequence;
	if(sprite.dir == "north"){
		if(sprite.action == "idle")
			sequence = sprite.idleNorth;
		else 
			sequence = sprite.moveNorth;
	}
	else if(sprite.dir == "south"){
		if(sprite.action == "idle")
			sequence = sprite.idleSouth;
		else 
			sequence = sprite.moveSouth;
	}
	else if(sprite.dir == "west"){
		if(sprite.action == "idle")
			sequence = sprite.idleWest;
		else 
			sequence = sprite.moveWest;
	}
	else if(sprite.dir == "east"){
		if(sprite.action == "idle")
			sequence = sprite.idleEast;
		else 
			sequence = sprite.moveEast;
	}
	
	//get the row and col of the current frame
	var row = Math.floor(sequence[sprite.curFrame] / sprite.fpr);
	var col = Math.floor(sequence[sprite.curFrame] % sprite.fpr);
	
	var curheight = sprite.height;
	var offY = sprite.offsetY;
	var sprIMG = sprite.img;

	if(sprite.show && sprite.ready){
		ctx.drawImage(sprIMG, 
		col * sprite.width, row * curheight, 
		sprite.width, curheight,
		sprite.x - sprite.offsetX, sprite.y - offY, 
		sprite.width, curheight);
	}
}

//render everything 
function render(){
	checkRender();
	ctx.save();

	ctx.translate(-camera.x, -camera.y);

	//clear eveoything
	ctx.clearRect(camera.x, camera.y, canvas.width,canvas.height);
	
	//re-draw bg
	var ptrn = ctx.createPattern(bgPNG, 'repeat'); // Create a pattern with this image, and set it to "repeat".
	ctx.fillStyle = ptrn;
	ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
	
	//draw hack are
	ctx.drawImage(hackAreaPNG, 0, 32);

	//draw the map
	//drawMap();

	//draw the buildings if behind player

	for(var i=0;i<items.length;i++){
		if(items[i].thru)
			renderItem(items[i]);
	}

	//if npc behind player
	for(var c=0;c<npcs.length;c++){
		if(player.y >= npcs[c].y)
			drawsprite(npcs[c]);
	}

	//draw player
	drawchar(player);

	//gui
	//drawGUI();


	//if(story.area === "vals")
		//drawTestMap(levelList[1]);

	ctx.restore();
	// requestAnimationFrame(render);

}



////////////////////   KEY FUNCTIONS  //////////////////



// key events
var keyTick = 0;
var kt = null; 

//check for keydown
document.body.addEventListener("keydown", function (e) {
	//scroll through the options to choose for dialog
	if(story.cutscene && story.choice_box.show){
		var c = story.choice_box;
		if(e.keyCode == downKey || e.keyCode == rightKey)
			story.choice_box.index = (c.index + 1) % c.options.length;
		else if(e.keyCode == upKey || e.keyCode == leftKey)
			story.choice_box.index = ((c.index + c.options.length) - 1) % c.options.length;
	}
});

//determine if valud key to press
document.body.addEventListener("keydown", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = true;
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = true;
	}
});

//check for key released
document.body.addEventListener("keyup", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = false;
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = false;
		reInteract = true;
		text_speed = 85;
	}
});

//prevent scrolling with the game
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }
}, false);


//check if any directional key is held down
function anyKey(){
	return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

//movement arrow keys
function moveKeys(){
	if(!player.moving && !player.interact  && !story.pause && !story.cutscene){
		if(keyTick < 1){
		if(keys[leftKey])         //left key
			player.dir = "west";
		else if(keys[rightKey])    //right key
			player.dir = "east";
		else if(keys[upKey])    //up key
			player.dir = "north";
		else if(keys[downKey])    //down key
			player.dir = "south";
		}else{
		if(keys[leftKey])         //left key
			goWest(player);
		else if(keys[rightKey])    //right key
			goEast(player);
		else if(keys[upKey])    //up key
			goNorth(player);
		else if(keys[downKey])    //down key
			goSouth(player);
		}
	}
}


//action and interaction keys
var reInteract = true;
var cutT = 0;
function actionKeys(){
	//interact [Z]
	var dialogue = story.dialogue;
	if(keys[a_key] && !player.interact && !player.moving && normal_game_action()){
		for(var i=0;i<items.length;i++){
			if(canInteract(player, items[i]) && items[i].text){
				story.trigger = "touch_" + items[i].name;
				reInteract = false;
				player.other = items[i];
				player.interact = true;

				if(!story.cutscene && !triggerWord(story.trigger)){
					dialogue.text = items[i].text;
					dialogue.index = 0;
					typewrite();
				}else{
					dialogue.index = 0;
					play();
					typewrite();
				}
				return;
			}
		}
		for(var i=0;i<npcs.length;i++){
			if(canTalk(player, npcs[i]) && npcs[i].text){
				story.trigger = "talk_" + npcs[i].name;

				//setup
				reInteract = false;
				player.other = npcs[i];
				player.other.interact = true;
				faceOpposite(player.other);
				player.interact = true;
				clearInterval(npcs[i].wt);
				npcs[i].wt = 0;

				//normal interaction
				if(!story.cutscene && !triggerWord(story.trigger)){
					dialogue.text = npcs[i].text;
					dialogue.index = npcs[i].text_index;
					typewrite();
				}
				//cutscene interaction
				else{
					dialogue.index = 0;
					play();
					typewrite();
				}
				return;
			}
		}
	}
	//finished current dialogue text
	else if(keys[a_key] && dialogue.show && reInteract && !texting){
		var other = player.other;
		reInteract = false;
		//end of dialogue
		if(dialogue.index +1 == dialogue.text.length){
			player.interact = false;

			//select item if options showing
			if(story.choice_box.show){
				story.trigger = "> " + story.choice_box.options[story.choice_box.index];
				story.taskIndex++;
				dialogue.index = 0;
				play();
				typewrite();
				return;
			}

			//normal reset
			if(!story.cutscene){
				player.other.interact = false;
				if(jump !== -1){
					player.other.text_index = jump;
					jump = -1;
				}
				dialogue.index = 0;
			}else{
				story.taskIndex++;
			}
		}
		//still more dialogue left
		else{
			player.other.text_index++;
			dialogue.index++;
			typewrite();
		}
	}
	//increase typewriter speed 
	else if(keys[a_key] && dialogue.show && texting){
		text_speed = 40;
		reInteract = false;
	}

}


function normal_game_action(){
	return (!story.cutscene && reInteract && !story.pause);
}


/////////////////////////     GAME FUNCTIONS    /////////////////////

function init(){
	map = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			];
	level_loaded = true;
}

function main(){
	requestAnimationFrame(main);
	canvas.focus();
	render();

	//player movement
	if(!story.pause)
		travel(player);

	panCamera();

	//npc movement
	if(!story.pause){
		for(var n = 0;n<npcs.length;n++){
			var npc = npcs[n];
			travel(npc);
			defaultBehavior(npc);
		}
	}

//keyboard ticks
	var akey = anyKey();
	if(akey && kt == 0){
		kt = setInterval(function(){keyTick+=1}, 75);
	}else if(!akey){
		clearInterval(kt);
		kt = 0;
		keyTick=0;
	}
	moveKeys();
	actionKeys();

	///////////////    DEBUG   //////////////////

	var pixX = Math.round(player.x / size);
	var pixY = Math.round(player.y / size);

	if(npcs.length > 0){
		var nx = Math.round(npcs[0].x / size);
		var ny = Math.round(npcs[0].y / size);
	}

	var settings = "X: " + Math.round(player.x) + " | Y: " + Math.round(player.y);
	settings += " --- Pix X: " + pixX + " | Pix Y: " + pixY;
	document.getElementById('debug').innerHTML = settings;

}

/*
//prevent scrolling with the game
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }
}, false);
*/

main();