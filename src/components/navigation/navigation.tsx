import { Component, h, Prop, State, getAssetPath } from '@stencil/core';
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

    /**
     * Index containing searchable documents
     */
    @Prop()
    public index: any;

    @State()
    private route = '';

    @State()
    private displayNavPanel = false;

    constructor() {
        this.setRoute = this.setRoute.bind(this);
        this.renderMenuItem = this.renderMenuItem.bind(this);
    }

    protected connectedCallback(): void {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }

    protected disconnectedCallback(): void {
        window.removeEventListener('hashchange', this.setRoute);
    }

    private setRoute() {
        this.route = location.hash.substr(1);
    }

    public render(): HTMLElement[] {
        return [
            <div
                class={{
                    'nav-panel-scrim': true,
                    'display-nav-panel': this.displayNavPanel,
                }}
                onClick={this.toggleMenu}
            ></div>,
            <nav
                class={{
                    'nav-panel': true,
                    'display-nav-panel': this.displayNavPanel,
                }}
                onClick={this.stopPropagationOfNavClick}
            >
                <a class="nav-panel__responsive-menu" onClick={this.toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </a>
                <header class="panel-header">
                    <div class="branding-and-mode">
                        <h1>{this.renderHeader()}</h1>
                        <kompendium-darkmode-switch />
                    </div>
                    <kompendium-search index={this.index} />
                </header>
                {this.renderChapters(this.menu)}
            </nav>,
        ];
    }

    private renderHeader() {
        let content = this.header;

        if (this.logo) {
            content = <img alt={this.header} src={this.logo} />;
        }

        return <a href="#">{content}</a>;
    }

    private toggleMenu = () => {
        this.displayNavPanel = !this.displayNavPanel;
    };

    private renderChapters(menu: MenuItem[]) {
        if (!menu || !menu.length) {
            return;
        }

        return (
            <ul class="panel-list">
                {menu.map(this.renderMenuItem)}
                <div class="powered-by">
                    <p>
                        Powered by&nbsp;
                        <a href="https://github.com/jgroth/kompendium">
                            Kompendium
                        </a>
                    </p>
                </div>
            </ul>
        );
    }

    private renderMenuItem(item: MenuItem) {
        const classList = {
            active: this.isRouteActive(item.path),
            chapters: true,
            'panel-list': true,
        };
        const chapters = item.children || [];
        const anchorClassList = {
            'panel-link': true,
            active: this.isRouteActive(item.path),
            'has-children': !!chapters.length,
        };
        const path = getAssetPath(
            '../collection/assets/icons/arrow-right-s-line.svg'
        );
        const anchorAdditionalProps: any = {};
        if (!chapters.length) {
            anchorAdditionalProps.onClick = this.toggleMenu;
        }

        return (
            <li class="panel-item">
                <a
                    class={anchorClassList}
                    href={'#' + item.path}
                    {...anchorAdditionalProps}
                >
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

    private stopPropagationOfNavClick = (event: MouseEvent) => {
        event.stopPropagation();
    };
}

// function hasContent(item: MenuItem) {
//     return item.children?.length > 0;
// }
