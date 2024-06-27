import { defineStore } from "pinia";

export const useTextLogStore = defineStore("textLog", {
    state: () => {
        return {
            played: [],
            playing: [],
            toPlay: [],
            unplayed: [
                {convoId: 1, character: "narrator", message: "test message"}, 
                {convoId: 1, character: "narrator", message: "something else"}, 
                {convoId: 2, character: "narrator", message: "This is another convo"},
                {convoId: 2, character: "narrator", message: "With another message"}]
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
            const message = this.playing.pop();

            this.played.unshift(message);

            if (this.toPlay.length != 0) {
                setTimeout(() => {
                    this.moveToPlayintoPlaying();
                }, 1000)
            }

        },
        moveToPlayintoPlaying() {
            const message = this.toPlay.shift();

            this.playing.push(message);
        }
    }
})