import { defineStore } from "pinia";

import { useMiscStore } from "./misc";

export const useTextLogStore = defineStore("textLog", {
    state: () => {
        return {
            played: [],
            playing: [],
            toPlay: [],
            unplayed: [
                //convo 0 (initial load)
                {convoId: 0, character: "barty", message: "Hector! Are you there?", last: false}, 
                {convoId: 0, character: "hector", message: "Yes... yes, I'm here. Sir", last: false}, 
                {convoId: 0, character: "barty", message: "Then... IT CAN BEGIN! MWUHAHAHAHAHA!!!!!!", last: false},
                {convoId: 0, character: "hector", message: "...", last: false},
                {convoId: 0, character: "barty", message: "...", last: false},
                {convoId: 0, character: "hector", message: "You should press the button, Sir.", last: false},
                {convoId: 0, character: "barty", message: "Oh! Yes, of course... one moment...", last: true}
            ]
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
        },
        loadConvos(array) {
            this["unplayed"] = array;
        }
    }
})