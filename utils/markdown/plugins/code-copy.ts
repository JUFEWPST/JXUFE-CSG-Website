import type { MarkdownPlugin } from "../plugin";
import { createMarkdownCodeCopyController } from "../code-copy";

export const codeCopyPlugin: MarkdownPlugin = {
    name: "code-copy",
    decorate: (root) => createMarkdownCodeCopyController(root),
};
