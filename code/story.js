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
		show : false
	},

	//choice 
	choice_box : {
		options : [],
		index : 0,
		lines : [],
		show : false
	},

	playerCt : 0
}