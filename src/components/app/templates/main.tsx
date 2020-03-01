import { h, FunctionalComponent } from '@stencil/core';
import { App } from '../app';

export const Main: FunctionalComponent<{ component: App }> = ({ component }) => {
    return (
        <main role="main" class="col-md-5 ml-sm-auto col-lg-5 px-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
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
            </div>
        </main>
    );
}
