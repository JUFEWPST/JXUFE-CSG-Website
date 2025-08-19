const colorMap = new Map<string, string>();
const VIBRANT_HUES = [
    [210, 230],  // 蓝
    [330, 360],  // 粉/红
    [20, 40],    // 橙
    [270, 290],  // 紫
    [120, 140],  // 绿
    [180, 200]   // 青
];
export function getRandomColor(tag: string): string {
    if (colorMap.has(tag)) return colorMap.get(tag)!;

    // 随机选择一个鲜艳色相范围
    const hueRange = VIBRANT_HUES[Math.floor(Math.random() * VIBRANT_HUES.length)];
    const hue = Math.floor(Math.random() * (hueRange[1] - hueRange[0])) + hueRange[0];
    const saturation = Math.floor(Math.random() * 30) +62; // 70-100%
    const lightness = Math.floor(Math.random() * 15) + 45;  // 25-40%

    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colorMap.set(tag, color);
    return color;
}