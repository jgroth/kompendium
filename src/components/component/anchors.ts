/**
 * Slug identifiers used by the table-of-contents and URL anchors on the
 * component docs page. Kept separate so the component and its templates
 * can share the same strings.
 */
export const SECTION_SLUGS = {
    examples: 'examples',
    properties: 'properties',
    events: 'events',
    methods: 'methods',
    slots: 'slots',
    styles: 'styles',
} as const;

export type SectionSlug = (typeof SECTION_SLUGS)[keyof typeof SECTION_SLUGS];

/**
 * Derive an anchor id for an example component from its title (first line
 * of its docs). Falls back to the example's tag if no title is available.
 * @param {string} docs the example's docs text
 * @param {string} fallbackTag tag to slugify if the docs have no title
 * @returns {string} the anchor id to use in the URL hash
 */
export function exampleAnchorId(docs: string, fallbackTag: string): string {
    const title = (docs || '').split('\n')[0].trim();
    const slug = title ? slugify(title) : '';

    return slug || slugify(fallbackTag);
}

/**
 * Read the current route part of the URL hash, stripping any trailing
 * `#fragment` anchor.
 * @returns {string} the route, without leading `#`
 */
export function currentRoute(): string {
    const hash = window.location.hash.replace(/^#/, '');
    const separatorIndex = hash.indexOf('#');

    return separatorIndex === -1 ? hash : hash.substring(0, separatorIndex);
}

/**
 * Build an `href` that preserves the current route and adds a secondary
 * `#slug` anchor, e.g. `#/component/my-component#basic-example`.
 * @param {string} slug the anchor id to link to
 * @returns {string} the full href value
 */
export function anchorHref(slug: string): string {
    return `#${currentRoute()}#${slug}`;
}

/**
 * Turn an arbitrary identifier (camelCase, CSS custom property, etc.) into
 * a URL-safe slug.
 * @param {string} name the identifier to slugify
 * @returns {string} the slugified identifier
 */
export function slugify(name: string): string {
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Build a slug for an entry nested under a section, e.g. `properties-value`.
 * @param {string} sectionSlug the section slug
 * @param {string} name the entry name
 * @returns {string} the combined slug
 */
export function entrySlug(sectionSlug: string, name: string): string {
    return `${sectionSlug}-${slugify(name)}`;
}
