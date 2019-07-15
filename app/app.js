'use strict';

import { _ } from './lib/underscore.js'

import { hackerData, npcData, organizerData, sponsorData, areaData } from './data.js';

import { Hacker } from './model/Hacker.js';
import { NPC } from './model/NPC.js';
import { Area } from './model/Area.js';

import { init, team, PLAYER_NAME, npcs, animate, allImagesAreReady, readyAllTheThings } from './code/game.js';

async function main(demo) {
    let area = init(new Area(areaData.find(areaDatum => areaDatum.scene == 'main')));

    let processedHackers = hackerData.map(hackerDatum => new Hacker(hackerDatum, area.size));
    npcs.push.apply(npcs, processedHackers);
    npcs.push.apply(npcs, npcData.map(npcDatum => new NPC(npcDatum, area.size)));
    npcs.push.apply(npcs, organizerData.map(organizerDatum => new NPC(organizerDatum, area.size)));
    npcs.push.apply(npcs, sponsorData.map(sponsorDatum => new NPC(sponsorDatum, area.size)));

    if (demo) {
        updateHackers(processedHackers, area.size);
        updateTeam(team, _.sample(processedHackers, 3));
    }

    console.log('loaded in hackers and npcs', npcs);



    // block until ready
    while(!allImagesAreReady()) {
        // sleep
        await sleep(1);
    }

    allImagesAreReady(true);

    readyAllTheThings();

    // animate frame method
    animate();
}

function updateTeam(_team, _newTeamMembers) {
    _team.members = _newTeamMembers

    for (var i = 0; i < _team.members.length; i++) {
        for (var s = 0; s < 5; s++) {
            _team.teamSkill[s] += team.members[i].skillSet[s];
        }
    }

    for (var m = 0; m < team.members.length; m++) {
        _team.members[m].show = true;
        _team.members[m].x = 224 + 32 * m;
        _team.members[m].y = 256;
        _team.members[m].move = "code";
        _team.members[m].text.push("Let's build a chatbot, | " + PLAYER_NAME + "!");
    }
}

function updateHackers(_hackers, _storySize) {
    function _s(x) {
        return x * _storySize;
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

    function boundArea(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // set boundaries
    _hackers[0].boundary = new boundArea(1, 2, 3, 1); // mac
    _hackers[1].boundary = new boundArea(1, 5, 3, 1); // sonia
    _hackers[2].boundary = new boundArea(13, 8, 3, 1); // nick
    _hackers[3].boundary = new boundArea(1, 4, 3, 1); // anthony
    _hackers[4].boundary = new boundArea(13, 5, 3, 1); // belle
    _hackers[5].boundary = new boundArea(13, 10, 3, 1); // troy
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// main loop
main(true);