import { TocEntry } from './toc.types';

/**
 * Tree helpers for navigating a (possibly nested) list of TocEntry nodes.
 * Kept in a separate module from the kompendium-toc component so they can be
 * unit-tested directly -- Stencil only allows a component module to export the
 * component class itself.
 */

export function collectIds(
    entries: TocEntry[],
    acc: Set<string> = new Set(),
): Set<string> {
    for (const entry of entries) {
        acc.add(entry.id);
        collectIds(entry.children || [], acc);
    }

    return acc;
}

export function findEntryById(
    id: string,
    entries: TocEntry[],
): TocEntry | null {
    for (const entry of entries) {
        if (entry.id === id) {
            return entry;
        }

        const deeper = findEntryById(id, entry.children || []);
        if (deeper) {
            return deeper;
        }
    }

    return null;
}

export function findAncestorsOf(
    targetId: string,
    entries: TocEntry[],
    trail: TocEntry[] = [],
): TocEntry[] {
    for (const entry of entries) {
        const children = entry.children || [];
        if (children.some((child) => child.id === targetId)) {
            return [...trail, entry];
        }

        const deeper = findAncestorsOf(targetId, children, [...trail, entry]);
        if (deeper.length) {
            return deeper;
        }
    }

    return [];
}
