export class Enemy {
    constructor(obj) {
        //"1000": {"id": 1000, "name": "Evil Cultist", "stats": {"atk": 1, "spd": 1, "def": 1, "HP": 10}}
        this.id = obj.id;
        this.name = obj.name;
        this.stats = obj.stats;
        this.currentHealth = obj.stats.HP;
    }

    getId()  {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getStats() {
        return this.stats;
    }

    getCurrentHealth() {
        return this.currentHealth;
    }
}