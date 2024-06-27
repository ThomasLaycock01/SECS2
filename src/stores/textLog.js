import { defineStore } from "pinia";

export const useTextLogStore = defineStore("textLog", {
    state: () => {
        return {
            played: [],
            playing: [],
            toPlay: [],
            unplayed: [{convoId: 1, character: "narrator", message: "test message"}, {convoId: 1, character: "narrator", message: "something else"}],
            typing: false
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
            if (this.playing.length != 0) {
                //what to do if it is already typing
            }
            else {
                const toPlayArray = this.unplayed.filter((message) => message.convoId == convoId);
                this.playing.push(toPlayArray.shift());
                for (var i in toPlayArray) {
                    this.toPlay.push(toPlayArray[i])
                }
            }
        },
        movePlayingIntoPlayed() {
            const message = this.playing.pop();

            this.played.push(message);

            this.moveToPlayintoPlaying();
        },
        moveToPlayintoPlaying() {
            const message = this.toPlay.shift();

            this.playing.push(message);
        }
    }
})