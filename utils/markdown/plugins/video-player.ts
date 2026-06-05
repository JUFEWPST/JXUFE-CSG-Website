import type { MarkdownPlugin } from "../plugin";
import {
    decorateMarkdownVideoEmbeds,
    createMarkdownVideoPlayerController,
} from "../video-player";

export const videoPlayerPlugin: MarkdownPlugin = {
    name: "video-player",
    decorate: (root) => {
        decorateMarkdownVideoEmbeds(root);
        const controller = createMarkdownVideoPlayerController(root);
        return {
            refresh: () => {
                decorateMarkdownVideoEmbeds(root);
                controller.refresh();
            },
            destroy: () => controller.destroy(),
        };
    },
};
