'use strict';

import { _ } from './lib/underscore.js'

import { hackerData, npcData, organizerData, sponsorData, areaData, itemData } from './data.js';

import { Hacker } from './model/Hacker.js';
import { NPC } from './model/NPC.js';
import { Area } from './model/Area.js';
import { Item } from './model/Item.js';

import { init, team, PLAYER_NAME, npcs, animate, allImagesAreReady, readyAllTheThings } from './code/game.js';
import { Story } from './code/story.js';

async function main(demo) {

    // Initialize game area, and set items
    let area = init(
        new Area(areaData.find(areaDatum => areaDatum.scene == 'main')),
        itemData.map(itemDatum => new Item(itemDatum)),
        new Story()
    );

    let things = [].concat(
        npcData,
        organizerData,
        sponsorData
    );

    // set npcs using static data
    npcs.push.apply(npcs, things.map(npcDatum => new NPC(npcDatum, area.size)));

    let demoPositions = area.positionSets["demo"];

    let processedHackers = hackerData.map(hackerDatum => new Hacker(hackerDatum, area.size));
    npcs.push.apply(npcs, processedHackers);

    if (demo) {
        updateHackers(processedHackers, area.size);

        team.members = _.sample(processedHackers, 3);

        for (var i = 0; i < team.members.length; i++) {
            for (var s = 0; s < 5; s++) {
                team.teamSkill[s] += team.members[i].skillSet[s];
            }
        }

        for (var m = 0; m < demoPositions.length; m++) {
            team.members[m].x = 32 * demoPositions[m % demoPositions.length][1];
            team.members[m].y = 32 * demoPositions[m % demoPositions.length][0];
            team.members[m].move = "code";
            team.members[m].text.push("Let's build a chatbot, | " + PLAYER_NAME + "!");
        }
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

// main loop, boolean means demo or no demo
main(true);