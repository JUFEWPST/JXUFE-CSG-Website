<template>
    <div class="flip-container" :style="containerStyle">
        <div
            class="flipper"
            :class="{ flipped: isFlipped }"
            @click="handleClick"
        >
            <div class="front">
                <slot name="front"></slot>
            </div>
            <div class="back">
                <slot name="back"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    duration: {
        type: Number,
        default: 600,
    },
    clickable: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(["flip", "update:modelValue"]);

const isFlipped = ref(false);

const containerStyle = computed(() => ({
    cursor: props.clickable ? "pointer" : "auto",
}));

const transitionDuration = computed(() => `${props.duration}ms`);

const toggleFlip = () => {
    isFlipped.value = !isFlipped.value;
    emit("flip", isFlipped.value);
    emit("update:modelValue", isFlipped.value);
};

const handleClick = () => {
    if (props.clickable) {
        toggleFlip();
    }
};

defineExpose({
    toggleFlip,
});
</script>

<style scoped>
.flip-container {
    perspective: 1000px;
    margin: 0 auto;
}

.flipper {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform v-bind(transitionDuration);
    transform-style: preserve-3d;
}

.flipper.flipped {
    transform: rotateY(180deg);
}

.front,
.back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back {
    transform: rotateY(180deg);
}
</style>
