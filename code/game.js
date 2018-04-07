//Game code//


//set up the canvas
var canvas = document.createElement("canvas");
canvas.id = "game";
var ctx = canvas.getContext("2d");
canvas.width = 160;
canvas.height = 144;
document.body.appendChild(canvas);

//background image
var bgPNG = new Image();
bgPNG.src = "../sprites/background.png";
bgPNG.onload = function(){
	ctx.drawImage(bgPNG, 0, 0);
};

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


function init(){
	
}

function main(){
	requestAnimationFrame(main);
	canvas.focus();
	//render();
}
main();