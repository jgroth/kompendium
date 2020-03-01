import { Component, h, Host, State, Prop, FunctionalComponent, Method, EventEmitter, Event } from '@stencil/core';
import { JsonDocs } from '@stencil/core/internal';
import { Main } from './templates/main';
import { Sidebar } from './templates/sidebar';
import { Navbar } from './templates/navbar';
import { Examples } from './templates/examples';
import { MakiData } from '../../maki/config';

/**
 * This is the main Maki app component
 *
 * # Does markdown work?!
 *
 * @deprecated this is deprecated
 *
 * @slot test - docs for this slot
 * over several lines
 *
 * @style asd
 */
@Component({
    tag: 'maki-app',
    styleUrl: 'app.scss',
    shadow: true
})
export class App {
    /**
     * Some text here!
     * @deprecated not really
     * @foo bar
     */
    @Prop()
    public fooBar: string = 'baz';

    @Prop()
    public path: string = '/.maki/maki.json';

    @State()
    public data: MakiData;

    /**
     * gfg
     * @todo gg
     */
    @Event()
    public foobar: EventEmitter<string>;

    constructor() {
    }

    protected componentWillLoad() {
        this.fetchData();
    }

    private async fetchData() {
        const data = await fetch(this.path);
        this.data = await data.json();
    }

    protected render() {
        return (
            <Host>
                <AppPage component={this} />
            </Host>
        );
    }

    /**
     * Don't call this
     *
     * @param s - some text
     * @
     *
     * @deprecated foobar
     * @returns qwertyy
     */
    @Method({})
    public async test(s: string, flag: boolean) {
        return s;
    }
}

const AppPage: FunctionalComponent<{ component: App }> = ({ component }) => {
    if (!component.data) {
        return <div>Loadings...</div>;
    }


    return (
        <div class="maki-body">

            <maki-navigation menu={component.data.menu} />
            <Main component={component} />
            <Examples component={component} />
        </div>
    );
}
