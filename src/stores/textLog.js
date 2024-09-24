import { defineStore } from "pinia";

import { useMiscStore } from "./misc";

import convos from "../assets/json/convos.json"

export const useTextLogStore = defineStore("textLog", {
    state: () => {
        return {
            played: [],
            playing: [],
            toPlay: [],
            unplayed: []
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

            //since there is a breif moment where toPlay is empty, this makes sure that the textlog doesnt accudentally start playing two convos at once
            const prePushToPlayLength = this.toPlay.length;

            for (var i in toPlayArray) {
                this.toPlay.push(toPlayArray[i])
            }

            if (this.playing.length == 0 && prePushToPlayLength == 0) {
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
            this["unplayed"] = convos[0];
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            const textLogObject = {
                played: this["played"],
                playing: this["playing"],
                toPlay: this["toPlay"]
            }

            data.textLog = textLogObject;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this["played"] = data.textLog.played;
            this["playing"] = data.textLog.playing;
            this["toPlay"] = data.textLog.toPlay;
        }
    }
})