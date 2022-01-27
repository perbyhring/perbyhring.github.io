# svelte-three

This library lets you create `three.js`-scenes in Svelte templates. It's heavily inspired by [react-three-fiber](https://github.com/react-spring/react-three-fiber).

Similarly to react-three-fiber, this is not a collection of wrapper components for each possible three.js-object.
If you have a look in the `src`-folder, you see that it only contains three component: [Renderer.svelte](./src/Renderer.svelte), [Three.svelte](./src/Three.svelte) and [Dom.svelte](./src/Dom.svelte).

`Renderer.svelte` is used to represent the `THREE.WebGLRenderer`-object.
`Three.svelte` is used to represent all other objects you can create with Three.js.
`Dom.svelte` is used to mix HTML-content into your 3d-scene.

## Examples:

