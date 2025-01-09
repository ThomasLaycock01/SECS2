import { usePartiesStore } from "@/stores/barracks/parties";

export class Party {
    constructor() {
        const parties = usePartiesStore();


        this.id = parties.generatePartyId();
        this.roles = [];
    }

    //getters
    getId() {
        return this.id;
    }
}