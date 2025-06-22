<template>
    <div class="typing-effect">
        <span ref="textElement">{{ displayedText }}</span>
        <span v-if="showCursor" class="cursor" :class="{
            'cursor-blink': !isTyping && blinkCursor,
            'cursor-static': !blinkCursor
        }">|</span>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    typingSpeed: {
        type: Number,
        default: 100
    },
    startDelay: {
        type: Number,
        default: 500
    },
    blinkCursor: {
        type: Boolean,
        default: true
    },
    showCursor: {
        type: Boolean,
        default: true
    }

})

const displayedText = ref('')
const isTyping = ref(false)

const typeText = () => {
    isTyping.value = true
    let i = 0
    const typingInterval = setInterval(() => {
        if (i < props.text.length) {
            displayedText.value += props.text.charAt(i)
            i++
        } else {
            clearInterval(typingInterval)
            isTyping.value = false
        }
    }, props.typingSpeed)
}

onMounted(() => {
    setTimeout(() => {
        typeText()
    }, props.startDelay)
})

watch(() => props.text, (newText) => {
    displayedText.value = ''
    typeText()
})
</script>

<style scoped>
.typing-effect {
    display: inline-block;
    font-family: monospace;
    white-space: pre;
}

.cursor {
    display: inline-block;
    margin-left: 2px;
    color: inherit;
}

.cursor-blink {
    animation: blink-animation 1s steps(2, start) infinite;
}

.cursor-static {
    opacity: 1;
}

@keyframes blink-animation {
    to {
        visibility: hidden;
    }
}
</style>
