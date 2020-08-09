# Getting started

## Installation

Kompendium is available as a package on NPM and is installed using the NPM CLI

```bash
npm install kompendium
```

### Configuration

Next, we need to configure Kompendium to generate our documentation. Kompendium runs using the `docs-custom` target in Stencil. We also need to copy the Kompendium components to our `www` folder in order to use them with the Stencil dev server.

{% code title="stencil.config.ts" %}
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
{% endcode %}

To get the generated documentation up and running, simply use the `kompendium-app` component in your `index.html` file. Don't forget to also include the scripts and styles, both for your own components and the ones that we copied during the build.

{% code title="index.html" %}
```markup
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
{% endcode %}

### Running the dev server

Next, we can start the dev server by running

```bash
stencil build --dev --watch --serve --docs
```

