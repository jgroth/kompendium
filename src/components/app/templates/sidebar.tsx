import { h, FunctionalComponent } from '@stencil/core';
import { App } from '../app';
import { JsonDocsComponent } from '@stencil/core/internal';

export const Sidebar: FunctionalComponent<{ component: App }> = ({component}) => {
    return (
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">
                <ul class="nav flex-column">
                    {component.docs.components.map(ListItem)}
                </ul>
            </div>
        </nav>
    );
}

const ListItem = (component: JsonDocsComponent) => {
    return (
        <li class="nav-item">
            <stencil-route-link
                class="nav-link"
                activeClass="active"
                url={`/component/${component.tag}`}
                exact={true}>
                    {component.tag}
                </stencil-route-link>
        </li>
    );
};
