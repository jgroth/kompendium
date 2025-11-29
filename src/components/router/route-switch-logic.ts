import { matchRoute, MatchResults } from './route-matching';

/**
 * Interface for accessing route element properties
 * Used for type-safe sibling route checking
 */
export interface RouteElement extends Element {
    url?: string;
}

/**
 * Type guard to check if an element is a route element
 * @param {Element} element - The element to check
 * @returns {boolean} True if the element is a kompendium-route
 */
export function isRouteElement(element: Element): element is RouteElement {
    return element.tagName.toLowerCase() === 'kompendium-route';
}

/**
 * Check if any previous sibling route matches the current path
 * Used by route-switch to implement first-match-wins behavior
 * @param {HTMLElement} currentElement - The current route element
 * @param {string} currentPath - The current path to match
 * @returns {boolean} True if a previous sibling route matches
 */
export function hasPreviousMatchingSibling(
    currentElement: HTMLElement,
    currentPath: string,
): boolean {
    const parent = currentElement.parentElement;
    if (parent?.tagName.toLowerCase() !== 'kompendium-route-switch') {
        return false;
    }

    const siblings = Array.from(parent.children);
    const myIndex = siblings.indexOf(currentElement);

    // Check all previous siblings
    for (let i = 0; i < myIndex; i++) {
        const sibling = siblings[i];

        // Use type guard to ensure element has expected route properties
        if (!isRouteElement(sibling)) {
            continue;
        }

        // Access sibling's URL property with type safety
        const siblingUrl = sibling.url;

        // Check if sibling matches current path
        let siblingMatch: MatchResults;
        if (siblingUrl) {
            siblingMatch = matchRoute(currentPath, siblingUrl);
        } else {
            siblingMatch = { params: {} }; // Routes without URL are catch-all
        }

        if (siblingMatch) {
            return true;
        }
    }

    return false;
}
