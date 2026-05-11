type SegmentTransform = (segment: string) => string;

const FENCE_REGEX = /^\s*(?:>\s?)?(`{3,}|~{3,})/;

export const transformOutsideFencedBlocks = (
    content: string,
    transform: SegmentTransform,
): string => {
    if (!content) return content;

    const lines = content.split("\n");
    const output: string[] = [];
    const buffer: string[] = [];
    let inFence = false;
    let fenceChar = "";
    let fenceSize = 0;

    const flush = () => {
        if (!buffer.length) return;
        output.push(transform(buffer.join("\n")));
        buffer.length = 0;
    };

    for (const line of lines) {
        const match = line.match(FENCE_REGEX);
        if (match) {
            const marker = match[1]!;
            if (!inFence) {
                flush();
                inFence = true;
                fenceChar = marker[0]!;
                fenceSize = marker.length;
                output.push(line);
                continue;
            }

            if (marker[0] === fenceChar && marker.length >= fenceSize) {
                inFence = false;
                fenceChar = "";
                fenceSize = 0;
                output.push(line);
                continue;
            }
        }

        if (inFence) {
            output.push(line);
        } else {
            buffer.push(line);
        }
    }

    flush();
    return output.join("\n");
};
