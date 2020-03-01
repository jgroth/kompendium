import { Component, h, Prop, State } from '@stencil/core';
import { MenuItem } from '../../maki/config';

@Component({
    tag: 'maki-navigation',
    styleUrl: 'navigation.scss',
    shadow: true
})
export class Navigation {

    @Prop()
    public menu: MenuItem[];

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
        const subMenu = rootMenu.find(item => item.path !== '/' && this.route.startsWith(item.path))?.children || [];

        console.log(this.route)
        return [
            <nav class="nav-bar">
                <ul class="nav-list">
                    {rootMenu.map(this.renderMenuItem)}
                </ul>
            </nav>,
            <nav class="nav-panel">
                <ul class="panel-list">
                    {subMenu.map(this.renderPanelMenuItem)}
                </ul>
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
                <stencil-route-link class="nav-link">
                    <i class={`fas fa-${item.icon}`}></i>
                </stencil-route-link>
            );
        }

        return (
            <stencil-route-link
                class="nav-link"
                activeClass="active"
                url={item.path}
            >
                <span class="bubble">
                    <i class={`fas fa-${item.icon}`}></i>
                </span>
            </stencil-route-link>
        );
    }

    private renderPanelMenuItem(item: MenuItem) {
        const classList = {
            active: this.route.startsWith(item.path),
            chapters: true,
            'panel-list': true
        };
        const chapters = item.children || [];

        return (
            <li class="panel-item">
                <stencil-route-link
                    class="panel-link"
                    activeClass="active"
                    url={item.path}
                >
                    <span class="link-text">
                        <i class="fas fa-chevron-right"></i>
                        {item.title}
                    </span>
                </stencil-route-link>
                <ul class={classList}>
                    {chapters.map(this.renderPanelMenuItem)}
                </ul>
            </li>
        );
    }
}

