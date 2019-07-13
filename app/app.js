'use strict';

import { _ } from './lib/underscore.js'

import { hackerData, npcData } from './data/data.js';

import { Hacker } from './model/Hacker.js';
import { NPC } from './model/NPC.js';
import { Player } from './model/Player.js';

let processedHackers = hackerData.map(hackerDatum => new Hacker(hackerDatum, 32));
let processedNPCs = npcData.map(npcDatum => new NPC(npcDatum, 32));

console.log(processedHackers);
console.log(processedNPCs);
console.log(new Player());

console.log('here 555');
import { init, startGame, hackers, boundArea, team, player } from './code/game.js';

let storySize = 32;
let demo = false;
console.log('here 222');
init();
console.log('here 333');

//startGame();  // todo: figure out what this is supposed to do

if (demo) {
    function _s(x) {
        return x * storySize;
    }

    //reset positions
    hackers[0].x = _s(1);
    hackers[0].y = _s(2);

    hackers[1].x = _s(3);
    hackers[1].y = _s(5);

    hackers[2].x = _s(15);
    hackers[2].y = _s(8);

    hackers[3].x = _s(1);
    hackers[3].y = _s(4);

    hackers[4].x = _s(13);
    hackers[4].y = _s(5);

    hackers[5].x = _s(15);
    hackers[5].y = _s(10);

    // set boundaries
    hackers[0].boundary = new boundArea(1, 2, 3, 1); // mac
    hackers[1].boundary = new boundArea(1, 5, 3, 1); // sonia
    hackers[2].boundary = new boundArea(13, 8, 3, 1); // nick
    hackers[3].boundary = new boundArea(1, 4, 3, 1); // anthony
    hackers[4].boundary = new boundArea(13, 5, 3, 1); // belle
    hackers[5].boundary = new boundArea(13, 10, 3, 1); // troy

    team.members = _.sample(hackers, 3);

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
