import { useEnemiesStore } from "@/stores/barracks/enemies";

import { posToNeg } from "@/functions";

export class Enemy {
    constructor(obj, area, id) {
        this.id = id;
        this.name = obj.name;
        this.stats = obj.stats;
        this.currentHP = obj.stats.HP;
        this.atkMod = obj.atkMod;
        this.defMod = obj.defMod;

        this.xpDrop = obj.xpDrop;
        this.loot = obj.loot;
        this.items = obj.items;

        this.area = area;

    }

    getId()  {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getStat(stat) {
        return this.stats[stat];
    }

    getCurrentHP() {
        return Math.floor(this.currentHP * 100) / 100;
    }

    getAtkMod(type) {
        return this.atkMod[type];
    }

    getDefMod(type) {
        return this.defMod[type];
    }

    getAtkValue(type) {
        return this.getStat("atk") * this.getAtkMod(type);
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
        var physTotal = physDmg - (this.getStat("def") * this.getDefMod("phys"));
        var magTotal = magDmg - (this.getStat("def") * this.getDefMod("mag"));

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

            //adding XP and giving loot
            this.area.addXp(this.xpDrop);
            enemies.giveLoot(this.loot);
            enemies.procItemDrop(this.items);
        }
    }
}