import { Component, h, Host, State, Prop, FunctionalComponent } from '@stencil/core';
import { JsonDocs } from '@stencil/core/internal';
import { Main } from './templates/main';
import { Sidebar } from './templates/sidebar';
import { Navbar } from './templates/navbar';

/**
 * This is the main Maki app component
 *
 * # Does markdown work?!
 *
 * @deprecated this is deprecated
 */
@Component({
    tag: 'maki-app',
    styleUrl: 'app.scss',
    shadow: true
})
export class App {
    @Prop()
    public path: string = '/.maki/maki.json';

    @State()
    public docs: JsonDocs;

    @State()
    public route: string = '';

    constructor() {
        this.handleNavigation = this.handleNavigation.bind(this);
    }

    protected componentWillLoad() {
        window.addEventListener('hashchange', this.handleNavigation);
        this.fetchData();
    }

    private async fetchData() {
        const data = await fetch(this.path);
        this.docs = await data.json();
    }

    protected render() {
        return (
            <Host>
                <AppPage component={this} />
            </Host>
        );
    }

    private handleNavigation(event: HashChangeEvent) {
        this.route = window.location.hash.substr(1);
    }
}

const AppPage: FunctionalComponent<{ component: App }> = ({ component }) => {
    if (!component.docs) {
        return <div>Loadings...</div>;
    }

    return (
        <div class="maki-body">
            <Navbar component={component} />

            <div class="container-fluid">
                <div class="row">
                    <Sidebar component={component} />
                    <Main component={component} />
                </div>
            </div>
        </div>
    );
}
