# svelte-pixi

`svelte-pixi` helps you create [pixi.js](https://www.pixijs.com/)-projects as reactive svelte-components.

It's kinda like a reconciler between svelte and pixi.js. If you look in the src-folder, you will see there is only two svelte-components there:

- Pixi.svelte: Which is used to represent every pixi.js-object.
- Dom.svelte: Which is used to mix regular DOM-elements into your pixi.js-scene.

## Content

- Installation & Setup

## Installation & Setup

First install [the standard rollup template for svelte-projects](https://github.com/sveltejs/template).

Next you need to install `svelte-pixi` and `pixi.js`:
```
npm install --save pixi.js @perbyhring/svelte-pixi
```

You need to make one small edit to `rollup.config.js`, or `pixi.js` will throw an error:
```
resolve({
  ...,
  preferBuiltins: false // ADD THIS LINE
})
```

Since `svelte-pixi` isn't tied to a specific version of `pixi.js`, you need to link the two libraries together. To do so, add these lines to your `main.js`-file:
```
import * as PIXI from 'pixi.js'
import { linkPixi } from 'svelte-pixi'
linkPixi(PIXI)
```

Now you're all set up!

Check out [these examples](LINK TO EXAMPLES) to get a gist of how `svelte-pixi` can be used, or read on.
