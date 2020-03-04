import { h, FunctionalComponent } from '@stencil/core';
import { App } from '../app';

export const Main: FunctionalComponent<{ component: App }> = ({ component }) => {
    return (
        <main role="main" >
            <stencil-router historyType="hash">
                <stencil-route-switch scrollTopOffset={0}>
                    <stencil-route
                        url="/"
                        component="kompendium-home"
                        exact={true}/>
                    <stencil-route
                        url="/component/:name"
                        component="kompendium-component"
                        componentProps={{
                            docs: component.data.docs
                        }}/>
                </stencil-route-switch>
            </stencil-router>
        </main>
    );
}
