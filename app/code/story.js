export class Story {
    constructor() {
        this.player = null;
        this.team = null;

        this.size = 32;

        this.pause = false;
        this.quest = "None";
        this.trigger = "none";
        this.taskIndex = 0;
        this.cutscene = false;

        this.dialogue = {
            text: "",
            index: 0,
            show: false,
            threshold: 0
        };

        this.choice_box = {
            options: [],
            index: 0,
            lines: [],
            show: false
        };

        this.pseudoOther = {
            textIndex: 0,
            show: true,
            interact: true,
        };
    }

    setRandomPosition() {

    }

    endScene() {
        this.taskIndex = 0;
        this.dialogue.show = false;
        this.dialogue.text = [""];
        this.choice_box.show = false;
        this.cutscene = false;
        this.player.other.interact = false;
        this.player.other.textIndex = 0;
        this.player.interact = false;
        this.dialogue.index = 0;
        this.trigger = "none";
    }

    triggerWord() {
        if (this.quest === "Register") {
            return true;
        }

        if (this.quest === "Demo") {
            // todo: make this function less verbose
            if (this.trigger.match(/touch*/g)) {
                return true;
            } else {
                return false;
            }
        }

        if (this.quest === "Small Talk") {
            return true;
        }

        return false;
    }

    newDialog(dialogueText) {
        this.dialogue.text = dialogueText;
        this.dialogue.show = true;
    }

    // endChoice was present in the original source, but did
    // not have any references. I have ported over the logic, but cannot speak
    // to it's functionality or context.
    //
    // // reset the choice options
    // function endChoice() {
    //     this.choice_box.show = false;
    //     this.choice_box.index = 0;
    //     this.choice_box.lines = [];
    // }

    // make new choice boxes
    newChoice(options) {
        this.choice_box.show = true;
        this.choice_box.options = options;

        //count the lines from each choice given
        let lines = [];
        for (let c = 0; c < this.choice_box.options.length; c++) {
            lines.push(this.choice_box.options[c].split(" | ").length);
        }

        this.choice_box.lines = lines;
    }

    play(area) {
        if (this.quest === "Demo") {
            doDemo(this, area);
        } else if (this.quest === "Register") {
            doRegister(this);
        } else if (this.quest === "Small Talk") {
            doSmallTalk(this);
        }
    }
}

function doDemo(_story, _area) {
    let trigger = _story.trigger;
    let taskIndex = _story.taskIndex;
    let player = _story.player;


    let recognizedTriggers = [
        'touch_floppy',
        'touch_wifi',
        'touch_coffee',
        'touch_redbull',
        'touch_project',
    ];

    if (!recognizedTriggers.includes(trigger)) {
        // console.log('play -> doDemo call sequence, trigger unknown', trigger, 'should be one of', recognizedTriggers);
        return;
    }

    // start the play

    _story.cutscene = true;

    if (taskIndex == 0) {
       if (trigger === "touch_floppy") {
           _story.dialogue.text = ["You got the floppy disk!", "Your overall team skill | has improved!"];

       } else if (trigger === "touch_wifi") {
            _story.dialogue.text = ["You found the wifi!", "Your project is 2% more | done!"];

       } else if (trigger === "touch_coffee") {
            _story.dialogue.text = ["You got the coffee!", "Your team's energy | increased by 10!"];

       } else if (trigger === "touch_redbull") {
            _story.dialogue.text = ["You got the Red Bull!", "Your team's energy | increased by 15!"];

       } else if (trigger === "touch_project") {
            _story.dialogue.text = ["Project: 4d 49 4c 4b", "I am " + _story.team.projectProg + "% complete!"];
       }

       _story.dialogue.show = true;
    }

    if (taskIndex == 1) {
        if (trigger === "touch_floppy") {
                for (var t = 0; t < 5; t++) {
                    _story.team.teamSkill[t] += 5;
                }
                _story.setRandomPosition(player.other, _area);

        } else if (trigger === "touch_wifi") {
                _story.projectProg += 2;
                _story.setRandomPosition(player.other, _area);

        } else if (trigger === "touch_coffee") {
                _story.team.energy += 10;
                _story.setRandomPosition(player.other, _area);

        } else if (trigger === "touch_redbull") {
                _story.team.energy += 15;
                _story.setRandomPosition(player.other, _area);
        }

        _story.endScene();
    }
}

