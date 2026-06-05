const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg)$/i;

const renderVideoPlayer = (src: string, alt: string = "Video") => {
    return `
<div class="md-video-player" data-md-video="true">
    <video class="md-video-media" src="${src}" preload="metadata" playsinline></video>
    <div class="md-video-buffering">
        <svg class="md-video-spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
    </div>
    <div class="md-video-controls">
        <button class="md-video-btn md-video-play" aria-label="Play/Pause">
            <svg class="md-icon-play" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <svg class="md-icon-pause" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
        </button>
        <div class="md-video-time md-video-time-current">0:00</div>
        <div class="md-video-progress-container">
            <div class="md-video-progress-bar">
                <div class="md-video-progress-loaded"></div>
                <div class="md-video-progress-filled"></div>
            </div>
            <input type="range" class="md-video-progress-input" min="0" max="100" step="0.1" value="0">
        </div>
        <div class="md-video-time md-video-time-total">0:00</div>
        <div class="md-video-volume-container">
            <button class="md-video-btn md-video-volume-btn" aria-label="Mute/Unmute">
                <svg class="md-icon-volume-on" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <svg class="md-icon-volume-off" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
            </button>
            <div class="md-video-volume-popup">
                <div class="md-video-volume-percent">50</div>
                <div class="md-video-volume-track">
                    <div class="md-video-volume-filled"></div>
                    <div class="md-video-volume-thumb"></div>
                </div>
            </div>
        </div>
        <button class="md-video-btn md-video-fullscreen" aria-label="Fullscreen">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
        </button>
    </div>
</div>`;
};

const ensureVideoPlayerStyle = () => {
    if (typeof document === "undefined") return;
    const STYLE_ID = "md-video-player-style";
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
.md-video-player {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 1.5rem auto;
    border-radius: var(--border-radius-base, 12px);
    overflow: hidden;
    background: #000;
    display: flex;
    flex-direction: column;
}

.md-video-media {
    width: 100%;
    display: block;
    max-height: 70vh;
    object-fit: contain;
}

.md-video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: #fff;
}

.md-video-player:hover .md-video-controls,
.md-video-player.is-paused .md-video-controls {
    opacity: 1;
}

.md-video-btn {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 6px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    transition: background 0.15s ease;
}

.md-video-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}

.md-video-btn:active {
    background: rgba(255, 255, 255, 0.25);
}

.md-video-time {
    font-size: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    font-variant-numeric: tabular-nums;
    user-select: none;
    opacity: 0.8;
}

.md-video-progress-container {
    flex: 1;
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.md-video-progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    position: relative;
    overflow: hidden;
    transition: height 0.15s ease;
}

.md-video-progress-container:hover .md-video-progress-bar {
    height: 6px;
}

.md-video-progress-loaded {
    height: 100%;
    background: rgba(255, 255, 255, 0.4);
    width: 0%;
    position: absolute;
    top: 0;
    left: 0;
}

.md-video-progress-filled {
    height: 100%;
    background: var(--md-sys-color-primary, #4f46e5);
    width: 0%;
    position: relative;
}

.md-video-progress-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    margin: 0;
}

.md-video-volume-container {
    display: flex;
    align-items: center;
    position: relative;
}

.md-video-volume-popup {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    width: 36px;
    height: 100px;
    background: rgba(28, 27, 31, 0.95);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 10px 0;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1), visibility 0.2s, transform 0.2s cubic-bezier(0.2, 0, 0, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 10;
}

.md-video-volume-container:hover .md-video-volume-popup,
.md-video-volume-popup:focus-within {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

.md-video-volume-percent {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.85);
    font-family: system-ui, -apple-system, sans-serif;
    font-variant-numeric: tabular-nums;
    user-select: none;
    line-height: 1;
}

.md-video-volume-track {
    width: 4px;
    height: 60px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    position: relative;
    cursor: pointer;
}

