import type { MarkdownPlugin } from "../plugin";
import {
    decorateMarkdownImages,
    createMarkdownImageViewerController,
} from "../image-viewer";

export const imageViewerPlugin: MarkdownPlugin = {
    name: "image-viewer",
    decorate: (root) => {
        decorateMarkdownImages(root);
        const controller = createMarkdownImageViewerController(root);
        return {
            refresh: () => {
                decorateMarkdownImages(root);
                controller.refresh();
            },
            destroy: () => controller.destroy(),
        };
    },
};
