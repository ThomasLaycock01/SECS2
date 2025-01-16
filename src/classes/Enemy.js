import { posToNeg } from "@/functions";

export class Enemy {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.stats = obj.stats;
        this.currentHP = obj.stats.HP;
        this.dmgGiven = obj.dmgGiven;
        this.dmgTaken = obj.dmgTaken;
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

    //actions
    modifyHP(amount) {
        this.currentHP += amount;
    }

    takeDamage(physDmg, magDmg) {
        const physTotal = physDmg * this.getDmgTaken("phys");
        const magTotal = magDmg * this.getDmgTaken("mag");

        this.modifyHP(posToNeg(physTotal + magTotal));
    }
}