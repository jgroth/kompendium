import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
import { TocEntry } from './toc.types';
import { anchorHref } from '../component/anchors';
import { getAnchorId } from '../anchor-scroll';

/**
 * Floating table-of-contents menu. Clicking the button reveals an overlay
 * listing the entries. Selecting an entry updates the URL hash with a slug
 * anchor (e.g. `#/component/my-component#basic-example`) so the page can
 * scroll to the target and the location can be shared.
 * @private
 */
@Component({
    tag: 'kompendium-toc',
    styleUrl: 'toc.scss',
    shadow: true,
})
export class Toc {
    /**
     * Entries to show in the menu. A flat or nested list of links.
     */
    @Prop()
    public entries: TocEntry[] = [];

    @State()
    private open = false;

    @State()
    private userToggles = new Map<string, boolean>();

    @Element()
    private host: HTMLKompendiumTocElement;

    constructor() {
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    public connectedCallback(): void {
        document.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('hashchange', this.handleHashChange);
        this.expandSectionForActiveAnchor();
    }

    public disconnectedCallback(): void {
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('hashchange', this.handleHashChange);
    }

    @Watch('entries')
    protected onEntriesChange(newEntries: TocEntry[]): void {
        const validIds = collectIds(newEntries || []);
        const pruned = new Map<string, boolean>();
        for (const [id, value] of this.userToggles) {
            if (validIds.has(id)) {
                pruned.set(id, value);
            }
        }

        this.userToggles = pruned;
        this.expandSectionForActiveAnchor();
    }

    @Watch('open')
    protected onOpenChange(isOpen: boolean, wasOpen: boolean): void {
        if (isOpen === wasOpen) {
            return;
        }

        const shadow = this.host.shadowRoot;
        if (!shadow) {
            return;
        }

        if (isOpen) {
            requestAnimationFrame(() => {
                const first =
                    shadow.querySelector<HTMLElement>('.panel .link') ||
                    shadow.querySelector<HTMLElement>(
                        '.panel a, .panel button',
                    );
                first?.focus();
            });
        } else {
            const fab = shadow.querySelector<HTMLElement>('.fab');
            fab?.focus();
        }
    }

    public render(): HTMLElement {
        if (!this.entries || !this.entries.length) {
            return <div class="toc hidden"></div>;
        }

        return (
            <div class={{ toc: true, open: this.open }}>
                <div
                    class="scrim"
                    onClick={this.close}
                    aria-hidden="true"
                ></div>
                <div
                    class="panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Table of contents"
                    onClick={stopPropagation}
                >
                    <h2 class="heading">On this page</h2>
                    <ul class="entries">
                        {this.entries.map(this.renderEntry)}
                    </ul>
                </div>
                <button
                    type="button"
                    class="fab"
                    onClick={this.toggle}
                    aria-label="Table of contents"
                    aria-expanded={this.open ? 'true' : 'false'}
                >
                    {this.open ? renderCloseIcon() : renderMenuIcon()}
                </button>
            </div>
        );
    }

    private renderEntry = (entry: TocEntry): HTMLElement => {
        const children = entry.children || [];
        const hasChildren = children.length > 0;
        const collapsible = !!entry.collapsible && hasChildren;
        const expanded = collapsible ? this.isEntryExpanded(entry) : true;

        return (
            <li class={{ entry: true, collapsible: collapsible }}>
                <div class="entry-row">
                    {collapsible ? (
                        <button
                            type="button"
                            class={{ toggle: true, expanded: expanded }}
                            onClick={this.toggleExpanded(entry.id)}
                            aria-expanded={expanded ? 'true' : 'false'}
                            aria-label={`Toggle ${entry.title}`}
                        >
                            {renderChevron()}
                        </button>
                    ) : null}
                    <a
                        class="link"
                        href={anchorHref(entry.id)}
                        onClick={this.handleLinkClick}
                    >
                        {entry.title}
                    </a>
                </div>
                {hasChildren && expanded ? (
                    <ul class="children">{children.map(this.renderEntry)}</ul>
                ) : null}
            </li>
        );
    };

    private toggle = (): void => {
        this.open = !this.open;
    };

    private close = (): void => {
        this.open = false;
    };

    private handleLinkClick = (event: MouseEvent): void => {
        if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
        ) {
            return;
        }

        this.close();
    };

    private toggleExpanded =
        (id: string) =>
        (event: MouseEvent): void => {
            event.preventDefault();
            event.stopPropagation();
            const entry = findEntryById(id, this.entries);
            const current = entry ? this.isEntryExpanded(entry) : false;
            const next = new Map(this.userToggles);
            next.set(id, !current);
            this.userToggles = next;
        };

    private isEntryExpanded(entry: TocEntry): boolean {
        const explicit = this.userToggles.get(entry.id);
        if (explicit !== undefined) {
            return explicit;
        }

        return !!entry.defaultExpanded;
    }

    private handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && this.open) {
            this.open = false;
        }
    }

    private handleHashChange(): void {
        this.expandSectionForActiveAnchor();
    }

    private expandSectionForActiveAnchor(): void {
        const activeId = getAnchorId();
        if (!activeId) {
            return;
        }

        const ancestors = findAncestorsOf(activeId, this.entries).filter(
            (entry) => entry.collapsible,
        );
        if (!ancestors.length) {
            return;
        }

        const next = new Map(this.userToggles);
        let changed = false;
        for (const ancestor of ancestors) {
            if (!this.isEntryExpanded(ancestor)) {
                next.set(ancestor.id, true);
                changed = true;
            }
        }

        if (changed) {
            this.userToggles = next;
        }
    }
}

function collectIds(
    entries: TocEntry[],
    acc: Set<string> = new Set(),
): Set<string> {
    for (const entry of entries) {
        acc.add(entry.id);
        collectIds(entry.children || [], acc);
    }

    return acc;
}

function findEntryById(id: string, entries: TocEntry[]): TocEntry | null {
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

function findAncestorsOf(
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

const stopPropagation = (event: MouseEvent): void => {
    event.stopPropagation();
};

const renderMenuIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
    >
        <path
            fill="currentColor"
            d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z"
        />
    </svg>
);

const renderCloseIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
    >
        <path
            fill="currentColor"
            d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.58 13.4l-6.29 6.3-1.42-1.41L9.17 12 2.87 5.71 4.29 4.3l6.29 6.3 6.3-6.3z"
        />
    </svg>
);

const renderChevron = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
    >
        <path
            fill="currentColor"
            d="M8.59 16.34 13.17 11.75 8.59 7.17 10 5.75l6 6-6 6z"
        />
    </svg>
);
