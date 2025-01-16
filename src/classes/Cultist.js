import { useJobsStore } from "@/stores/globalPinias/jobs";

import { getAllCultistModifiers, createStatsObj } from "@/functions";

export class Cultist {
    constructor(id, name, raceTemplate, job, level, currentXp, xpNeeded, xpIncrement, levelLimit, perks, perkPoints, equipment) {
        this.id = id;
        this.name = name;

        this.job = job;
        this.party = null;


        this.level = level;
        this.currentXp = currentXp;
        this.xpNeeded = xpNeeded;
        this.xpIncrement = xpIncrement;
        this.levelLimit = levelLimit;
        
        this.raceId = raceTemplate.id;
        this.raceName = raceTemplate.name;
        this.racialGroup = raceTemplate.racialGroup;
        this.racialModifiers = raceTemplate.racialModifiers;
        this.type = raceTemplate.type;

        this.stats = createStatsObj(raceTemplate.stats);
        this.currentHP = this.stats.HP;

        this.perks = perks;
        this.perkPoints = perkPoints;
        this.equipment = equipment;
        this.misc = {}
    }

    //getters
    getName() {
        return this.name;
    }

    getJob() {
        if (this.party) {
            return this.party.getName();
        }

        return this.job;
    }

    getParty() {
        return this.party;
    }

    getPartyId() {
        return this.party.getId();
    }

    getId() {
        return this.id;
    }

    getXp() {
        return this.currentXp;
    }

    getXpNeeded() {
        return this.xpNeeded;
    }

    getXpIncrement() {
        return this.xpIncrement;
    }

    getLevel() {
        return this.level;
    }

    getLevelLimit() {
        return this.levelLimit;
    }

    getRaceId() {
        return this.raceId;
    }

    getRaceName() {
        return this.raceName;
    }

    getRacialGroup() {
        return this.racialGroup;
    }

    getType() {
        return this.type;
    }

    getEquipment() {
        return this.equipment;
    }

    getPerks() {
        return this.perks;
    }

    getPerkPoints() {
        return this.perkPoints;
    }

    checkIfHasPerk(perkId) {
        for (var i in this.getPerks()) {
            if (this.getPerks()[i].perkId == perkId) {
                return true;
            }
        }

        return false;
    }

    checkIfEquipped(type) {
        if (this.equipment[type] != null) {
            return true;
        }
        return false;
    }

    getMisc(miscType = null) {
        if (miscType) {
            if (this.misc[miscType]) {
                return this.misc[miscType];
            }
            return false;
        }
        else {
            return this.misc;
        }
    }

    getStatObj() {
        return this.stats;
    }

    getStat(stat = null) {
        if (stat) {
            return this.stats[stat];
        }
        return this.stats;
    }

    getCurrentHP() {
        return this.currentHP;
    }

    //setters
    setJob(job) {
        this.job = job;
    }

    removeJob() {
        this.job = null;
    }

    setParty(party) {
        this.party = party;
    }

    removeParty() {
        this.party = null;
    }

    addXp(amount, bypassNoXp = false) {
        const modifier = 1 + this.getModifiers("xpGain");
        if (this.level == this.levelLimit) {
            this.currentXp = 0;
        }
        else {
            for (var i in this.getRacialModifiers()) {
                if (this.getRacialModifiers()[i].type == "noXp" && bypassNoXp == false) {
                    return;
                }
            }
            this.currentXp += amount * modifier;
            this.checkLevelUp();
        }
    }

    checkLevelUp() {
        if (this.currentXp >= this.xpNeeded && !(this.level + 1 > this.levelLimit)) {
            this.levelUp();
        }
    }

    levelUp() {
        this.currentXp = this.currentXp - this.xpNeeded;
        this.xpNeeded = Math.floor(this.xpNeeded * this.xpIncrement);

        this.level += 1;
        this.incrementPerkPoint();
    }

    incrementPerkPoint() {
        this.perkPoints++;
    }

    decrementPerkPoint() {
        this.perkPoints--;
    }

    setLevelLimit() {
        const cultists = useCultistsStore();
        this.levelLimit = cultists.getDefaultLevelLimit;
    }

    equipItem(item) {
        const type = item.getType();

        if (this.checkIfEquipped(type)) {
            this.unequipItem(type);
        }

        this.equipment[type] = item;
        item.equipItem(this.getId());
    }

    unequipItem(type) {
        this.equipment[type].unequipItem();
        this.equipment[type] = null;
    }

    addPerk(perkObject) {
        this.perks.push(perkObject);
        this.decrementPerkPoint();
    }

    getLevelModifier(levelMod) {
        return (this.getLevel() - 1) * levelMod;
    }

    getRacialModifiers() {
        return this.racialModifiers;
    }

    getModifiers(type, altType = null, levelMod = 0) {
        var modVal = 0;

        for (var i in this.getEquipment()) {
            if (this.getEquipment()[i]) {
                for (var j in this.getEquipment()[i].getModifiersByType(type, altType)) {
                    modVal += this.getEquipment()[i].getModifiersByType(type, altType)[j]["modifier"];
                }
            }
        }
        
        for (var i in this.getPerks()) {
            for (var j in this.getPerks()[i]["modifiers"]) {
                if (this.getPerks()[i]["modifiers"][j]["type"] == type || this.getPerks()[i]["modifiers"][j]["type"] == "global") {
                    if (altType) {
                        if (this.getPerks()[i]["modifiers"][j]["altType"] == altType || !this.getPerks()[i]["modifiers"][j]["altType"]) {
                            modVal += this.getPerks()[i]["modifiers"][j]["modifier"];
                        }
                    }
                    else {
                        if (!this.getPerks()[i]["modifiers"][j]["altType"]) {
                            modVal += this.getPerks()[i]["modifiers"][j]["modifier"];
                        }
                    }
                }
            }
        }

        for (var i in this.getRacialModifiers()) {
            const modObj = this.getRacialModifiers()[i];

            if (modObj.type == "grabProd") {
                const jobs = useJobsStore();
                modVal += jobs.getProdModifier(modObj.altType) * modObj.modifier;
                console.log(jobs.getProdModifier(modObj.altType) * modObj.modifier);
            }
            else if (modObj.type == type || modObj.type == "global") {
                if (altType) {
                    if (modObj.altType == altType || !modObj.altType) {
                        modVal += modObj.modifier;
                    } 
                }
                else {
                    if (!modObj.altType) {
                        modVal += modObj.modifier;
                    }
                }
            } 
        }
        
        const allCultistModifiers = getAllCultistModifiers(type, altType);

        for (var i in allCultistModifiers) {
            console.log(allCultistModifiers[i]);
            modVal += allCultistModifiers[i].modifier;
        }

        //adding the levelMod
        if (levelMod) {
            modVal += this.getLevelModifier(levelMod);
        }

        this.giveXpToLivingItems();

        return modVal;
    }

    feedItem(item) {
        this.addXp(item.getSellValue() / 10, true);
    }

    giveXpToLivingItems() {
        for (var i in this.getEquipment()) {
            const item = this.getEquipment()[i];
            if (item) {
                item.addXp(1);
            }
        }
    }

    setMisc(key, value) {
        this.misc[key] = value;
    }
}