import { Component, h, Prop, State } from '@stencil/core';
import { MenuItem } from '../../kompendium/config';

@Component({
    tag: 'kompendium-navigation',
    styleUrl: 'navigation.scss',
    shadow: true
})
export class Navigation {

    @Prop()
    public menu: MenuItem[];

    @Prop()
    public title: string;

    @State()
    private route: string = '';

    constructor() {
        this.renderMenuItem = this.renderMenuItem.bind(this);
        this.setRoute = this.setRoute.bind(this);
        this.renderPanelMenuItem = this.renderPanelMenuItem.bind(this)
    }

    protected componentWillLoad() {
        window.addEventListener('hashchange', this.setRoute);
        this.setRoute();
    }

    protected componentDidUnload() {
        window.removeEventListener('hashchange', this.setRoute);
    }

    private setRoute() {
        this.route = location.hash.substr(1);
    }

    public render() {
        const rootMenu = [{
            path: '/',
            icon: 'crow'
        }, {
            path: '/search',
            icon: 'search'
        },
        ...this.menu
        ];
        const subMenu = rootMenu
            .filter(item => item.path !== '/')
            .find(item => this.isRouteActive(item.path))?.children || [];

        return [
            <nav class="nav-bar">
                <ul class="nav-list">
                    {rootMenu.map(this.renderMenuItem)}
                </ul>
            </nav>,
            <nav class="nav-panel">
                <header class="panel-header">
                    <h1>{this.title}</h1>
                </header>
                {this.renderPanelContent(subMenu)}
            </nav>
        ];
    }

    private renderMenuItem(item: MenuItem) {
        return (
            <li class="nav-item">
                {this.renderLink(item)}
            </li>
        );
    }

    private renderLink(item: MenuItem) {
        if (item.path === '/') {
            return (
                <a class="nav-link">
                    <i class={`fas fa-${item.icon}`}></i>
                </a>
            );
        }

        const classList = {
            'nav-link': true,
            active: this.isRouteActive(item.path),
        };

        return (
            <a class={classList} href={'#' + item.path}>
                <span class="bubble">
                    <i class={`fas fa-${item.icon}`}></i>
                </span>
            </a>
        );
    }

    private renderPanelContent(menu: MenuItem[]) {
        if (this.route === '/search') {
            return <kompendium-search />;
        }

        return (
            <ul class="panel-list">
                {menu.map(this.renderPanelMenuItem)}
            </ul>
        );
    }

    private renderPanelMenuItem(item: MenuItem) {
        const classList = {
            active: this.isRouteActive(item.path),
            chapters: true,
            'panel-list': true
        };
        const anchorClassList = {
            'panel-link': true,
            active: this.isRouteActive(item.path),
        };
        const chapters = item.children || [];

        return (
            <li class="panel-item">
                <a class={anchorClassList} href={'#' + item.path}>
                    <span class="link-text">
                        <i class="fas fa-chevron-right"></i>
                        {item.title}
                    </span>
                </a>
                <ul class={classList}>
                    {chapters.map(this.renderPanelMenuItem)}
                </ul>
            </li>
        );
    }

    private isRouteActive(route: string) {
        return this.route.startsWith(route);
    }
}
