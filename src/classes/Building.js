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
    }

    getId() {
        return this.id;
    }

    getCosts() {
        return this.costs;
    }

    getAmount() {
        return this.amount;
    }

    getLimit() {
        return this.limit;
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
    }
}