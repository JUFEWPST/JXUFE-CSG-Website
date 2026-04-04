import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token.mjs";

const ENV_GROUP_KEY = "__mdImageViewerGroupId";
const ENV_COUNT_KEY = "__mdImageViewerImageCount";
const VIEWER_STYLE_ID = "md-image-viewer-style";

type MarkdownRenderEnv = Record<string, unknown> & {
    [ENV_GROUP_KEY]?: string;
    [ENV_COUNT_KEY]?: number;
};

const appendClass = (token: Token, className: string) => {
    const existing = token.attrGet("class");
    token.attrSet("class", existing ? `${existing} ${className}` : className);
};

const createGroupId = () => {
    return `md-gallery-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const markdownItImageViewer = (md: MarkdownIt): void => {
    const defaultImageRenderer =
        md.renderer.rules.image ||
        function (tokens, idx, options, env, slf) {
            return slf.renderToken(tokens, idx, options);
        };

    md.renderer.rules.image = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        if (!token) {
            return defaultImageRenderer(tokens, idx, options, env, slf);
        }

        const renderEnv = (env || {}) as MarkdownRenderEnv;
        if (!renderEnv[ENV_GROUP_KEY]) {
            renderEnv[ENV_GROUP_KEY] = createGroupId();
        }

        const imageIndex = Number(renderEnv[ENV_COUNT_KEY] || 0);
        renderEnv[ENV_COUNT_KEY] = imageIndex + 1;

        token.attrSet("data-md-zoomable", "true");
        token.attrSet("data-md-img-group", renderEnv[ENV_GROUP_KEY] || "");
        token.attrSet("data-md-img-index", String(imageIndex));
        appendClass(token, "md-zoomable-image");

        return defaultImageRenderer(tokens, idx, options, env, slf);
    };
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
}

.md-image-viewer-image.is-dragging {
    cursor: grabbing;
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
    height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface, #f4f4f4);
    background: color-mix(in srgb, var(--md-sys-color-surface-container-low, #1e1e1e) 80%, transparent);
    backdrop-filter: blur(8px);
}

.md-image-viewer-btn {
    width: 40px;
    height: 40px;
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
    transition:
        background-color 0.18s ease,
        color 0.18s ease;
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

@media (max-width: 768px) {
    .md-image-viewer-overlay {
        padding: 8px;
    }

    .md-image-viewer-stage {
        width: 100%;
        height: 100%;
        padding: 10px 48px;
    }

    .md-image-viewer-controls {
        top: 8px;
        right: 8px;
    }

    .md-image-viewer-nav.is-prev {
        left: 6px;
    }

    .md-image-viewer-nav.is-next {
        right: 6px;
    }
}
`;

    const existing = document.getElementById(VIEWER_STYLE_ID) as
        | HTMLStyleElement
        | null;
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

const clamp = (value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
};

const getZoomableImages = (root: HTMLElement) => {
    return Array.from(
        root.querySelectorAll<HTMLImageElement>('img[data-md-zoomable="true"]'),
    );
};

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
    closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    const prevWrap = document.createElement("div");
    prevWrap.className = "md-image-viewer-nav is-prev";

    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "md-image-viewer-btn";
    prevButton.setAttribute("aria-label", "Previous image");
    prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';

    const nextWrap = document.createElement("div");
    nextWrap.className = "md-image-viewer-nav is-next";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "md-image-viewer-btn";
    nextButton.setAttribute("aria-label", "Next image");
    nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

    prevWrap.appendChild(prevButton);
    controls.append(counter, closeButton);
    nextWrap.appendChild(nextButton);
    stage.append(viewerImage, controls, prevWrap, nextWrap);
    overlay.append(backdrop, stage);
    document.body.appendChild(overlay);

    let currentImages: HTMLImageElement[] = [];
    let currentIndex = 0;
    let activeGroup = "";
    let isOpen = false;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let dragReady = false;
    let activePointerId: number | null = null;
    let dragPressX = 0;
    let dragPressY = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let rafId: number | null = null;
    let bodyOverflowCache = "";
    const DRAG_START_THRESHOLD = 4;
    const MIN_SCALE = 0.25;
    const MAX_SCALE = 8;

    const scheduleTransform = () => {
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
            viewerImage.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
            rafId = null;
        });
    };

    const stopDragging = (pointerId?: number) => {
        if (
            pointerId !== undefined &&
            activePointerId !== null &&
            pointerId !== activePointerId
        ) {
            return;
        }

        if (
            activePointerId !== null &&
            viewerImage.hasPointerCapture(activePointerId)
        ) {
            try {
                viewerImage.releasePointerCapture(activePointerId);
            } catch {
                // Ignore release errors when capture is already lost.
            }
        }

        isDragging = false;
        dragReady = false;
        activePointerId = null;
        viewerImage.classList.remove("is-dragging");
    };

    const resetTransform = () => {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        scheduleTransform();
    };

    const updateCounter = () => {
        counter.textContent = `${currentIndex + 1} / ${currentImages.length || 1}`;
        overlay.setAttribute(
            "data-multiple",
            currentImages.length > 1 ? "true" : "false",
        );
    };

    const setImageByIndex = (index: number) => {
        if (!currentImages.length) return;

        currentIndex = (index + currentImages.length) % currentImages.length;
        const source = currentImages[currentIndex];
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
        stopDragging();
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
            ? candidates.filter((img) => img.getAttribute("data-md-img-group") === group)
            : candidates;

        if (!currentImages.length) return;

        const foundIndex = currentImages.findIndex((item) => item === clickedImage);
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

    const handleWheel = (event: WheelEvent) => {
        if (!isOpen) return;

        event.preventDefault();
        const nextScale = clamp(
            scale * (event.deltaY > 0 ? 0.9 : 1.1),
            MIN_SCALE,
            MAX_SCALE,
        );
        if (nextScale === scale) return;

        const rect = stage.getBoundingClientRect();
        const pointerX = event.clientX - (rect.left + rect.width / 2);
        const pointerY = event.clientY - (rect.top + rect.height / 2);
        const ratio = nextScale / scale;

        offsetX = pointerX - (pointerX - offsetX) * ratio;
        offsetY = pointerY - (pointerY - offsetY) * ratio;
        scale = nextScale;

        scheduleTransform();
    };

    const handlePointerDown = (event: PointerEvent) => {
        if (!isOpen || event.button !== 0) return;

        event.preventDefault();
        stopDragging();
        dragReady = true;
        activePointerId = event.pointerId;
        dragPressX = event.clientX;
        dragPressY = event.clientY;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragOffsetX = offsetX;
        dragOffsetY = offsetY;
        viewerImage.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
        if (!isOpen || !dragReady || activePointerId !== event.pointerId) return;

        event.preventDefault();

        if (!isDragging) {
            const movedX = event.clientX - dragPressX;
            const movedY = event.clientY - dragPressY;
            if (Math.hypot(movedX, movedY) < DRAG_START_THRESHOLD) {
                return;
            }
            isDragging = true;
            viewerImage.classList.add("is-dragging");
        }

        offsetX = dragOffsetX + (event.clientX - dragStartX);
        offsetY = dragOffsetY + (event.clientY - dragStartY);
        scheduleTransform();
    };

    const handlePointerEnd = (event: PointerEvent) => {
        stopDragging(event.pointerId);
    };

    const handleImageNativeDrag = (event: DragEvent) => {
        event.preventDefault();
    };

    const handleWindowBlur = () => {
        stopDragging();
    };

    const refresh = () => {
        const images = getZoomableImages(root);
        images.forEach((image) => {
            image.style.cursor = "zoom-in";
        });

        if (!isOpen) return;

        const nextImages = activeGroup
            ? images.filter((image) => image.getAttribute("data-md-img-group") === activeGroup)
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
        stage.removeEventListener("wheel", handleWheel);
        viewerImage.removeEventListener("pointerdown", handlePointerDown);
        viewerImage.removeEventListener("pointerup", handlePointerEnd);
        viewerImage.removeEventListener("pointercancel", handlePointerEnd);
        viewerImage.removeEventListener("lostpointercapture", handlePointerEnd);
        viewerImage.removeEventListener("dragstart", handleImageNativeDrag);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerEnd);
        window.removeEventListener("blur", handleWindowBlur);

        if (rafId !== null) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
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
    stage.addEventListener("wheel", handleWheel, { passive: false });
    viewerImage.addEventListener("pointerdown", handlePointerDown);
    viewerImage.addEventListener("pointerup", handlePointerEnd);
    viewerImage.addEventListener("pointercancel", handlePointerEnd);
    viewerImage.addEventListener("lostpointercapture", handlePointerEnd);
    viewerImage.addEventListener("dragstart", handleImageNativeDrag);
    window.addEventListener("pointermove", handlePointerMove, {
        passive: false,
    });
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("blur", handleWindowBlur);

    refresh();

    return {
        refresh,
        destroy,
    };
};

export default markdownItImageViewer;
