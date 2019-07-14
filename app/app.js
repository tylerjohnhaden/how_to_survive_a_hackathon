'use strict';

import { _ } from './lib/underscore.js'

import { hackerData, npcData } from './data/data.js';

import { Hacker } from './model/Hacker.js';
import { NPC } from './model/NPC.js';
//import { Player } from './model/Player.js';

import { init, boundArea, team, player, npcs, makeSpectators, animate, allImagesAreReady, readyAllTheThings } from './code/game.js';
import { hacker } from './code/character.js';

async function main() {
    let processedHackers, processedNPCs;

    let oldWay = true;

    if (oldWay) {
        processedHackers = makeHackers();
        processedNPCs = makeSpectators();
    } else {
        processedHackers = hackerData.map(hackerDatum => new Hacker(hackerDatum, 32));
        processedNPCs = npcData.map(npcDatum => new NPC(npcDatum, 32));
    }

    console.log('loaded in hackers and npcs', processedHackers, processedNPCs);

    let storySize = 32;
    let demo = false;

    npcs.push.apply(npcs, processedHackers);
    npcs.push.apply(npcs, processedNPCs);

    if (demo) {
        updateHackers(processedHackers);
        updateTeam(team, _.sample(processedHackers, 3));
    }

    init();

    // block until ready
    while(!allImagesAreReady()) {
        // sleep
        await sleep(1);
    }

    readyAllTheThings();

    // animate frame method
    animate();
}

function updateTeam(_team, _newTeamMembers) {
    _team.members = _newTeamMembers

    for (var i = 0; i < team.members.length; i++) {
        for (var s = 0; s < 5; s++) {
            team.teamSkill[s] += team.members[i].skillSet[s];
        }
    }

    for (var m = 0; m < team.members.length; m++) {
        team.members[m].show = true;
        team.members[m].x = 224 + 32 * m;
        team.members[m].y = 256;
        team.members[m].move = "code";
        team.members[m].text.push("Let's build a chatbot, | " + player.name + "!");
    }
}

function updateHackers(_hackers) {
    function _s(x) {
        return x * storySize;
    }

    //reset positions
    _hackers[0].x = _s(1);
    _hackers[0].y = _s(2);

    _hackers[1].x = _s(3);
    _hackers[1].y = _s(5);

    _hackers[2].x = _s(15);
    _hackers[2].y = _s(8);

    _hackers[3].x = _s(1);
    _hackers[3].y = _s(4);

    _hackers[4].x = _s(13);
    _hackers[4].y = _s(5);

    _hackers[5].x = _s(15);
    _hackers[5].y = _s(10);

    // set boundaries
    _hackers[0].boundary = new boundArea(1, 2, 3, 1); // mac
    _hackers[1].boundary = new boundArea(1, 5, 3, 1); // sonia
    _hackers[2].boundary = new boundArea(13, 8, 3, 1); // nick
    _hackers[3].boundary = new boundArea(1, 4, 3, 1); // anthony
    _hackers[4].boundary = new boundArea(13, 5, 3, 1); // belle
    _hackers[5].boundary = new boundArea(13, 10, 3, 1); // troy
}

//startGame();  // todo: figure out what this is supposed to do


function makeHackers() {
    let hackers = [
        new hacker("Mac", 1, 2, "deployment", [20, 0, 0, 0, 0]),
        new hacker("Sonia", 3, 5, "debugger", [0, 0, 0, 20, 0]),
        new hacker("Nick", 15, 8, "developer", [0, 20, 0, 0, 0]),
        new hacker("Anthony", 13, 11, "design", [0, 0, 20, 0, 0]),
        new hacker("Belle", 13, 5, "researcher", [0, 0, 0, 0, 20]),
        new hacker("Troy", 10, 4, "jack", [5, 5, 5, 5, 5])
    ];

    hackers[0].text[1] = "I'm a deployer - I market | the code and software";
    hackers[1].text[1] = "I debug the code for errors";
    hackers[2].text[1] = "I write and develop the | code";
    hackers[3].text[1] = "I design the architecture | of the code";
    hackers[4].text[1] = "I research the problem | using information online";
    hackers[5].text[1] = "I'm like a | jack-of-all-trades | -  I'm good at a lot of | different things!";

    return hackers;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// main loop
main();