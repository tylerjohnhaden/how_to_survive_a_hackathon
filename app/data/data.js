export const npcData = [
    {"name": "npc1", "x": 10, "y": 3, "dialogueLines": ["Hack the Planet!"], "skin": "npc1"},
    {"name": "npc2", "x": 5, "y": 1, "dialogueLines": ["Hack the Planet!"], "skin": "npc2"},
    {"name": "npc3", "x": 12, "y": 7, "dialogueLines": ["Hack the Planet!"], "skin": "npc3"},
    {"name": "npc4", "x": 3, "y": 10, "dialogueLines": ["Hack the Planet!"], "skin": "npc4"},
    {"name": "npc5", "x": 11, "y": 11, "dialogueLines": ["Hack the Planet!"], "skin": "npc5"},
];

export const hackerData = [
    {"dialogueLines": ["I'm a deployer - I market | the code and software"], "name": "Mac", "x": 1, "y": 2, "classType": "deployment", "skillSet": [20, 0, 0, 0, 0]},
    {"dialogueLines": ["I debug the code for errors"], "name": "Sonia", "x": 3, "y": 5, "classType": "debugger", "skillSet": [0, 0, 0, 20, 0]},
    {"dialogueLines": ["I write and develop the | code"], "name": "Nick", "x": 15, "y": 8, "classType": "developer", "skillSet": [0, 20, 0, 0, 0]},
    {"dialogueLines": ["I design the architecture | of the code"], "name": "Anthony", "x": 13, "y": 11, "classType": "design", "skillSet": [0, 0, 20, 0, 0]},
    {"dialogueLines": ["I research the problem | using information online"], "name": "Belle", "x": 13, "y": 5, "classType": "researcher", "skillSet": [0, 0, 0, 0, 20]},
    {"dialogueLines": ["I'm like a | jack-of-all-trades | -  I'm good at a lot of | different things!"], "name": "Troy", "x": 10, "y": 4, "classType": "jack", "skillSet": [5, 5, 5, 5, 5]},
];

export const organizerData = [
    {"name": "organizer", "x": 8, "y": 2, "dialogueLines": ["Hey there!", "Be sure to collect some | free swag from our | lovely sponsors!"], "skin": "organizer"},
];

export const sponsorData = [
    {"name": "sponsor", "x": 2, "y": 8, "dialogueLines": ["Happy hacking!"], "skin": "sponsor"},
];

export const areaData = [
    {"scene": "main", "size": 32, "map": [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ], "skinName": "hackarea", "startingCoordinates": { "x": 0, "y": 7 * 32 }},
    {"scene": "hall", "size": 32, "map": [
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ], "skinName": "Hallway", "startingCoordinates": { "x": 1 * 32, "y": 3 * 32 }},
];
