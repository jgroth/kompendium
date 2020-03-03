import { h, FunctionalComponent } from '@stencil/core';
import { App } from '../app';

export const Main: FunctionalComponent<{ component: App }> = ({ component }) => {
    return (
        <main role="main" >
            <stencil-router historyType="hash">
                <stencil-route-switch scrollTopOffset={0}>
                    <stencil-route
                        url="/"
                        component="maki-home"
                        exact={true}/>
                    <stencil-route
                        url="/component/:name"
                        component="maki-component"
                        componentProps={{
                            docs: component.data.docs
                        }}/>
                </stencil-route-switch>
            </stencil-router>
        </main>
    );
}