.md-video-volume-filled {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: var(--md-sys-color-primary, #4f46e5);
    border-radius: 2px;
    pointer-events: none;
}

.md-video-volume-thumb {
    position: absolute;
    left: 50%;
    bottom: 50%;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    transform: translate(-50%, 50%);
    pointer-events: none;
}

.md-video-buffering {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.md-video-player.is-buffering .md-video-buffering {
    opacity: 1;
}

.md-video-spinner {
    animation: rotate 2s linear infinite;
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    width: 50px;
    height: 50px;
}

.md-video-spinner .path {
    stroke: var(--md-sys-color-primary, #4f46e5);
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
    100% { transform: rotate(360deg); }
}

@keyframes dash {
    0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
    50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
    100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

.md-video-player:fullscreen {
    max-width: none;
    width: 100vw;
    height: 100vh;
    margin: 0;
    border-radius: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
}

.md-video-player:fullscreen .md-video-media {
    max-height: 100%;
    height: 100%;
}

.md-video-player:-webkit-full-screen {
    max-width: none;
    width: 100vw;
    height: 100vh;
    margin: 0;
    border-radius: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
}

.md-video-player:-webkit-full-screen .md-video-media {
    max-height: 100%;
    height: 100%;
}
`;
    document.head.appendChild(style);
};

const getVideoSrc = (video: HTMLVideoElement): string => {
    if (video.currentSrc) return video.currentSrc;
    const direct = video.getAttribute("src");
    if (direct) return direct;
    const source = video.querySelector("source");
    return source?.getAttribute("src") || "";
};

const replaceWithVideoPlayer = (
    target: Element,
    src: string,
    alt: string = "Video",
) => {
    if (!src) return;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = renderVideoPlayer(src, alt);
    const player = wrapper.firstElementChild;
    if (!player) return;
    target.replaceWith(player);
};

export const decorateMarkdownVideoEmbeds = (root: HTMLElement) => {
    const images = Array.from(root.querySelectorAll<HTMLImageElement>("img"));
    images.forEach((image) => {
        if (image.closest(".md-video-player")) return;
        const src = image.getAttribute("src") || "";
        if (!src || !VIDEO_EXTENSIONS.test(src)) return;
        const alt = image.getAttribute("alt") || "Video";
        replaceWithVideoPlayer(image, src, alt);
    });

    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video"));
    videos.forEach((video) => {
        if (video.closest(".md-video-player")) return;
        const src = getVideoSrc(video);
        if (!src) return;
        replaceWithVideoPlayer(video, src);
    });
};

export interface MarkdownVideoPlayerController {
    destroy: () => void;
    refresh: () => void;
}

export const createMarkdownVideoPlayerController = (
    container: HTMLElement,
): MarkdownVideoPlayerController => {
    ensureVideoPlayerStyle();

    let players: {
        container: HTMLElement;
        video: HTMLVideoElement;
        cleanup: () => void;
    }[] = [];

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const initPlayers = () => {
        const els = Array.from(
            container.querySelectorAll<HTMLElement>(
                '.md-video-player[data-md-video="true"]',
            ),
        );

        els.forEach((playerEl) => {
            if (playerEl.dataset.initialized) return;
            playerEl.dataset.initialized = "true";

            const video =
                playerEl.querySelector<HTMLVideoElement>(".md-video-media");
            const playBtn =
                playerEl.querySelector<HTMLButtonElement>(".md-video-play");
            const iconPlay =
                playerEl.querySelector<HTMLElement>(".md-icon-play");
            const iconPause =
                playerEl.querySelector<HTMLElement>(".md-icon-pause");
            const timeCurrent = playerEl.querySelector<HTMLElement>(
                ".md-video-time-current",
            );
            const timeTotal = playerEl.querySelector<HTMLElement>(
                ".md-video-time-total",
            );
            const progressLoaded = playerEl.querySelector<HTMLElement>(
                ".md-video-progress-loaded",
            );
            const progressFilled = playerEl.querySelector<HTMLElement>(
                ".md-video-progress-filled",
            );
            const progressInput = playerEl.querySelector<HTMLInputElement>(
                ".md-video-progress-input",
            );
            const fullscreenBtn = playerEl.querySelector<HTMLButtonElement>(
                ".md-video-fullscreen",
            );
            const volumeContainer = playerEl.querySelector<HTMLElement>(
                ".md-video-volume-container",
            );
            const volumeBtn = playerEl.querySelector<HTMLButtonElement>(
                ".md-video-volume-btn",
            );
            const volumeTrack = playerEl.querySelector<HTMLElement>(
                ".md-video-volume-track",
            );
            const volumeFilled = playerEl.querySelector<HTMLElement>(
                ".md-video-volume-filled",
            );
            const volumeThumb = playerEl.querySelector<HTMLElement>(
                ".md-video-volume-thumb",
            );
            const volumePercent = playerEl.querySelector<HTMLElement>(
                ".md-video-volume-percent",
            );
            const iconVolumeOn =
                playerEl.querySelector<HTMLElement>(".md-icon-volume-on");
            const iconVolumeOff = playerEl.querySelector<HTMLElement>(
                ".md-icon-volume-off",
            );

            if (!video || !playBtn || !progressInput || !progressFilled) return;

            video.volume = 0.5;
            playerEl.classList.add("is-paused");

            const updatePlayState = () => {
                if (video.paused || video.ended) {
                    playerEl.classList.add("is-paused");
                    if (iconPlay) iconPlay.style.display = "block";
                    if (iconPause) iconPause.style.display = "none";
                } else {
                    playerEl.classList.remove("is-paused");
                    if (iconPlay) iconPlay.style.display = "none";
                    if (iconPause) iconPause.style.display = "block";
                }
            };

            const togglePlay = () => {
                if (video.paused || video.ended) {
                    video.play().catch(console.error);
                } else {
                    video.pause();
                }
            };

            const updateProgress = () => {
                if (!video.duration) return;
                const percent = (video.currentTime / video.duration) * 100;
                progressFilled.style.width = `${percent}%`;
                if (!isDraggingProgress) {
                    progressInput.value = percent.toString();
                }
                if (timeCurrent)
                    timeCurrent.textContent = formatTime(video.currentTime);
            };

            const updateBufferProgress = () => {
                if (!video.duration || video.buffered.length === 0) return;
                try {
                    const bufferedEnd = video.buffered.end(
                        video.buffered.length - 1,
                    );
                    const percent = (bufferedEnd / video.duration) * 100;
                    if (progressLoaded)
                        progressLoaded.style.width = `${percent}%`;
                } catch {
                    // Ignore index size error
                }
            };

            const onDurationChange = () => {
                if (timeTotal)
                    timeTotal.textContent = formatTime(video.duration);
            };

            let isDraggingProgress = false;

            const onSeekInput = (e: Event) => {
                isDraggingProgress = true;
                const target = e.target as HTMLInputElement;
                const time = (parseFloat(target.value) / 100) * video.duration;
                progressFilled.style.width = `${target.value}%`;
                if (timeCurrent) timeCurrent.textContent = formatTime(time);
            };

            const onSeekChange = (e: Event) => {
                const target = e.target as HTMLInputElement;
                const time = (parseFloat(target.value) / 100) * video.duration;
                video.currentTime = time;
                isDraggingProgress = false;
            };

            const toggleVolume = () => {
                video.muted = !video.muted;
                updateVolumeUI();
            };

            let isDraggingVolume = false;

            const setVolumeFromEvent = (e: MouseEvent) => {
                if (!volumeTrack) return;
                const rect = volumeTrack.getBoundingClientRect();
                const ratio = 1 - (e.clientY - rect.top) / rect.height;
                video.volume = Math.max(0, Math.min(1, ratio));
                video.muted = video.volume === 0;
                updateVolumeUI();
            };

            const onVolumeMouseDown = (e: MouseEvent) => {
                isDraggingVolume = true;
                setVolumeFromEvent(e);
                const onMove = (ev: MouseEvent) => {
                    if (isDraggingVolume) setVolumeFromEvent(ev);
                };
                const onUp = () => {
                    isDraggingVolume = false;
                    document.removeEventListener("mousemove", onMove);
                    document.removeEventListener("mouseup", onUp);
                };
                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
            };

            const updateVolumeUI = () => {
                if (!iconVolumeOn || !iconVolumeOff) return;
                const percent = video.muted ? 0 : Math.round(video.volume * 100);
                if (volumeFilled)
                    volumeFilled.style.height = `${percent}%`;
                if (volumeThumb)
                    volumeThumb.style.bottom = `${percent}%`;
                if (volumePercent)
                    volumePercent.textContent = String(percent);
                if (video.muted || video.volume === 0) {
                    iconVolumeOn.style.display = "none";
                    iconVolumeOff.style.display = "block";
                } else {
                    iconVolumeOn.style.display = "block";
                    iconVolumeOff.style.display = "none";
                }
            };

            const handleWaiting = () => playerEl.classList.add("is-buffering");
            const handlePlaying = () =>
                playerEl.classList.remove("is-buffering");

            const toggleFullscreen = () => {
                if (!document.fullscreenElement) {
                    playerEl.requestFullscreen().catch(console.error);
                } else {
                    document.exitFullscreen();
                }
            };

            playBtn.addEventListener("click", togglePlay);
            video.addEventListener("click", togglePlay);
            video.addEventListener("play", updatePlayState);
            video.addEventListener("pause", updatePlayState);
            video.addEventListener("timeupdate", updateProgress);
            video.addEventListener("progress", updateBufferProgress);
            video.addEventListener("loadedmetadata", onDurationChange);
            video.addEventListener("waiting", handleWaiting);
            video.addEventListener("playing", handlePlaying);
            video.addEventListener("canplay", handlePlaying);
            progressInput.addEventListener("input", onSeekInput);
            progressInput.addEventListener("change", onSeekChange);
            fullscreenBtn?.addEventListener("click", toggleFullscreen);
            volumeBtn?.addEventListener("click", toggleVolume);
            volumeTrack?.addEventListener("mousedown", onVolumeMouseDown);
            updateVolumeUI();

            players.push({
                container: playerEl,
                video,
                cleanup: () => {
                    playBtn.removeEventListener("click", togglePlay);
                    video.removeEventListener("click", togglePlay);
                    video.removeEventListener("play", updatePlayState);
                    video.removeEventListener("pause", updatePlayState);
                    video.removeEventListener("timeupdate", updateProgress);
                    video.removeEventListener("progress", updateBufferProgress);
                    video.removeEventListener(
                        "loadedmetadata",
                        onDurationChange,
                    );
                    video.removeEventListener("waiting", handleWaiting);
                    video.removeEventListener("playing", handlePlaying);
                    video.removeEventListener("canplay", handlePlaying);
                    progressInput.removeEventListener("input", onSeekInput);
                    progressInput.removeEventListener("change", onSeekChange);
                    fullscreenBtn?.removeEventListener(
                        "click",
                        toggleFullscreen,
                    );
                    volumeBtn?.removeEventListener("click", toggleVolume);
                    volumeTrack?.removeEventListener("mousedown", onVolumeMouseDown);
                },
            });
        });
    };

    initPlayers();

    return {
        refresh: initPlayers,
        destroy: () => {
            players.forEach((p) => p.cleanup());
            players = [];
        },
    };
};
