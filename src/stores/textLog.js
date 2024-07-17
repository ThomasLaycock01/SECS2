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
                {convoId: 0, character: "barty", message: "Oh! Yes, of course... one moment...", last: true},
                //convo 1
                {convoId: 1, character: "barty", message: "...Nothing happened.", last: false},
                {convoId: 1, character: "hector", message: "Nothing happened?", last: false},
                {convoId: 1, character: "barty", message: "Yes. Why did nothing happen!?!?!", last: false},
                {convoId: 1, character: "hector", message: "Let me have a look.", last: false},
                {convoId: 1, character: "hector", message: "Oh.", last: false},
                {convoId: 1, character: "hector", message: "You've not got the resource display turned on.", last: false},
                {convoId: 1, character: "hector", message: "I'll turn it on for you.", last: true},
                //convo 2
                {convoId: 2, character: "barty", message: "Soooo....", last: false},
                {convoId: 2, character: "barty", message: "How much Evilness do I need to become Super Evil?", last: false},
                {convoId: 2, character: "hector", message: "One Billion.", last: false},
                {convoId: 2, character: "barty", message: "ONE BILLION!?!", last: false},
                {convoId: 2, character: "barty", message: "D'awww, We're gonna be here FOREVER!", last: false},
                {convoId: 2, character: "hector", message: "Perhaps you should find some help, Sir.", last: false},
                {convoId: 2, character: "hector", message: "It might make things a bit quicker.", last: false},
                {convoId: 2, character: "barty", message: "You're a genius, Hector!", last: false},
                {convoId: 2, character: "barty", message: "MWUHAHAHAHA!!!!", last: true},
                
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
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            const textLogObject = {
                played: this["played"],
                playing: this["playing"],
                toPlay: this["toPlay"],
                unplayed: this["unplayed"]
            }

            data.textLog = textLogObject;

            localStorage.setItem("SECSData", JSON.stringify(data));
        }
    }
})