var story = {
	//character stats
	player : null,

	//level data
	size : 32,
	pause : false,

	//mission
	//quest : "Introduction",
	quest : "None",
	storyIndex : 0,
	taskIndex : 0,
	trigger : "none",
	cutscene : false,

	//dialogue
	dialogue : {
		text : "",
		index : 0,
		show : false,
		threshold : 0
	},

	//choice 
	choice_box : {
		options : [],
		index : 0,
		lines : [],
		show : false
	},

	//overlay screen
	overlay : {
		show : false
	},

	pseudoOther : {
		textIndex : 0,
		show : true,
		interact : true,
	},

	playerCt : 0
}


function triggerWord(word){
	if(story.quest === "Register")
		return true;
	else
		return false;
	
}

//reset the gui and cutscene stuff within the game
function endScene(){
	story.taskIndex = 0;
	story.dialogue.show = false;
	story.dialogue.text = [""];
	story.choice_box.show = false;
	story.cutscene = false;
	story.player.other.interact = false;
	story.player.other.textIndex = 0;
	story.player.interact = false;
	story.dialogue.index = 0;
	story.trigger = "none";
}

function newDialog(dialogue){
	story.dialogue.text = dialogue;
	story.dialogue.show = true;
}

//count the lines from each choice given
function countChoice(){
	var choice = story.choice_box;
	var lines = [];
	for(var c=0;c<choice.options.length;c++){
		lines.push(choice.options[c].split(" | ").length);
	}
	choice.lines = lines;
}

//make new choice boxes
function newChoice(options){
	story.choice_box.show = true;
	story.choice_box.options = options;
	countChoice();
}

//reset the choice options
function endChoice(){
	story.choice_box.show = false;
	story.choice_box.index = 0;
	story.choice_box.lines = [];
}

function play(){
	//make local variables
	var trigger = story.trigger;
	var storyIndex = story.storyIndex;
	var taskIndex = story.taskIndex;
	var cutscene = story.cutscene;
	var dialogue = story.dialogue;
	var choice = story.choice_box;
	var questItem;
	var player;
	if(story.player){
		player = story.player;
		questItem = player.tradeItem;
	}


if(story.quest === "Register"){

	if(trigger === "start_game"){
		story.cutscene = true;
		story.player.other = story.pseudoOther;
		if(taskIndex == 0){
			newDialog(["...","Hacker: Wow! This gym is | huge!",
				"I can't wait to see | what swag they have to | offer!"])
		}else if(taskIndex == 1){
			endScene();	
		}
	}

	if(trigger.match(/x[0-9]+_y4/) && dialogue.threshold == 0){
		story.cutscene = true;
		console.log("Activate!");
		if(taskIndex == 0){
			newDialog(["Hacker: There's so many | people...",
					"Where do I check in?",
					"I guess I should follow the | crowd."]);
		}else if(taskIndex == 1){
			dialogue.threshold++;
			endScene();
		}
	}

	if(trigger === "talk_organizer"){
		story.cutscene = true;
		if(taskIndex == 0){
			newDialog(["Hacker: Hey. I am here for | the hackathon.",
				"Clerk: Thanks for coming! | Would you like some swag to start | off?",
				"Swag helps increase your energy | and so does interacting with | people.",
				"Hacker: Sure thanks!",
				"(Energy boosted by 10!)",
				"Clerk: May I have your name | so we can check you in?"]);
		}else if(taskIndex == 1){
			var playerName = prompt("What is your name?", "Player");
			while(playerName == null || playerName == ""){
				playerName = prompt("What is your name?", "Player");
			}
			story.player.name = playerName;
			newDialog(["Hacker: Sure, my name is " + playerName,
				"Clerk: Alrighty" + playerName + " , you are set to go.",
				"The opening ceremony will begin | in about 15 minutes.",
				"It will be located at the | pavillion which by the | center stage.",
				"In the meantime, try talking to some | people and don't forget to grab | your swag!"])
		}else if(taskIndex == 2){
			endScene();
		}
	}

}
else if(story.quest === "Hack"){
	
}



}