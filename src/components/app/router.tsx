import { Component, FunctionalComponent, h, Prop, State } from '@stencil/core';
import { URLPattern } from 'urlpattern-polyfill';

type MatchedComponent = {
    name: string;
    props?: Record<string, string | number>;
};

type RoutedComponent = {
    path: string;
    name: string;
    props?: Record<string, string | number>;
};

const ComponentTemplate: FunctionalComponent<MatchedComponent> = (
    props,
    children,
) => {
    const Name = props.name;

    return <Name {...props.props}>{children}</Name>;
};

@Component({
    tag: 'kompendium-router',
    shadow: true,
})
export class Router {
    @Prop()
    public routes: RoutedComponent[];

    @State()
    private matchedComponent: MatchedComponent | undefined;

    public componentWillLoad() {
        const location = window.location;
        this.setMatchedComponent(location);
    }

    public render() {
        if (!this.matchedComponent) {
            return '404';
        }

        return <ComponentTemplate {...this.matchedComponent} />;
    }

    private setMatchedComponent(location: Location) {
        const component = this.findComponent(location);

        if (component !== this.matchedComponent) {
            this.matchedComponent = component;
        }
    }

    private findComponent(location: Location): MatchedComponent | undefined {
        const matchedRoute = this.routes.find(this.isMatched(location));
        if (!matchedRoute) {
            return;
        }

        const path = matchedRoute.path;
        const pattern = new URLPattern({ hash: path });
        const match = pattern.exec(location.href);
        const props = this.parseProps(match?.hash.groups);

        return {
            name: matchedRoute.name,
            props: {
                ...props,
                ...matchedRoute.props,
            },
        };
    }

    private isMatched = (location: Location) => (route: RoutedComponent) => {
        const pattern = new URLPattern({
            hash: route.path,
        });

        return pattern.test(location.href);
    };

    private parseProps(
        groups: Record<string, string | undefined> = {},
    ): Record<string, string | number | undefined> {
        return Object.fromEntries(
            Object.entries(groups).map(([key, value]) => [
                key,
                isNaN(Number(value)) ? value : Number(value),
            ]),
        );
    }
}
