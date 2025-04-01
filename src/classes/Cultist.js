import { getGlobalModifiers, createStatsObj, posToNeg } from "@/functions";

import { useResourcesStore } from "@/stores/globalPinias/resources";

export class Cultist {
    constructor(id, name, raceTemplate) {
        this.id = id;
        this.name = name;

        this.job = null;
        this.party = null;

        //level
        this.level = 1;
        this.currentXp = 0;
        
        //race
        this.raceId = raceTemplate.id;
        this.raceName = raceTemplate.name;
        this.racialGroup = raceTemplate.racialGroup;
        this.racialModifiers = raceTemplate.racialModifiers;

        //stats
        this.stats = createStatsObj(raceTemplate.stats);
        this.currentHP = this.stats.HP;
        this.knockedOut = false;
        this.knockOutTime = 0;

        //perks/equipment
        this.perks = [];
        this.perkPoints = 0;
        this.equipment = {tool: null, body: null, accessory: null};
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


    //levelling
    getXp() {
        return this.currentXp;
    }

    getXpNeeded() {
        return Math.floor(20 * (Math.pow(this.getXpIncrement(), this.level - 1)));
    }

    getXpIncrement() {
        return 1.5 * this.getModifiers(["xpIncrement"], false);
    }

    getLevel() {
        return this.level;
    }

    getLevelLimit() {
        return Math.floor(10 + this.getModifiers(["levelLimit"], false) - 1);
    }


    //racial
    getRaceId() {
        return this.raceId;
    }

    getRaceName() {
        return this.raceName;
    }

    getRacialGroup() {
        return this.racialGroup;
    }


    //perks
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

    getMissingHP() {
        return Math.floor((this.getStat("HP") - this.getCurrentHP()) * 100) / 100;
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
        const modType = type == "phys" ? "pAtk" : "mAtk";
        const baseVal = this.getStat("atk") * this.role.getAtkMod(type)
        const finalVal = (baseVal + this.getBaseStat(modType)) * this.getModifiers(modType)
        return Math.round(finalVal * 100) / 100;
    }

    getDefValue(type) {
        const modType = type == "phys" ? "pDef" : "mDef";
        const baseVal = this.getStat("def") * this.role.getDefMod(type)
        const finalVal = (baseVal + this.getBaseStat(modType)) * this.getModifiers(modType)
        return Math.round(finalVal * 100) / 100;
    }


    //getters - modifiers
    getPerks() {
        return this.perks;
    }

    getEquipment() {
        return this.equipment;
    }

    getModifiers(typeArray, incLevel = true) {
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
        if (incLevel) {
            modVal += (this.level - 1) * 0.01;
        }

        //global
        modVal += getGlobalModifiers(typeArray);

        return modVal;
    }

    getModifiersForDisplay(typeArray, incLevel = true) {
        const returnObj = {
            Perks: [],
            Racial: null
        };

        //perks
        for (var i in this.perks) {
            const perk = this.perks[i];
            for (var j in perk.modifiers) {
                const modObj = perk.modifiers[j];
                if (typeArray.includes(modObj.type) && (modObj.modifier)) {
                    const pushObj = {
                        name: perk.name,
                        value: modObj.modifier
                    }
                    returnObj.Perks.push(pushObj);
                }
            }
        }

        //racial
        for (var i in this.racialModifiers) {
            const modObj = this.racialModifiers[i];
            if (typeArray.includes(modObj.type) && modObj.modifier) {
                returnObj.Racial = modObj.modifier; 
            }
        }
        
        console.log(returnObj);

        return returnObj;
    }

    getBaseStat(stat) {
        var baseVal = 0;
        if (stat == "atk" || stat == "HP" || stat == "def") {
            baseVal = this.stats[stat];
        }
        

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

    addXp(amount) {
        if (this.level == this.levelLimit) {
            this.currentXp = 0;
        }
        else {
            this.currentXp += Math.floor(amount * this.getModifiers("xpGain", false));
            this.checkLevelUp();
        }
    }

    checkLevelUp() {
        if (this.currentXp >= this.getXpNeeded() && !(this.level + 1 > this.levelLimit)) {
            this.levelUp();
        }
    }

    levelUp() {
        this.currentXp = 0;

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

    equipItem(itemObj) {
        const type = itemObj.getType();

        if (this.checkIfEquipped(type)) {
            this.unequipItem(type);
        }

        this.equipment[type] = itemObj;
        itemObj.equipItem(this);
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
            this.currentHP = 0;
            if (this.party.getAutoHeal()) {
                this.attemptAutoHeal();
            }
            else {
                this.knockOut();
            }
        }
    }

    knockOut() {
        this.knockedOut = true;
        this.knockOutTime = this.stats.HP * 10;
    }

    attemptAutoHeal() {
        const resources = useResourcesStore();

        const costsObj = {
            grain: this.getMissingHP() * 100
        }

        if (resources.checkIfCanAfford(costsObj)) {
            resources.removeResources(costsObj);
            this.instaHeal();
        }
        else {
            this.knockOut();
        }
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

    instaHeal() {
        this.currentHP = this.getStat("HP");
    }

    setRole(role) {
        this.role = role;
    }

    removeRole() {
        this.role = null;
    }
}