<template>
    <div>{{ displayText }}</div>
</template>

<script>
import { useTextLogStore } from '@/stores/textLog';

import { ref } from 'vue';

export default {
    data() {
        return {
            charIndex: 0,
            displayText: ""
        }
    },
    props: {
        message: {type: String}
    },
    setup(props) {
        const string = ref(props.message);
        return {
            string
        }
    },  
    methods: {
        typeText(string) {
            const textLog = useTextLogStore();
            if (this.charIndex < string.length) {
                this.displayText += string[this.charIndex];
                this.charIndex += 1;

                if (this.charIndex == string.length) {
                    console.log("firing")
                    textLog.movePlayingIntoPlayed();
                }
                else {
                    setTimeout(() => {
                    this.typeText(this.string);
                    }, 100);
                }
                
            }
        }
    },
    mounted() {
        this.typeText(this.string);
    }
}
</script>