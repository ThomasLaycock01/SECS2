import { defineStore } from "pinia";

export const useTextLogStore = defineStore("textLog", {
    state: () => {
        return {
            played: [{id: "1", messages: [{character: "narrator", message: "Test message"}]}],
            playing: [],
            toPlay: [],
            unplayed: [{id: "1", messages: [{character: "narrator", message: "Test message", typing: true}]}],
            typing: false
        }
    },
    getters: {
        getPlayed(state) {
            return state.played;
        }
    },
    actions: {
        playConvo(convoId) {
            if (this.playing.length != 0) {
                //what to do if it is already typing
            }
            else {
                this.addToPlayingArray(convoId);
            }
        },
        playConvoInPlayingArray() {

        },
        addToPlayingArray(convoId) {
            const convo = this.unplayed.filter((convo) => convo.id == convoId);
            this.unplayed = this.unplayed.filter((convo) => convo.id != convoId);
            this.playing.push(convo);
        },
        addToPlayedArray() {
            const convo = this.playing[0];
            this.played.push(convo);
            this.playing.pop();
        }
    }
})