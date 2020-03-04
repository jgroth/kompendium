import { Component, h, Host, State, Prop, FunctionalComponent, Method, EventEmitter, Event } from '@stencil/core';
import { Main } from './templates/main';
import { Examples } from './templates/examples';
import { KompendiumData } from '../../kompendium/config';

/**
 * The summary section should be brief. On a documentation web site,
 * it will be shown on a page that lists summaries for many different
 * API items.  On a detail page for a single item, the summary will be
 * shown followed by the remarks section (if any).
 *
 * @remarks
 *
 * The main documentation for an API item is separated into a brief
 * "summary" section optionally followed by an `@remarks` block containing
 * additional details.
 *
 * Unlike the summary, the remarks block may contain lengthy documentation
 * content.  The remarks should not restate information from the summary,
 * since the summary section will always be displayed wherever the remarks
 * section appears.  Other sections (e.g. an `@example` block) if shown
 * will usually appear after the remarks section.
 *
 * Code samples can be enclosed in a Markdown code fence:
 * ```ts
 * function getAverage(x, y) {
 *   return (x + y) / 2.0;
 * }
 * ```
 *
 * If you use special symbols and don't want to use a code span, you can
 * escape them using backslashes:
 *
 * This will be a list
 * - The first item is the best
 * - Second is also quite good
 * - This is the worst of them all
 *
 * @sampleCustomBlockTag
 *
 * You can define your own custom block tags and tell the parser about them.
 * The playground doesn't render this block, but your own tooling could do that.
 *
 * @privateRemarks
 *
 * The `@privateRemarks` tag starts a block of additional commentary that is not meant
 * for an external audience.  A documentation tool must omit this content from an
 * API reference web site.  It should also be omitted when generating a normalized
 * *.d.ts file.
 *
 * Modifiers look like block tags, but they do not start a documentation block.
 * For example this `@sealed` tag tells us that nobody should inherit from the
 * class.  But if text appeared after it, that text would get attached to the
 * previous block.
 *
 * @sealed
 * @example test-component
 */
@Component({
    tag: 'kompendium-app',
    styleUrl: 'app.scss',
    shadow: true
})
export class App {
    /**
     * Some text here!
     * @deprecated not really
     * @foo bar
     */
    @Prop()
    public fooBar: string = 'baz';

    @Prop()
    public path: string = '/.kompendium/kompendium.json';

    @State()
    public data: KompendiumData;

    /**
     * gfg
     * @todo gg
     */
    @Event()
    public foobar: EventEmitter<string>;

    constructor() {
    }

    protected componentWillLoad() {
        this.fetchData();
    }

    private async fetchData() {
        const data = await fetch(this.path);
        this.data = await data.json();
    }

    protected render() {
        return (
            <Host>
                <AppPage component={this} />
            </Host>
        );
    }

    /**
     * Don't call this
     *
     * @param s - some text
     * @
     *
     * @deprecated foobar
     * @returns qwertyy
     */
    @Method({})
    public async test(s: string, flag: boolean) {
        return s;
    }
}

const AppPage: FunctionalComponent<{ component: App }> = ({ component }) => {
    if (!component.data) {
        return <div>Loadings...</div>;
    }


    return (
        <div class="kompendium-body">

            <kompendium-navigation menu={component.data.menu} title={component.data.title}/>
            <Main component={component} />
            <Examples component={component} />
        </div>
    );
}
