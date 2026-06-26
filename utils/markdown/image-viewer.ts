const VIEWER_STYLE_ID = "md-image-viewer-style";

const createGroupId = () => {
    return `md-gallery-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const ensureViewerStyle = () => {
    if (typeof document === "undefined") return;

    const styleContent = `
img[data-md-zoomable="true"] {
    cursor: zoom-in;
}

.md-image-viewer-overlay {
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: grid;
    place-items: center;
    padding: 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    overflow: visible;
    overscroll-behavior: contain;
}

.md-image-viewer-overlay[data-open="true"] {
    opacity: 1;
    pointer-events: auto;
}

.md-image-viewer-backdrop {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--md-sys-color-surface, #121212) 70%, transparent);
    backdrop-filter: blur(4px);
}

.md-image-viewer-stage {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 18px 72px;
    display: grid;
    place-items: center;
    overflow: visible;
    user-select: none;
    touch-action: none;
}

.md-image-viewer-image {
    max-width: min(100%, calc(100vw - 180px));
    max-height: calc(100vh - 76px);
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: var(--border-radius-base, 8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    transform-origin: center center;
    will-change: transform;
    cursor: grab;
    touch-action: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
}

.md-image-viewer-image.is-dragging {
    cursor: grabbing;
}

.md-image-viewer-image.is-animating {
    transition: transform 0.2s ease-out;
}

.md-image-viewer-controls {
    position: fixed;
    top: 14px;
    right: 14px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 8px;
}

.md-image-viewer-counter {
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface, #f4f4f4);
    background: color-mix(in srgb, var(--md-sys-color-surface-container-low, #1e1e1e) 80%, transparent);
    backdrop-filter: blur(8px);
}

.md-image-viewer-btn {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 999px;
    color: var(--md-sys-color-on-primary, #ffffff);
    background: var(--md-sys-color-primary, #4f46e5);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background-color 0.18s ease;
}

.md-image-viewer-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.18s ease;
}

.md-image-viewer-btn:hover::after {
    opacity: 0.08;
}

.md-image-viewer-btn:active::after {
    opacity: 0.12;
}

.md-image-viewer-nav {
    position: fixed;
    top: 50vh;
    transform: translateY(-50%);
    z-index: 2;
}

.md-image-viewer-nav.is-prev {
    left: 14px;
}

.md-image-viewer-nav.is-next {
    right: 14px;
}

.md-image-viewer-overlay[data-multiple="false"] .md-image-viewer-nav,
.md-image-viewer-overlay[data-multiple="false"] .md-image-viewer-counter {
    display: none;
}

.md-image-viewer-mobile-bar {
    display: none;
}

@media (max-width: 768px) {
    .md-image-viewer-overlay {
        padding: 8px;
    }

    .md-image-viewer-stage {
        width: 100%;
        height: 100%;
        padding: 10px 8px 72px;
    }

    .md-image-viewer-image {
        max-width: calc(100vw - 16px);
        max-height: calc(100vh - 120px);
    }

    .md-image-viewer-controls {
        top: 8px;
        right: 8px;
    }

    .md-image-viewer-nav {
        display: none;
    }

    .md-image-viewer-counter {
        display: none;
    }

    .md-image-viewer-mobile-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
        padding: 16px;
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
        background: linear-gradient(to top, color-mix(in srgb, var(--md-sys-color-surface, #121212) 90%, transparent) 60%, transparent);
    }

    .md-image-viewer-mobile-bar-btn {
        width: 44px;
        height: 44px;
        border: none;
        border-radius: 999px;
        color: var(--md-sys-color-on-primary, #ffffff);
        background: var(--md-sys-color-primary, #4f46e5);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: background-color 0.18s ease;
    }

    .md-image-viewer-mobile-bar-btn::after {
        content: "";
        position: absolute;
        inset: 0;
        background: currentColor;
        opacity: 0;
        transition: opacity 0.18s ease;
    }

    .md-image-viewer-mobile-bar-btn:active::after {
        opacity: 0.12;
    }

    .md-image-viewer-mobile-bar-counter {
        font-size: 14px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface, #f4f4f4);
        min-width: 52px;
        text-align: center;
    }
}
`;

    const existing = document.getElementById(
        VIEWER_STYLE_ID,
    ) as HTMLStyleElement | null;
    if (existing) {
        existing.textContent = styleContent;
        return;
    }

    const style = document.createElement("style");
    style.id = VIEWER_STYLE_ID;
    style.textContent = styleContent;
    document.head.appendChild(style);
};

export interface MarkdownImageViewerController {
    refresh: () => void;
    destroy: () => void;
}

export const decorateMarkdownImages = (root: HTMLElement) => {
    const images = Array.from(root.querySelectorAll<HTMLImageElement>("img"));
    if (!images.length) return;

    const groupId = root.dataset.mdImgGroup || createGroupId();
    root.dataset.mdImgGroup = groupId;

    let index = 0;
    images.forEach((image) => {
        if (image.closest(".md-video-player")) return;
        if (image.closest(".js-gh-card")) return;

        image.setAttribute("data-md-zoomable", "true");
        image.setAttribute("data-md-img-group", groupId);
        image.setAttribute("data-md-img-index", String(index));
        image.classList.add("md-zoomable-image");
        index += 1;
    });
};

const clamp = (value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
};

const getZoomableImages = (root: HTMLElement) => {
    return Array.from(
        root.querySelectorAll<HTMLImageElement>('img[data-md-zoomable="true"]'),
    );
};

interface PointerSnapshot {
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
    startTime: number;
    pointerType: string;
    postPinch: boolean;
}

export const createMarkdownImageViewerController = (
    root: HTMLElement,
): MarkdownImageViewerController => {
    ensureViewerStyle();

    const overlay = document.createElement("div");
    overlay.className = "md-image-viewer-overlay";
    overlay.setAttribute("data-open", "false");
    overlay.setAttribute("data-multiple", "false");
    overlay.setAttribute("aria-hidden", "true");

    const backdrop = document.createElement("div");
    backdrop.className = "md-image-viewer-backdrop";

    const stage = document.createElement("div");
    stage.className = "md-image-viewer-stage";

    const viewerImage = document.createElement("img");
    viewerImage.className = "md-image-viewer-image";
    viewerImage.alt = "";
    viewerImage.draggable = false;

    const controls = document.createElement("div");
    controls.className = "md-image-viewer-controls";

    const counter = document.createElement("span");
    counter.className = "md-image-viewer-counter";
    counter.textContent = "1 / 1";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "md-image-viewer-btn";
    closeButton.setAttribute("aria-label", "Close image viewer");
    closeButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    const prevWrap = document.createElement("div");
    prevWrap.className = "md-image-viewer-nav is-prev";

    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "md-image-viewer-btn";
    prevButton.setAttribute("aria-label", "Previous image");
    prevButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';

    const nextWrap = document.createElement("div");
    nextWrap.className = "md-image-viewer-nav is-next";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "md-image-viewer-btn";
    nextButton.setAttribute("aria-label", "Next image");
    nextButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

    const mobileBar = document.createElement("div");
    mobileBar.className = "md-image-viewer-mobile-bar";

    const mobilePrevBtn = document.createElement("button");
    mobilePrevBtn.type = "button";
    mobilePrevBtn.className = "md-image-viewer-mobile-bar-btn";
    mobilePrevBtn.setAttribute("aria-label", "Previous image");
    mobilePrevBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';

    const mobileCounter = document.createElement("span");
    mobileCounter.className = "md-image-viewer-mobile-bar-counter";
    mobileCounter.textContent = "1 / 1";

    const mobileNextBtn = document.createElement("button");
    mobileNextBtn.type = "button";
    mobileNextBtn.className = "md-image-viewer-mobile-bar-btn";
    mobileNextBtn.setAttribute("aria-label", "Next image");
    mobileNextBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

    mobileBar.append(mobilePrevBtn, mobileCounter, mobileNextBtn);
    prevWrap.appendChild(prevButton);
    controls.append(counter, closeButton);
    nextWrap.appendChild(nextButton);
    stage.append(viewerImage, controls, prevWrap, nextWrap, mobileBar);
    overlay.append(backdrop, stage);
    document.body.appendChild(overlay);

    let currentImages: HTMLImageElement[] = [];
    let currentIndex = 0;
    let activeGroup = "";
    let isOpen = false;

    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;

    const activePointers = new Map<number, PointerSnapshot>();
    let primaryPointerId: number | null = null;
    let isDragging = false;
    let dragStartOffsetX = 0;
    let dragStartOffsetY = 0;
    let dragPressX = 0;
    let dragPressY = 0;

    let pinchActive = false;
    let pinchInitialDistance = 1;
    let pinchInitialScale = 1;
    let pinchInitialOffsetX = 0;
    let pinchInitialOffsetY = 0;
    let pinchInitialMidX = 0;
    let pinchInitialMidY = 0;

    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    let rafId: number | null = null;
    let animateTimeoutId: number | null = null;
    let bodyOverflowCache = "";

    const DRAG_START_THRESHOLD = 4;
    const MIN_SCALE = 0.25;
    const MAX_SCALE = 8;
    const DOUBLE_TAP_THRESHOLD = 300;
    const DOUBLE_TAP_DISTANCE = 30;
    const DOUBLE_TAP_ZOOM_SCALE = 2.5;
    const SWIPE_DISTANCE_THRESHOLD = 50;
    const SWIPE_TIME_THRESHOLD = 600;

    const scheduleTransform = () => {
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
            viewerImage.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
            rafId = null;
        });
    };

    const beginAnimation = () => {
        viewerImage.classList.add("is-animating");
        if (animateTimeoutId !== null) {
            window.clearTimeout(animateTimeoutId);
        }
        animateTimeoutId = window.setTimeout(() => {
            viewerImage.classList.remove("is-animating");
            animateTimeoutId = null;
        }, 240);
    };

    const releaseCapture = (pointerId: number) => {
        try {
            if (viewerImage.hasPointerCapture(pointerId)) {
                viewerImage.releasePointerCapture(pointerId);
            }
        } catch {
            // Ignore release errors when capture is already lost.
        }
    };

    const clearAllPointers = () => {
        activePointers.forEach((_, id) => releaseCapture(id));
        activePointers.clear();
        primaryPointerId = null;
        isDragging = false;
        pinchActive = false;
        viewerImage.classList.remove("is-dragging");
    };

    const resetTransform = (animate = false) => {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        if (animate) beginAnimation();
        scheduleTransform();
    };

    const updateCounter = () => {
        const text = `${currentIndex + 1} / ${currentImages.length || 1}`;
        counter.textContent = text;
        mobileCounter.textContent = text;
        overlay.setAttribute(
            "data-multiple",
            currentImages.length > 1 ? "true" : "false",
        );
    };

    const setImageByIndex = (index: number) => {
        if (!currentImages.length) return;

        currentIndex = (index + currentImages.length) % currentImages.length;
        const source = currentImages[currentIndex];
        if (!source) return;
        const sourceUrl = source.currentSrc || source.getAttribute("src") || "";
        if (!sourceUrl) return;

        viewerImage.src = sourceUrl;
        viewerImage.alt = source.alt || "";
        resetTransform();
        updateCounter();
    };

    const closeViewer = () => {
        if (!isOpen) return;

        isOpen = false;
        clearAllPointers();
        overlay.setAttribute("data-open", "false");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = bodyOverflowCache;
        document.removeEventListener("keydown", handleKeydown);
    };

    const openViewer = (clickedImage: HTMLImageElement) => {
        ensureViewerStyle();

        const group = clickedImage.getAttribute("data-md-img-group") || "";
        activeGroup = group;

        const candidates = getZoomableImages(root);
        currentImages = group
            ? candidates.filter(
                  (img) => img.getAttribute("data-md-img-group") === group,
              )
            : candidates;

        if (!currentImages.length) return;

        const foundIndex = currentImages.findIndex(
            (item) => item === clickedImage,
        );
        currentIndex = foundIndex >= 0 ? foundIndex : 0;

        setImageByIndex(currentIndex);
        bodyOverflowCache = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        overlay.setAttribute("data-open", "true");
        overlay.setAttribute("aria-hidden", "false");
        isOpen = true;
        document.addEventListener("keydown", handleKeydown);
    };

    const showNext = () => {
        if (!currentImages.length) return;
        setImageByIndex(currentIndex + 1);
    };

    const showPrev = () => {
        if (!currentImages.length) return;
        setImageByIndex(currentIndex - 1);
    };

    function handleKeydown(event: KeyboardEvent) {
        if (!isOpen) return;

        if (event.key === "Escape") {
            closeViewer();
            return;
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            showNext();
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPrev();
        }
    }

    const handleRootClick = (event: MouseEvent) => {
        const target = event.target as Element | null;
        const image = target?.closest(
            'img[data-md-zoomable="true"]',
        ) as HTMLImageElement | null;

        if (!image || !root.contains(image)) return;

        event.preventDefault();
        openViewer(image);
    };

    const applyZoomAtPoint = (
        nextScale: number,
        focusX: number,
        focusY: number,
        animate = false,
    ) => {
        const clampedScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
        if (clampedScale === scale) return;

        const rect = stage.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const imageX = (focusX - cx - offsetX) / scale;
        const imageY = (focusY - cy - offsetY) / scale;

        scale = clampedScale;
        offsetX = focusX - cx - imageX * scale;
        offsetY = focusY - cy - imageY * scale;

        if (animate) beginAnimation();
        scheduleTransform();
    };

    const handleWheel = (event: WheelEvent) => {
        if (!isOpen) return;

        event.preventDefault();
        const factor = event.deltaY > 0 ? 0.9 : 1.1;
        applyZoomAtPoint(scale * factor, event.clientX, event.clientY);
    };

    const startPinch = () => {
        const pointers = Array.from(activePointers.values());
        const a = pointers[0];
        const b = pointers[1];
        if (!a || !b) return;

        pinchInitialDistance =
            Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1;
        pinchInitialMidX = (a.clientX + b.clientX) / 2;
        pinchInitialMidY = (a.clientY + b.clientY) / 2;
        pinchInitialScale = scale;
        pinchInitialOffsetX = offsetX;
        pinchInitialOffsetY = offsetY;
        pinchActive = true;

        isDragging = false;
        viewerImage.classList.remove("is-dragging");
    };

    const updatePinch = () => {
        if (!pinchActive) return;
        const pointers = Array.from(activePointers.values());
        const a = pointers[0];
        const b = pointers[1];
        if (!a || !b) return;

        const distance =
            Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1;
        const midX = (a.clientX + b.clientX) / 2;
        const midY = (a.clientY + b.clientY) / 2;

        const nextScale = clamp(
            pinchInitialScale * (distance / pinchInitialDistance),
            MIN_SCALE,
            MAX_SCALE,
        );

        const rect = stage.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const imageX =
            (pinchInitialMidX - cx - pinchInitialOffsetX) / pinchInitialScale;
        const imageY =
            (pinchInitialMidY - cy - pinchInitialOffsetY) / pinchInitialScale;

        scale = nextScale;
        offsetX = midX - cx - imageX * nextScale;
        offsetY = midY - cy - imageY * nextScale;

        scheduleTransform();
    };

    const beginDrag = (pointerId: number, snapshot: PointerSnapshot) => {
        primaryPointerId = pointerId;
        dragStartOffsetX = offsetX;
        dragStartOffsetY = offsetY;
        dragPressX = snapshot.clientX;
        dragPressY = snapshot.clientY;
        isDragging = false;
    };

    const handlePointerDown = (event: PointerEvent) => {
        if (!isOpen) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;

        event.preventDefault();

        const snapshot: PointerSnapshot = {
            clientX: event.clientX,
            clientY: event.clientY,
            startX: event.clientX,
            startY: event.clientY,
            startTime: event.timeStamp,
            pointerType: event.pointerType,
            postPinch: false,
        };
        activePointers.set(event.pointerId, snapshot);

        try {
            viewerImage.setPointerCapture(event.pointerId);
        } catch {
            // Capture may fail in rare cases; events still fire via bubbling.
        }

        if (activePointers.size >= 2) {
            primaryPointerId = null;
            startPinch();
            return;
        }

        beginDrag(event.pointerId, snapshot);
    };

    const handlePointerMove = (event: PointerEvent) => {
        if (!isOpen) return;
        const snapshot = activePointers.get(event.pointerId);
        if (!snapshot) return;

        snapshot.clientX = event.clientX;
        snapshot.clientY = event.clientY;

        if (pinchActive && activePointers.size >= 2) {
            event.preventDefault();
            updatePinch();
            return;
        }

        if (primaryPointerId !== event.pointerId) return;

        if (!isDragging) {
            const movedX = event.clientX - dragPressX;
            const movedY = event.clientY - dragPressY;
            if (Math.hypot(movedX, movedY) < DRAG_START_THRESHOLD) return;
            isDragging = true;
            viewerImage.classList.add("is-dragging");
        }

        event.preventDefault();
        offsetX = dragStartOffsetX + (event.clientX - dragPressX);
        offsetY = dragStartOffsetY + (event.clientY - dragPressY);
        scheduleTransform();
    };

    const finalizeTap = (snapshot: PointerSnapshot, event: PointerEvent) => {
        if (snapshot.pointerType !== "touch") return;
        if (snapshot.postPinch) return;

        const now = event.timeStamp;
        const isDoubleTap =
            lastTapTime > 0 &&
            now - lastTapTime < DOUBLE_TAP_THRESHOLD &&
            Math.hypot(event.clientX - lastTapX, event.clientY - lastTapY) <
                DOUBLE_TAP_DISTANCE;

        if (isDoubleTap) {
            lastTapTime = 0;
            if (scale > 1.05) {
                resetTransform(true);
            } else {
                applyZoomAtPoint(
                    DOUBLE_TAP_ZOOM_SCALE,
                    event.clientX,
                    event.clientY,
                    true,
                );
            }
            return;
        }

        lastTapTime = now;
        lastTapX = event.clientX;
        lastTapY = event.clientY;
    };

    const finalizeSwipe = (snapshot: PointerSnapshot, event: PointerEvent) => {
        if (snapshot.pointerType !== "touch") return false;
        if (snapshot.postPinch) return false;
        if (currentImages.length <= 1) return false;
        if (scale > 1.05) return false;

        const dx = event.clientX - snapshot.startX;
        const dy = event.clientY - snapshot.startY;
        const dt = event.timeStamp - snapshot.startTime;

        if (
            Math.abs(dx) < SWIPE_DISTANCE_THRESHOLD ||
            Math.abs(dx) < Math.abs(dy) * 1.2 ||
            dt > SWIPE_TIME_THRESHOLD
        ) {
            return false;
        }

        if (dx < 0) {
            showNext();
        } else {
            showPrev();
        }
        return true;
    };

    const handlePointerEnd = (event: PointerEvent) => {
        const snapshot = activePointers.get(event.pointerId);
        if (!snapshot) return;

        activePointers.delete(event.pointerId);
        releaseCapture(event.pointerId);

        if (pinchActive) {
            if (activePointers.size < 2) {
                pinchActive = false;
                const remainingEntry = activePointers.entries().next();
                if (!remainingEntry.done) {
                    const [remainingId, remaining] = remainingEntry.value;
                    remaining.startX = remaining.clientX;
                    remaining.startY = remaining.clientY;
                    remaining.startTime = event.timeStamp;
                    remaining.postPinch = true;
                    beginDrag(remainingId, remaining);
                }
            }
            return;
        }

        if (event.pointerId !== primaryPointerId) return;
        primaryPointerId = null;

        const wasDragging = isDragging;
        isDragging = false;
        viewerImage.classList.remove("is-dragging");

        if (!wasDragging) {
            finalizeTap(snapshot, event);
            return;
        }

        if (finalizeSwipe(snapshot, event)) return;

        if (snapshot.pointerType === "touch" && scale <= 1.01) {
            resetTransform(true);
        }
    };

    const handlePointerCancel = (event: PointerEvent) => {
        if (!activePointers.has(event.pointerId)) return;

        activePointers.delete(event.pointerId);
        releaseCapture(event.pointerId);

        if (pinchActive && activePointers.size < 2) {
            pinchActive = false;
        }

        if (event.pointerId === primaryPointerId) {
            primaryPointerId = null;
            isDragging = false;
            viewerImage.classList.remove("is-dragging");
        }
    };

    const handleImageNativeDrag = (event: DragEvent) => {
        event.preventDefault();
    };

    const handleWindowBlur = () => {
        clearAllPointers();
    };

    const handleStageContextMenu = (event: MouseEvent) => {
        if (!isOpen) return;
        const target = event.target as Node | null;
        if (target === viewerImage) {
            event.preventDefault();
        }
    };

    const refresh = () => {
        const images = getZoomableImages(root);
        images.forEach((image) => {
            image.style.cursor = "zoom-in";
        });

        if (!isOpen) return;

        const nextImages = activeGroup
            ? images.filter(
                  (image) =>
                      image.getAttribute("data-md-img-group") === activeGroup,
              )
            : images;

        if (!nextImages.length) {
            closeViewer();
            return;
        }

        currentImages = nextImages;
        currentIndex = clamp(currentIndex, 0, currentImages.length - 1);
        setImageByIndex(currentIndex);
    };

    const destroy = () => {
        closeViewer();
        root.removeEventListener("click", handleRootClick);
        overlay.removeEventListener("click", handleOverlayClick);
        prevButton.removeEventListener("click", handlePrevClick);
        nextButton.removeEventListener("click", handleNextClick);
        closeButton.removeEventListener("click", handleCloseClick);
        mobilePrevBtn.removeEventListener("click", handlePrevClick);
        mobileNextBtn.removeEventListener("click", handleNextClick);
        stage.removeEventListener("wheel", handleWheel);
        stage.removeEventListener("contextmenu", handleStageContextMenu);
        viewerImage.removeEventListener("pointerdown", handlePointerDown);
        viewerImage.removeEventListener("pointerup", handlePointerEnd);
        viewerImage.removeEventListener("pointercancel", handlePointerCancel);
        viewerImage.removeEventListener(
            "lostpointercapture",
            handlePointerCancel,
        );
        viewerImage.removeEventListener("dragstart", handleImageNativeDrag);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerEnd);
        window.removeEventListener("pointercancel", handlePointerCancel);
        window.removeEventListener("blur", handleWindowBlur);

        if (rafId !== null) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
        }
        if (animateTimeoutId !== null) {
            window.clearTimeout(animateTimeoutId);
            animateTimeoutId = null;
        }

        overlay.remove();
    };

    const handleOverlayClick = (event: MouseEvent) => {
        const target = event.target as Node | null;
        if (target === overlay || target === backdrop) {
            closeViewer();
        }
    };

    const handleCloseClick = (event: MouseEvent) => {
        event.preventDefault();
        closeViewer();
    };

    const handleNextClick = (event: MouseEvent) => {
        event.preventDefault();
        showNext();
    };

    const handlePrevClick = (event: MouseEvent) => {
        event.preventDefault();
        showPrev();
    };

    root.addEventListener("click", handleRootClick);
    overlay.addEventListener("click", handleOverlayClick);
    prevButton.addEventListener("click", handlePrevClick);
    nextButton.addEventListener("click", handleNextClick);
    closeButton.addEventListener("click", handleCloseClick);
    mobilePrevBtn.addEventListener("click", handlePrevClick);
    mobileNextBtn.addEventListener("click", handleNextClick);
    stage.addEventListener("wheel", handleWheel, { passive: false });
    stage.addEventListener("contextmenu", handleStageContextMenu);
    viewerImage.addEventListener("pointerdown", handlePointerDown);
    viewerImage.addEventListener("pointerup", handlePointerEnd);
    viewerImage.addEventListener("pointercancel", handlePointerCancel);
    viewerImage.addEventListener("lostpointercapture", handlePointerCancel);
    viewerImage.addEventListener("dragstart", handleImageNativeDrag);
    window.addEventListener("pointermove", handlePointerMove, {
        passive: false,
    });
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerCancel);
    window.addEventListener("blur", handleWindowBlur);

    refresh();

    return {
        refresh,
        destroy,
    };
};
