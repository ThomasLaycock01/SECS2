export class Building {
    constructor(obj) {
        this.id = obj.id;
        this.effectDesc = obj.effectDesc;

        this.modifiers = obj.modifiers;
        if (obj.onBuildEffects) {
            this.onBuildEffects = obj.onBuildEffects;
        }
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
}