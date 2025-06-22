<template>
    <div class="flex flex-col items-center justify-center h-10">
        <div class="relative h-10 w-6">
            <div class="absolute top-0 left-1/2 w-0.5 h-2 -translate-x-1/2 animate-arrow">⏑</div>
            <div class="absolute top-2 left-1/2 w-0.5 h-2 -translate-x-1/2 animate-arrow animation-delay-200">⏑</div>
            <div class="absolute top-4 left-1/2 w-0.5 h-2 -translate-x-1/2 animate-arrow animation-delay-400">⏑</div>
        </div>
    </div>
</template>

<style>
.animate-arrow {
    animation: arrow 1.5s infinite;
}

.animation-delay-200 {
    animation-delay: 0.2s;
}

.animation-delay-400 {
    animation-delay: 0.4s;
}

@keyframes arrow {
    0% {
        transform: translate(-50%, 0);
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    80% {
        opacity: 0.8;
    }

    100% {
        transform: translate(-50%, 12px);
        opacity: 0;
    }
}
</style>