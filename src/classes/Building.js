export class Building {
    constructor(obj) {
        this.id = obj.id;
        this.effectDesc = obj.effectDesc;

        this.modifiers = obj.modifiers;
        this.costs = obj.costs;
        this.exponents = obj.exponents;
        this.reqs = obj.reqs;
        this.amount = 0;
        this.limit = obj.limit;
        this.onBuild = obj.onBuild;
    }

    getId() {
        return this.id;
    }

    getCosts() {
        if (!this.exponents) {
            return this.costs;
        }
        
        const costsObj = {};

        for (var i in this.costs) {
            costsObj[i] = this.costs[i] * Math.pow(this.exponents[i], this.amount);
        }

        return costsObj;
    }

    getAmount() {
        return this.amount;
    }

    getLimit() {
        return this.limit;
    }

    limitCheck() {
        return this.amount == this.limit;
    }

    getModifiers(typeArray) {
        var modVal = 0;

        for (var i in this.modifiers) {
            const modObj = this.modifiers[i];
            if (typeArray.includes(modObj.type)) {
                modVal += modObj.modifier * this.amount;
            }
        }

        return modVal;
    }

    //actions
    build() {
        this.amount++;
        if (this.onBuild) {
            this.onBuild();
        }
    }
}