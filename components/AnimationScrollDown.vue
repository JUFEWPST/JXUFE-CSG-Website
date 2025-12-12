<template>
    <div class="flex h-10 flex-col items-center justify-center">
        <div class="relative h-10 w-6">
            <div
                class="animate-arrow absolute top-0 left-1/2 h-2 w-0.5 -translate-x-1/2"
            >
                ⏑
            </div>
            <div
                class="animate-arrow animation-delay-200 absolute top-2 left-1/2 h-2 w-0.5 -translate-x-1/2"
            >
                ⏑
            </div>
            <div
                class="animate-arrow animation-delay-400 absolute top-4 left-1/2 h-2 w-0.5 -translate-x-1/2"
            >
                ⏑
            </div>
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
