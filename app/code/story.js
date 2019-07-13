export let story = {
    //character stats
    player: null,
    team: null,

    storyFunct: [],

    //level data
    size: 32,
    pause: false,

    //mission
    //quest : "Introduction",
    quest: "None",
    storyIndex: 0,
    taskIndex: 0,
    trigger: "none",
    cutscene: false,
    scene: "hall",

    //dialogue
    dialogue: {
        text: "",
        index: 0,
        show: false,
        threshold: 0
    },

    //choice
    choice_box: {
        options: [],
        index: 0,
        lines: [],
        show: false
    },

    //overlay screen
    overlay: {
        show: false
    },

    pseudoOther: {
        textIndex: 0,
        show: true,
        interact: true,
    },

    playerCt: 0
}


export function triggerWord(word) {
    if (story.quest === "Register")
        return true;
    else if (story.quest === "Demo") {
        if (word.match(/touch*/g))
            return true;
        else
            return false;
    } else if (story.quest === "Small Talk")
        return true;
    else
        return false;

}

//reset the gui and cutscene stuff within the game
function endScene() {
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

function newDialog(dialogue) {
    story.dialogue.text = dialogue;
    story.dialogue.show = true;
}

//count the lines from each choice given
function countChoice() {
    var choice = story.choice_box;
    var lines = [];
    for (var c = 0; c < choice.options.length; c++) {
        lines.push(choice.options[c].split(" | ").length);
    }
    choice.lines = lines;
}

//make new choice boxes
function newChoice(options) {
    story.choice_box.show = true;
    story.choice_box.options = options;
    countChoice();
}

//reset the choice options
function endChoice() {
    story.choice_box.show = false;
    story.choice_box.index = 0;
    story.choice_box.lines = [];
}

export function play() {
    //make local variables
    var trigger = story.trigger;
    var storyIndex = story.storyIndex;
    var taskIndex = story.taskIndex;
    var cutscene = story.cutscene;
    var dialogue = story.dialogue;
    var choice = story.choice_box;
    var questItem;
    var player;
    if (story.player) {
        player = story.player;
    }


    if (story.quest === "Demo") {
        if (trigger === "touch_floppy") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["You got the floppy disk!", "Your overall team skill | has improved!"]);

            } else if (taskIndex == 1) {
                for (var t = 0; t < 5; t++) {
                    story.team.teamSkill[t] += 5;
                }
                story.storyFunct[2](player.other);
                endScene();
            }
        } else if (trigger === "touch_wifi") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["You found the wifi!", "Your project is 2% more | done!"]);

            } else if (taskIndex == 1) {
                story.projectProg += 2;
                story.storyFunct[2](player.other);
                endScene();
            }
        } else if (trigger === "touch_coffee") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["You got the coffee!", "Your team's energy | increased by 10!"]);

            } else if (taskIndex == 1) {
                story.team.energy += 10;
                story.storyFunct[2](player.other);
                endScene();
            }
        } else if (trigger === "touch_redbull") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["You got the Red Bull!", "Your team's energy | increased by 15!"]);

            } else if (taskIndex == 1) {
                story.team.energy += 15;
                story.storyFunct[2](player.other);
                endScene();
            }
        } else if (trigger === "touch_project") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["Project: 4d 49 4c 4b",
                    "I am " + story.team.projectProg + "% complete!"
                ]);
            } else if (taskIndex == 1) {
                endScene();
            }
        }
    } else if (story.quest === "Register") {

        if (trigger === "start_game") {
            story.cutscene = true;
            story.player.other = story.pseudoOther;
            if (taskIndex == 0) {
                newDialog(["...", player.name + ": Wow! This gym is | huge!",
                    "I can't wait to see | what swag they have to | offer!"
                ])
            } else if (taskIndex == 1) {
                endScene();
            }
        }

        if (trigger.match(/x8_y[0-9]/) && dialogue.threshold == 0 && story.scene === "hall") {
            story.storyFunct[1]();
            alert('ee');
        }
        if (trigger.match(/x8_y[0-9]/) && dialogue.threshold == 0 && story.scene === "main") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["...", player.name + ": There's so many | people...",
                    "Where do I check in?",
                    "I guess I should look | for a staff member."
                ]);

            } else {

                endScene();
                dialogue.threshold++;
            }
        }


        if (trigger === "talk_organizer") {
            story.cutscene = true;
            if (taskIndex == 0) {
                var playerName = story.player.name;
                newDialog([player.name + ": Hey. I am here for | the hackathon.",
                    "Clerk: Thanks for coming! | Would you like some swag to | start off?",
                    "Swag helps increase your| energy and so does | interacting with people.",
                    player.name + ": Sure thanks!",
                    "(Energy boosted by 10!)",
                    "Clerk: May I have your name | so we can check you in?",
                    player.name + ": Sure, my name is | " + playerName,
                    "Clerk: Alrighty, " + playerName + ", | you are set to go.",
                    "The opening ceremony will | begin in about 15 minutes.",
                    "It will be located at the | pavillion which by the | center stage.",
                    "In the meantime, try | talking to some people | and don't forget to grab | your swag!"
                ]);
            } else if (taskIndex == 1) {
                story.team.energy += 10;
                story.quest = "Small Talk";
                dialogue.threshold = 0;
                endScene();
            }
        }

    } else if (story.quest === "Small Talk") {

        //talk to random npcs
        if (trigger === "talk_???") {
            story.cutscene = true;
            if (taskIndex == 0) {
                if (dialogue.threshold % 3 == 0) {
                    newDialog(["???: I feel so jittery~! | Do I have wings yet?",
                        "You can regain energy by | getting a sweet dose | of caffiene.",
                        "Redbull is my favorite!",
                        "You can also try | sleeping and eating | caffiene packed chocolate | bars.",
                        player.name + ": (Jeez is everyone | like this?)"
                    ]);
                } else if (dialogue.threshold % 3 == 1) {
                    newDialog(["???: I am so | excited to impress the | judges.",
                        "I heard the prizes | include internships and | gaming consoles.",
                        "Doesn't that sound | like an awesome combination?"
                    ]);
                } else if (dialogue.threshold % 3 == 2) {
                    newDialog(["???: Hey did you hear about | that one company's | challenge?",
                        "They want the hackers | to create something unique!",
                        "Sounds fun doesn't it? | That can be anything!"
                    ]);
                }
            } else if (taskIndex == 1) {
                endScene();
                dialogue.threshold++;
            }
        }

        //announcement after 3 talks
        else if (trigger.match(/x[0-9]+_y[0-9]+/g) && dialogue.threshold == 3) {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["!!!!", "Staff: Hello hackers! | Just a quick announcement.",
                    "The hackathon will begin | shortly so start picking | members for your team.",
                    "You can only have four | members in a team.",
                    "Talk to fellow hackers | They will have information | about their skills."
                ])
            } else if (taskIndex == 1) {
                dialogue.threshold++;
                endScene();
            }
        }

        //talk to hackers
        else if (trigger === "talk_Mac") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["Mac: I really like | release the final product.",
                    "Marketing is one of | my strong suits."
                ])
            } else if (taskIndex == 1) {
                endScene();
            }
        } else if (trigger === "talk_Sonia") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["Sonia: Finding bugs in | code and squashing them | is super fun.",
                    "Let me solve your | frustrations. It may just | be a simple error."
                ])
            } else if (taskIndex == 1) {
                endScene();
            }
        } else if (trigger === "talk_Nick") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["Nick: Development in the | back-end fits my | style more.",
                    "I can't wait to | start programming."
                ])
            } else if (taskIndex == 1) {
                endScene();
            }
        } else if (trigger === "talk_Anthony") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["Anthony: I don't believe | in messy code.",
                    "The design and structure is | the most important part | of a program."
                ])
            } else if (taskIndex == 1) {
                endScene();
            }
        } else if (trigger === "talk_Belle") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["Belle: The internet is full of | information~!",
                    "I research a lot. | There are so many | posibilities."
                ])
            } else if (taskIndex == 1) {
                endScene();
            }
        } else if (trigger === "talk_Troy") {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["Troy: I know just | a little bit of | everything.",
                    "Kind of like a jack-of-all | trades you know?"
                ])
            } else if (taskIndex == 1) {
                endScene();
            }
        }

        //go back to the organizer
        else if (trigger === "talk_organizer" && dialogue.threshold > 3) {
            story.cutscene = true;
            if (taskIndex == 0) {
                newDialog(["Staff: Do you know who you | want to be on your team | yet?"])
            } else if (taskIndex == 1) {
                newChoice(["Yes", "No"]);
            }
        } else if (trigger === "> Yes") {
            if (taskIndex == 2) {
                newDialog(["Great, who would you | like to add to | your team?"]);
            } else if (taskIndex == 3) {
                newChoice([""])
            }
        }

    }


}
