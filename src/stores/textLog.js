import { defineStore } from "pinia";

import { useMiscStore } from "./misc";

export const useTextLogStore = defineStore("textLog", {
    state: () => {
        return {
            played: [],
            playing: [],
            toPlay: [],
            unplayed: [
                {convoId: 1, character: "narrator", message: "test message", last: false}, 
                {convoId: 1, character: "narrator", message: "something else", last: true}, 
                {convoId: 2, character: "narrator", message: "This is another convo", last: true},
                {convoId: 2, character: "narrator", message: "With another message", last: false}]
        }
    },
    getters: {
        getPlayed(state) {
            return state.played;
        },
        getPlaying(state) {
            return state.playing;
        }
    },
    actions: {
        playConvo(convoId) {
            const toPlayArray = this.unplayed.filter((message) => message.convoId == convoId);
            for (var i in toPlayArray) {
                this.toPlay.push(toPlayArray[i])
            }

            if (this.playing.length == 0) {
                this.moveToPlayintoPlaying();
            }
        },
        movePlayingIntoPlayed() {
            const misc = useMiscStore();

            const message = this.playing.pop();

            this.played.unshift(message);

            if (this.toPlay.length != 0) {
                setTimeout(() => {
                    this.moveToPlayintoPlaying();
                }, 1000)
            }

            if (message.last) {
                misc.addSeenConvo(message.convoId);
            }
        },
        moveToPlayintoPlaying() {
            const message = this.toPlay.shift();

            this.playing.push(message);
        }
    }
})