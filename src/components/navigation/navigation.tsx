import {
    Component,
    h,
    Prop,
    State,
    getAssetPath,
    Element,
} from '@stencil/core';
import { MenuItem } from '../../types';

/**
 * @private
 */
@Component({
    tag: 'kompendium-navigation',
    styleUrl: 'navigation.scss',
    shadow: true,
})
export class Navigation {
    /**
     * The menu to display
     */
    @Prop()
    public menu: MenuItem[];

    /**
     * Title to display at the top of the navigation
     */
    @Prop()
    public header: string;

    /**
     * Optional logo to display instead of the header
     */
    @Prop()
    public logo: string;

    @State()
    private route = '';

    @Element()
    private host: HTMLKompendiumNavigationElement;

    constructor() {
        this.setRoute = this.setRoute.bind(this);
        this.renderMenuItem = this.renderMenuItem.bind(this);
    }

    protected componentWillLoad(): void {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }

    protected componentDidUnload(): void {
        window.removeEventListener('hashchange', this.setRoute);
    }

    private setRoute() {
        this.route = location.hash.substr(1);
    }

    public render(): HTMLElement {
        return (
            <nav class="nav-panel">
                <a class="nav-panel__responsive-menu" onClick={this.toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </a>
                <header class="panel-header">
                    <h1>{this.renderHeader()}</h1>
                    <kompendium-search />
                </header>
                {this.renderChapters(this.menu)}
            </nav>
        );
    }

    private renderHeader() {
        let content = this.header;

        if (this.logo) {
            content = <img alt={this.header} src={this.logo} />;
        }

        return <a href="#">{content}</a>;
    }

    private toggleMenu = () => {
        const panel = this.host.shadowRoot.querySelector('.nav-panel');
        if (!panel) {
            return;
        }

        panel.classList.toggle('display-nav-panel');
    };

    private renderChapters(menu: MenuItem[]) {
        if (!menu || !menu.length) {
            return;
        }

        return <ul class="panel-list">{menu.map(this.renderMenuItem)}</ul>;
    }

    private renderMenuItem(item: MenuItem) {
        const classList = {
            active: this.isRouteActive(item.path),
            chapters: true,
            'panel-list': true,
        };
        const anchorClassList = {
            'panel-link': true,
            active: this.isRouteActive(item.path),
        };
        const chapters = item.children || [];
        const path = getAssetPath(
            '../collection/assets/icons/arrow-right-s-line.svg'
        );

        return (
            <li class="panel-item">
                <a class={anchorClassList} href={'#' + item.path}>
                    <img src={path} />
                    <span class="link-text">{item.title}</span>
                </a>
                <ul class={classList}>{chapters.map(this.renderMenuItem)}</ul>
            </li>
        );
    }

    private isRouteActive(route: string) {
        return this.route.startsWith(route);
    }
}

// function hasContent(item: MenuItem) {
//     return item.children?.length > 0;
// }
