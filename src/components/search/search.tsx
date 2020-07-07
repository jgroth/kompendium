import { Component, h, Element } from '@stencil/core';

@Component({
    tag: 'kompendium-search',
    styleUrl: 'search.scss',
    shadow: true,
})
export class Search {
    @Element()
    private host: HTMLKompendiumSearchElement;

    componentDidLoad(): void {
        this.host.shadowRoot.querySelector('input').focus();
    }

    render(): HTMLElement {
        return (
            <div class="search-box">
                <input type="search" autoFocus placeholder="Search" />
                <ul class="result"></ul>
            </div>
        );
    }
}
