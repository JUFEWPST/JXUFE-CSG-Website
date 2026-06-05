import type { Component } from "vue";
import type { SegmentTransform } from "./pipeline";

export type { SegmentTransform };

/** 渲染后 DOM 装饰器实例。 */
export interface MarkdownDecorator {
    refresh(): void;
    destroy(): void;
}

export type MarkdownDecoratorFactory = (root: HTMLElement) => MarkdownDecorator;

/** 自包含的 markdown 特性插件：transform / decorate / components 三个扩展点按需实现。 */
export interface MarkdownPlugin {
    name: string;
    transform?: SegmentTransform;
    decorate?: MarkdownDecoratorFactory;
    components?: string[];
}

export const collectTransforms = (
    plugins: MarkdownPlugin[],
): SegmentTransform[] =>
    plugins.flatMap((plugin) => (plugin.transform ? [plugin.transform] : []));

export const collectDecorators = (
    plugins: MarkdownPlugin[],
): { name: string; create: MarkdownDecoratorFactory }[] =>
    plugins.flatMap((plugin) =>
        plugin.decorate ? [{ name: plugin.name, create: plugin.decorate }] : [],
    );

export const collectRequiredComponents = (
    plugins: MarkdownPlugin[],
): string[] => plugins.flatMap((plugin) => plugin.components ?? []);

/** 开发期校验：插件声明的契约组件名是否都已被项目绑定，漏绑则控制台告警。 */
export const assertComponentsBound = (
    plugins: MarkdownPlugin[],
    componentMap: Record<string, Component>,
): void => {
    const missing: string[] = [];
    for (const name of collectRequiredComponents(plugins)) {
        if (!componentMap[name]) {
            missing.push(name);
        }
    }
    if (missing.length > 0) {
        console.warn(
            `[markdown] 以下插件契约组件未绑定，对应特性将无法渲染: ${missing.join(", ")}`,
        );
    }
};
