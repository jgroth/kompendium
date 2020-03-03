import { Component, Host, h, Element } from '@stencil/core';

@Component({
    tag: 'maki-search',
    styleUrl: 'search.scss',
    shadow: true
})
export class Search {

    @Element()
    private host: HTMLElement;

    componentDidLoad() {
        this.host.shadowRoot.querySelector('input').focus();
    }


    render() {
        return (
            <div class="search-box">
                <input type="text" autoFocus placeholder="Search"/>
                <ul class="result"></ul>
            </div>
        );
    }

}
