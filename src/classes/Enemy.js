import { useEnemiesStore } from "@/stores/barracks/enemies";

import { posToNeg } from "@/functions";

export class Enemy {
    constructor(obj, area) {
        this.id = obj.id;
        this.name = obj.name;
        this.stats = obj.stats;
        this.currentHP = obj.stats.HP;
        this.dmgGiven = obj.dmgGiven;
        this.dmgTaken = obj.dmgTaken;

        this.xpDrop = obj.xpDrop;
        this.loot = obj.loot;

        this.area = area;

    }

    getId()  {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getStat(stat = null) {
        return this.stats[stat];
    }

    getCurrentHP() {
        return this.currentHP;
    }

    getDmgGiven(type) {
        return this.dmgGiven[type];
    }

    getDmgTaken(type) {
        return this.dmgTaken[type];
    }

    getXpDrop() {
        return this.xpDrop;
    }

    //actions
    modifyHP(amount) {
        this.currentHP += amount;

        this.checkIfDead();
    }

    takeDamage(physDmg, magDmg) {
        var physTotal = (physDmg - this.getStat("def")) * this.getDmgTaken("phys");
        var magTotal = (magDmg - this.getStat("def")) * this.getDmgTaken("mag");

        if (physTotal < 0) {
            physTotal = 0;
        }

        if (magTotal < 0) {
            magTotal = 0;
        }

        this.modifyHP(posToNeg(physTotal + magTotal));
    }

    checkIfDead() {
        const enemies = useEnemiesStore();

        if (this.currentHP <= 0) {
            this.area.removeEnemy(this.id);

            //add progress if area at max level
            if (this.area.checkAtMaxLevel()) {
                this.area.addLevelProgress();
            }

            //adding XP and giving loot
            this.area.addXp(this.xpDrop);
            enemies.giveLoot(this.loot);
        }
    }
}