'use strict';

import { hackerData, npcData } from './data/data.js';

import { Hacker } from './model/Hacker.js';
import { NPC } from './model/NPC.js';

import { init, demoTeam, startGame } from './code/game.js';

var processedHackers = hackerData.map(hackerDatum => {
    return new Hacker(hackerDatum, 32);
});

console.log(processedHackers);

var processedNPCs = npcData.map(npcDatum => {
    return new NPC(npcDatum, 32);
});

console.log(processedNPCs);

init();
//startGame();
demoTeam();