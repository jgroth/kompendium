import { Component, h, Element, Prop, State } from '@stencil/core';
import Fuse from 'fuse.js';
import { KompendiumDocument } from '../../types';
import debounce from 'lodash/debounce';

@Component({
    tag: 'kompendium-search',
    styleUrl: 'search.scss',
    shadow: true,
})
export class Search {
    /**
     * Index containing searchable documents
     */
    @Prop()
    public index: any;

    @State()
    private documents: KompendiumDocument[] = [];

    @Element()
    private host: HTMLKompendiumSearchElement;

    constructor() {
        this.search = debounce(this.search, 300);
    }

    componentDidLoad(): void {
        this.host.shadowRoot.querySelector('input').focus();
    }

    render(): HTMLElement {
        const classList = {
            result: true,
            'has-results': this.documents.length > 0,
        };

        return (
            <div class="search-box">
                <input
                    type="search"
                    autoFocus
                    placeholder="Search"
                    onInput={this.handleChangeInput}
                />
                <ul class={classList}>
                    {this.documents.map(this.renderDocument)}
                </ul>
            </div>
        );
    }

    private renderDocument = (document: KompendiumDocument) => {
        return (
            <li>
                <a href={'#' + document.path} onClick={this.handleLinkClick}>
                    <span class="link-text">{document.title}</span>
                </a>
            </li>
        );
    };

    private handleChangeInput = (event: KeyboardEvent) => {
        const query = (event.target as HTMLInputElement).value;
        this.search(query);
    };

    private search(query: string) {
        const index: Fuse<KompendiumDocument> = this.index;
        const result = index.search(query);

        this.documents = result.map((doc) => doc.item).slice(0, 10);
    }

    private handleLinkClick = () => {
        (this.host.shadowRoot.activeElement as HTMLElement)?.blur();
    };
}