function doRegister(_story) {
    alert("whoah nelly, doRegister", _story);
    if (trigger === "start_game") {
        _story.cutscene = true;
        _story.player.other = _story.pseudoOther;
        if (taskIndex == 0) {
            _story.newDialog(_story, ["...", player.name + ": Wow! This gym is | huge!",
                "I can't wait to see | what swag they have to | offer!"
            ])
        } else if (taskIndex == 1) {
            _story.endScene();
        }
    }

    if (trigger.match(/x8_y[0-9]/) && dialogue.threshold == 0 && _area.scene === "hall") {
        alert("I wasn't planning on this happening");
        //_story.storyFunct[1]();
    }
    if (trigger.match(/x8_y[0-9]/) && dialogue.threshold == 0 && _area.scene === "main") {
        _story.cutscene = true;
        if (taskIndex == 0) {
            _story.newDialog(_story, ["...", player.name + ": There's so many | people...",
                "Where do I check in?",
                "I guess I should look | for a staff member."
            ]);

        } else {

            _story.endScene();
            dialogue.threshold++;
        }
    }


    if (trigger === "talk_organizer") {
        _story.cutscene = true;
        if (taskIndex == 0) {
            var playerName = _story.player.name;
            _story.newDialog(_story, [player.name + ": Hey. I am here for | the hackathon.",
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
            _story.team.energy += 10;
            _story.quest = "Small Talk";
            dialogue.threshold = 0;
            _story.endScene();
        }
    }

}



function doSmallTalk(_story) {
    alert("whoah nelly, doSmallTalk", _story);

    let trigger = _story.trigger;
    let taskIndex = _story.taskIndex;
    let dialogue = _story.dialogue;
    let player = _story.player;

    //talk to random npcs
    if (trigger === "talk_???") {
        _story.cutscene = true;
        if (taskIndex == 0) {
            if (dialogue.threshold % 3 == 0) {
                _story.newDialog(_story, ["???: I feel so jittery~! | Do I have wings yet?",
                    "You can regain energy by | getting a sweet dose | of caffiene.",
                    "Redbull is my favorite!",
                    "You can also try | sleeping and eating | caffiene packed chocolate | bars.",
                    player.name + ": (Jeez is everyone | like this?)"
                ]);
            } else if (dialogue.threshold % 3 == 1) {
                _story.newDialog(_story, ["???: I am so | excited to impress the | judges.",
                    "I heard the prizes | include internships and | gaming consoles.",
                    "Doesn't that sound | like an awesome combination?"
                ]);
            } else if (dialogue.threshold % 3 == 2) {
                _story.newDialog(_story, ["???: Hey did you hear about | that one company's | challenge?",
                    "They want the hackers | to create something unique!",
                    "Sounds fun doesn't it? | That can be anything!"
                ]);
            }
        } else if (taskIndex == 1) {
            _story.endScene();
            dialogue.threshold++;
        }
    }

    //announcement after 3 talks
    else if (trigger.match(/x[0-9]+_y[0-9]+/g) && dialogue.threshold == 3) {
        _story.cutscene = true;
        if (taskIndex == 0) {
            _story._story.newDialog(_story, ["!!!!", "Staff: Hello hackers! | Just a quick announcement.",
                "The hackathon will begin | shortly so start picking | members for your team.",
                "You can only have four | members in a team.",
                "Talk to fellow hackers | They will have information | about their skills."
            ])
        } else if (taskIndex == 1) {
            dialogue.threshold++;
            _story.endScene();
        }
    }

    //talk to hackers
    else if (trigger === "talk_Mac") {
        _story.cutscene = true;
        if (taskIndex == 0) {
            _story.newDialog(_story, ["Mac: I really like | release the final product.",
                "Marketing is one of | my strong suits."
            ])
        } else if (taskIndex == 1) {
            _story.endScene();
        }
    } else if (trigger === "talk_Sonia") {
        _story.cutscene = true;
        if (taskIndex == 0) {
            _story.newDialog(_story, ["Sonia: Finding bugs in | code and squashing them | is super fun.",
                "Let me solve your | frustrations. It may just | be a simple error."
            ])
        } else if (taskIndex == 1) {
            _story.endScene();
        }
    } else if (trigger === "talk_Nick") {
        _story.cutscene = true;
        if (taskIndex == 0) {
            _story.newDialog(_story, ["Nick: Development in the | back-end fits my | style more.",
                "I can't wait to | start programming."
            ])
        } else if (taskIndex == 1) {
            _story.endScene();
        }
    } else if (trigger === "talk_Anthony") {
        _story.cutscene = true;
        if (taskIndex == 0) {
            _story.newDialog(_story, ["Anthony: I don't believe | in messy code.",
                "The design and structure is | the most important part | of a program."
            ])
        } else if (taskIndex == 1) {
            _story.endScene();
        }
    } else if (trigger === "talk_Belle") {
        _story.cutscene = true;
        if (taskIndex == 0) {
            _story.newDialog(_story, ["Belle: The internet is full of | information~!",
                "I research a lot. | There are so many | posibilities."
            ])
        } else if (taskIndex == 1) {
            _story.endScene();
        }
    } else if (trigger === "talk_Troy") {
        _story.cutscene = true;
        if (taskIndex == 0) {
            _story.newDialog(_story, ["Troy: I know just | a little bit of | everything.",
                "Kind of like a jack-of-all | trades you know?"
            ])
        } else if (taskIndex == 1) {
            _story.endScene();
        }
    }

    //go back to the organizer
    else if (trigger === "talk_organizer" && dialogue.threshold > 3) {
        _story.cutscene = true;
        if (taskIndex == 0) {
            _story.newDialog(_story, ["Staff: Do you know who you | want to be on your team | yet?"])
        } else if (taskIndex == 1) {
            newChoice(["Yes", "No"]);
        }
    } else if (trigger === "> Yes") {
        if (taskIndex == 2) {
            _story.newDialog(_story, ["Great, who would you | like to add to | your team?"]);
        } else if (taskIndex == 3) {
            _story.newChoice([""])
        }
    }
}
