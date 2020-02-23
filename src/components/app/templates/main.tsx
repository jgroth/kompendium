import { h, FunctionalComponent } from '@stencil/core';
import { App } from '../app';
import { JsonDocs } from '@stencil/core/internal';

export const Main: FunctionalComponent<{ component: App }> = ({ component }) => {
    return (
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                {getDocs(component.route, component.docs)}
            </div>
        </main>
    );
}

function getDocs(route: string, docs: JsonDocs) {
    const tag = route.split('/').slice(-1)[0];
    const component = docs.components.find(doc => doc.tag === tag);
    if (!component || !component.docs) {
        return;
    }

    return <maki-markdown text={component.docs} />
}
