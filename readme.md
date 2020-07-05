# Kompendium

Kompendium is a simple tool for generating documentation for your Stencil components. Use it to get a compendium for your components together with component API and a live playground.

**Please note:** Kompendium is still in development. Consider this an early preview.

## Getting Started

Install it with NPM
```
npm install kompendium
```

Next, we need to configure it. Kompendium runs using the `docs-custom` target in the Stencil config. We also need to copy the Kompendium components to our `www` folder in order to use them with the Stencil dev server.

Below is a minimal `stencil.config.ts` to get you started

```typescript
import { Config } from '@stencil/core';
import { kompendium } from 'kompendium';

export const config: Config = {
    namespace: 'my-project',
    outputTargets: [
        {
            type: 'docs-custom',
            strict: true,
            generator: kompendium()
        },
        {
            type: 'www',
            serviceWorker: null,
            copy: [{
                src: '../node_modules/kompendium/dist/',
                dest: 'assets/kompendium/'
            }]
        }
    ]
};
```

To get the generated documentation up and running, simply use the `kompendium-app` component in your `index.html` file. Don't forget to also include the scripts and styles

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="description" content="My Stencil components">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <base href="/">
    <title>My Project</title>
</head>

<body>
    <link href="/build/my-project.css" rel="stylesheet" />
    <script type="module" src="/build/my-project.esm.js"></script>
    <script nomodule src="/build/my-project.js"></script>

    <link href="/assets/kompendium/kompendium/kompendium.css" rel="stylesheet" />
    <script type="module" src="/assets/kompendium/kompendium/kompendium.esm.js"></script>
    <script nomodule src="/assets/kompendium/kompendium/kompendium.js"></script>

    <kompendium-app></kompendium-app>
</body>
</html>
```

Now let's run it!

```
npm start
```
or
```
stencil build --dev --watch --serve --docs
```

## Roadmap

Some stuff that are still left to do

* Search
* Include other documentation, like markdown files
* Documentation for types, interfaces, classes etc.