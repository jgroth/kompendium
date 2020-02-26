import { Component, h, Host, State, Prop, FunctionalComponent, Method, EventEmitter, Event } from '@stencil/core';
import { JsonDocs } from '@stencil/core/internal';
import { Main } from './templates/main';
import { Sidebar } from './templates/sidebar';
import { Navbar } from './templates/navbar';
import { Examples } from './templates/examples';

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
     * Some text here
     * @deprecated not really
     * @foo bar
     */
    @Prop()
    public fooBar: string = 'baz';

    @Prop()
    public path: string = '/.maki/maki.json';

    @State()
    public docs: JsonDocs;

    @State()
    public route: string = '';

    /**
     * gfg
     * @todo gg
     */
    @Event()
    public foobar: EventEmitter<string>;

    constructor() {
        this.handleNavigation = this.handleNavigation.bind(this);
    }

    protected componentWillLoad() {
        window.addEventListener('hashchange', this.handleNavigation);
        this.fetchData();
        loadFont('https://fonts.googleapis.com/css?family=Public+Sans&display=swap');
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
                    <Examples component={component}/>
                </div>
            </div>
        </div>
    );
}

function loadFont(url: string) {
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', url);
    document.head.appendChild(link);
}
