import { getGlobalModifiers, createStatsObj, posToNeg } from "@/functions";

export class Cultist {
    constructor(id, name, raceTemplate, job, level, currentXp, xpNeeded, xpIncrement, levelLimit, perks, perkPoints, equipment) {
        this.id = id;
        this.name = name;

        this.job = job;
        this.party = null;

        //level
        this.level = level;
        this.currentXp = currentXp;
        this.xpNeeded = xpNeeded;
        this.xpIncrement = xpIncrement;
        this.levelLimit = levelLimit;
        
        //race
        this.raceId = raceTemplate.id;
        this.raceName = raceTemplate.name;
        this.racialGroup = raceTemplate.racialGroup;
        this.racialModifiers = raceTemplate.racialModifiers;
        this.type = raceTemplate.type;

        //stats
        this.stats = createStatsObj(raceTemplate.stats);
        this.currentHP = this.stats.HP;
        this.knockedOut = false;
        this.knockOutTime = 0;

        //perks/equipment
        this.perks = perks;
        this.perkPoints = perkPoints;
        this.equipment = equipment;
        this.misc = {}

        //role
        this.role = null;
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

    getPerkPoints() {
        return this.perkPoints;
    }

    checkIfHasPerk(perkId) {
        for (var i in this.getPerks()) {
            if (this.getPerks()[i].id == perkId) {
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

    getStat(stat) {
        return Math.floor(this.getBaseStat(stat) * this.getModifiers([stat]) * 100) / 100;
    }

    getCurrentHP() {
        return Math.floor(this.currentHP * 100) / 100;
    }

    getKnockedOut() {
        return this.knockedOut;
    }

    getKnockOutTime() {
        return this.knockOutTime;
    }

    getRole() {
        return this.role;
    }

    getAtkValue(type) {
        return Math.floor((this.getStat("atk") * this.role.getAtkMod(type)) * 100) / 100;
    }

    getDefValue(type) {
        return Math.floor((this.getStat("def") * this.role.getDefMod(type)) * 100) / 100;
    }


    //getters - modifiers
    getPerks() {
        return this.perks;
    }

    getEquipment() {
        return this.equipment;
    }

    getModifiers(typeArray) {
        var modVal = 1;


        //perks
        for (var i in this.perks) {
            const perk = this.perks[i];
            for (var j in perk.modifiers) {
                const modObj = perk.modifiers[j];
                if (typeArray.includes(modObj.type) && modObj.modifier) {
                    modVal += modObj.modifier;
                }
            }
        }

        //equipment
        for (var i in this.equipment) {
            if (this.equipment[i]) {
                modVal += this.equipment[i].getEquipmentModifier(typeArray);
            }
        }

        //racial modifiers
        for (var i in this.racialModifiers) {
            const modObj = this.racialModifiers[i];
            if (typeArray.includes(modObj.type) && modObj.modifier) {
                modVal += modObj.modifier;
            }
        }

        //levels - not added for XP gain
        if (!typeArray.includes("xpGain")) {
            modVal += (this.level - 1) * 0.01;
        }

        //global
        modVal += getGlobalModifiers(typeArray);

        return modVal;
    }

    getBaseStat(stat) {
        var baseVal = this.stats[stat];

        //perks
        for (var i in this.perks) {
            const perk = this.perks[i];
            for (var j in perk.modifiers) {
                const modObj = perk.modifiers[j];
                if (modObj.type == stat  && modObj.base) {
                    baseVal += modObj.base;
                }
            }
        }

        //equipment
        for (var i in this.equipment) {
            if (this.equipment[i]) {
                baseVal += this.equipment[i].getEquipmentBase(stat);
            }
        }

        return baseVal;
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

    removeParty() {
        this.party = null;
    }

    addXp(amount) {
        const modifier = 1 + this.getModifiers("xpGain");
        if (this.level == this.levelLimit) {
            this.currentXp = 0;
        }
        else {
            this.currentXp += Math.floor(amount * modifier);
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

    feedItem(item) {
        this.addXp(item.getSellValue() / 10, true);
    }

    setMisc(key, value) {
        this.misc[key] = value;
    }


    //combat
    takeDamage(physDmg, magDmg) {
        var physTotal = physDmg - this.getDefValue("phys");
        var magTotal = magDmg - this.getDefValue("mag");

        if (physTotal < 0) {
            physTotal = 0;
        }

        if (magTotal < 0) {
            magTotal = 0;
        }

        this.modifyHP(posToNeg(physTotal + magTotal));
    }

    modifyHP(amount) {
        this.currentHP += amount;

        if (this.currentHP > this.getStat("HP")) {
            this.currentHP = this.getStat("HP");
        }

        if (this.currentHP <= 0) {
            this.knockOut();
        }
    }

    knockOut() {
        this.knockedOut = true;
        this.knockOutTime = this.stats.HP * 10;
    }

    revive() {
        this.knockedOut = false;
        this.currentHP = this.getStat("HP");
    }

    decrementKnockOutTime() {
        this.knockOutTime--;
        if (this.knockOutTime <= 0) {
            this.revive();
        }
    }

    heal() {
        this.modifyHP(0.1);
    }


    setRole(role) {
        this.role = role;
    }

    removeRole() {
        this.role = null;
    }
}