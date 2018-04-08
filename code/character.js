
//SETUP
var size = 16;

//area for collision (x and y are relative to the object starting from the top right)
function boundArea(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}


function getIMGNPC(name){
  var charIMG = new Image();
  charIMG.src = "../sprites/" + name + ".png";
  var charReady = false;
  charIMG.onload = function(){charReady = true;};

  this.img = charIMG;
  this.ready = charReady;

}

function skill(dep, dev, des, deb, res){
	this.deploy = dep;
	this.develop = dev;
	this.design = des;
	this.debug = deb;
	this.research = res;
}

function hacker(name, x, y, classType, skillSet){
	this.name = name;
	this.x = x*story.size;
	this.y = y*story.size;
	this.classType = classType;
	this.skillSet = skillSet;

	this.width = 16;
	this.height = 16;
	this.dir = "north";
	this.action = "idle";
	this.moving = false;

	//other properties
	this.text = ["Hi! My name is " + name + "!", "I'm a " + classType + "<0>"];
	this.text_index = 0;
	this.interact = false;

	var set = new getIMGNPC(classType);
	this.img = set.img;
	this.ready = set.ready;
	this.show = true;
}

function npc(name, x, y, text, skin){
	var set = new getIMGNPC(skin);

  	//sprite properties
  	this.name = name;
  	this.width = 16;
  	this.height = 20;
	this.img = set.img;
  	this.ready = set.ready;


	this.text = text;
	this.move = "drunk_walk";
	this.interact = false;
  	this.boundArea;

	//movement
  	this.speed = 1;
  	this.initPos = 0;
  	this.moving = false;
  	this.x = x * 16; 
  	this.y = y * 16;
  	this.velX = 0;
 	this.velY = 0;
  	this.fps = 4;            //frame speed
  	this.fpr = 12;           //# of frames per row
  	this.show = true;
}