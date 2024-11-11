import { Component, h, State, Prop, Watch } from '@stencil/core';
import { KompendiumData, KompendiumDocument } from '../../types';
import { setTypes } from '../markdown/markdown-types';
import Fuse from 'fuse.js';
import { PropsFactory } from '../playground/playground.types';

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

    /**
     * Factory for creating props for example components
     */
    @Prop()
    public examplePropsFactory?: PropsFactory;

    @State()
    public data: KompendiumData;

    @State()
    private index: Fuse<KompendiumDocument>;

    private socket: WebSocket;

    constructor() {
        this.onMessage = this.onMessage.bind(this);
    }

    protected componentWillLoad(): void {
        this.createWebSocket();
        this.fetchData();
    }

    @Watch('data')
    protected watchData(): void {
        const options: Fuse.IFuseOptions<KompendiumDocument> = {
            includeScore: true,
            includeMatches: true,
            ignoreLocation: true,
            threshold: 0.4,
        };
        const index = Fuse.parseIndex(this.data.index.data);

        this.index = new Fuse<KompendiumDocument>(
            this.data.index.documents,
            options,
            index,
        );
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
            // eslint-disable-next-line no-console
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
            return (
                <div class="loading-screen">
                    <div class="loading-screen-icon"></div>
                    <div class="loading-screen-text">Loading...</div>
                </div>
            );
        }

        const routes = [
            {
                path: '/',
                name: 'kompendium-markdown',
                props: { text: this.data.readme },
            },
            {
                path: '/component/:name/:section?',
                name: 'kompendium-component',
                props: {
                    docs: this.data.docs,
                    schemas: this.data.schemas,
                    examplePropsFactory: this.examplePropsFactory,
                },
            },
            {
                path: '/type/:name',
                name: 'kompendium-type',
                props: {
                    types: this.data.types,
                },
            },
            {
                path: '/debug/:name',
                name: 'kompendium-debug',
                props: {
                    docs: this.data.docs,
                    schemas: this.data.schemas,
                    examplePropsFactory: this.examplePropsFactory,
                },
            },
            {
                path: '',
                name: 'kompendium-guide',
                props: {
                    data: this.data,
                },
            },
        ];

        return (
            <div class="kompendium-body">
                <kompendium-navigation
                    menu={this.data.menu}
                    header={this.data.title}
                    logo={this.data.logo}
                    index={this.index}
                />
                <main role="main">
                    <kompendium-router routes={routes} />
                </main>
            </div>
        );
    }
}

function getSocketUrl(location: Location) {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';

    return `${protocol}//${location.hostname}:${location.port}/`;
}
