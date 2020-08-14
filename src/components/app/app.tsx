import { Component, h, State, Prop } from '@stencil/core';
import { KompendiumData } from '../../types';
import { setTypes } from '../markdown/markdown-types';

@Component({
    tag: 'kompendium-app',
    styleUrl: 'app.scss',
    shadow: true,
})
export class App {
    /**
     * Path to `kompendium.json`
     */
    @Prop()
    public path = '/kompendium.json';

    @State()
    public data: KompendiumData;

    private socket: WebSocket;

    constructor() {
        this.onMessage = this.onMessage.bind(this);
    }

    protected componentWillLoad(): void {
        this.createWebSocket();
        this.fetchData();
    }

    private createWebSocket() {
        if (this.socket) {
            return;
        }

        const url = getSocketUrl(location);
        this.socket = new WebSocket(url);
        this.socket.addEventListener('message', this.onMessage);
    }

    private onMessage(event: MessageEvent) {
        try {
            const data = JSON.parse(event.data);
            if (data.buildLog?.progress === 1) {
                this.fetchData();
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async fetchData() {
        const data = await fetch(this.path);
        this.data = await data.json();
        const typeNames = this.data.types.map((type) => type.name);
        setTypes(typeNames);
    }

    protected render(): HTMLElement {
        if (!this.data) {
            return <div class="loading-screen"><div class="loading-screen-icon"></div><div class="loading-screen-text">Loading...</div></div>;
        }

        return (
            <div class="kompendium-body">
                <kompendium-navigation
                    menu={this.data.menu}
                    header={this.data.title}
                />
                <main role="main">
                    <stencil-router historyType="hash">
                        <stencil-route-switch scrollTopOffset={0}>
                            <stencil-route
                                url="/"
                                component="kompendium-markdown"
                                componentProps={{
                                    text: this.data.readme,
                                }}
                                exact={true}
                            />
                            <stencil-route
                                url="/component/:name/:section?"
                                component="kompendium-component"
                                componentProps={{
                                    docs: this.data.docs,
                                }}
                            />
                            <stencil-route
                                url="/type/:name"
                                component="kompendium-type"
                                componentProps={{
                                    types: this.data.types,
                                }}
                            />
                            <stencil-route
                                component="kompendium-guide"
                                componentProps={{
                                    data: this.data,
                                }}
                            />
                        </stencil-route-switch>
                    </stencil-router>
                </main>
            </div>
        );
    }
}

function getSocketUrl(location: Location) {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${location.hostname}:${location.port}/`;
}
