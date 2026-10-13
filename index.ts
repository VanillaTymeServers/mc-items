import { items } from "./items.ts";

export { items };

export type ItemId = keyof typeof items;

/** Strips the `minecraft:` namespace from an item ID, if present. */
export function toItemId(id: string): string {
    return id.replace(/^minecraft:/, "");
}

/** Returns the English name of an item, or `undefined` if the ID is unknown. */
export function getItemName(id: string): string | undefined {
    return (items as Record<string, string>)[toItemId(id)];
}

/** Returns the icon path for an item, relative to the package root. */
export function getItemIconPath(id: string): string {
    return `icons/${toItemId(id)}.png`;
}
