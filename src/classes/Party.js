export class Party {
    constructor(id) {
        this.id = id;
        this.name = "Party " + id;
        this.roles = [];
        this.limit = 3;
    }

    //getters
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getLimit() {
        return this.limit;
    }

    getRoles() {
        return this.roles;
    }

    getPartySize() {
        return this.roles.length;
    }
}