import { defineStore } from "pinia";

import TLMessages from "@/assets/json/TLMessages.json";

export const useTextLogStore = defineStore("textLog", {
    state: () => {
        return {
            messagesInLog: [],
            messageIndex: {}
        }
    },
    getters: {
        getMessagesInLog(state) {
            return state.messagesInLog;
        }
    },
    actions: {
        instantiateMessages() {
            this.messageIndex = TLMessages;

            this.addMessageToLog("firstLoad");
        },
        addMessageToLog(id) {
            const messageObj = this.messageIndex[id];

            console.log(messageObj);

            this.messagesInLog.unshift(messageObj);
        }
    }
})